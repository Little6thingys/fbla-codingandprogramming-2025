import * as SQLite from "expo-sqlite";

// Open the SQLite database
const db = SQLite.openDatabaseSync("transactions.db");


export const setupDatabase = () => {
    db.execAsync(
      `CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category INTEGER NOT NULL,
    title TEXT NOT NULL,
    amount REAL NOT NULL,
    date TEXT NOT NULL,
    periodic BOOLEAN NOT NULL,
    frequency TEXT
);`
    )
      .then(() => console.log("Table created successfully"))
      .catch((error) => console.error("Error creating table", error));
  };


export const dropTransactionTable = async () => {
    try {
      await db.execAsync(`DROP TABLE IF EXISTS transactions;`);
      console.log("Table 'transactions' dropped successfully");
    } catch (error) {
      console.error("Error dropping table", error);
    }
  };

// Function to insert a transaction
export const insertTransactionsAsArray = async (transactions: Array<{
    
    category: number;
    title: string;
    amount: number;
    date: string;
    periodic: boolean;
    frequency: string | null;
  }>) => {
    try {
      // Create a string of SQL queries to insert all transactions
      let queryString = '';
      transactions.forEach(transaction => {
        queryString += `INSERT INTO transactions (category, title, amount, date, periodic, frequency) VALUES (${transaction.category}, '${transaction.title}', ${transaction.amount}, '${transaction.date}', ${transaction.periodic}, '${transaction.frequency || ''}'); `;
      });
  
      // Execute all queries in one batch using execAsync
      await db.execAsync(queryString);
  
      console.log("All transactions inserted successfully");
    } catch (error) {
      console.error("Error inserting transactions:", error);
    }
  };
    
    
    
    
export const insertTransaction = async (
    category: number,
    title: string,
    amount: number,
    date: string,
    periodic: boolean
  ) => {
    try {
      await db.runAsync(
        `INSERT INTO transactions (category, title, amount, date, periodic) VALUES (?, ?, ?, ?, ?);`,
        [category, title, amount, date, periodic]
      );
      console.log("Data inserted successfully");
    } catch (error) {
      console.error("Error inserting data", error);
    }
  };
  


export const fetchExpenseTransactionsByCategory = async (startDate: Date,
  endDate: Date): Promise<any[]> => {
    try {
      let query = `
      SELECT category, SUM(amount*(1))*(-1)  as total FROM transactions WHERE amount <=0 and date BETWEEN ? AND ? GROUP BY category;
      `;
      const params: any[] = [startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]];

      const result = await db.getAllAsync(query, params); 
      console.log('result is:' + result);
      return result ?? []; // Ensure an array is always returned
    } catch (error) {
      console.error("Error fetching expense data", error);
      return []; // Return an empty array in case of error
    }
  };

  export const fetchIncomeTransactionsByCategory = async ( startDate: Date,
    endDate: Date): Promise<any[]> => {
    try {
      let query = `
      SELECT category, SUM(amount) as total FROM transactions WHERE amount >0 and date BETWEEN ? AND ? GROUP BY category;
      `;
      const params: any[] = [startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]];
      const result = await db.getAllAsync(query, params); 
      return result ?? []; // Ensure an array is always returned
    } catch (error) {
      console.error("Error fetching Income data", error);
      return []; // Return an empty array in case of error
    }
  };


  type ChartDataType = {
    label: string;
    income: number;
    expenses: number;
  }[];
  
  
  
export const getSummary = async (
  startDate: Date,
  endDate: Date,
  period: string,
  category: string
): Promise<ChartDataType> => {
  const groupBy = period === 'weekly' ? "%Y-W%W" : "%Y-%m";
 
 /* let query = `
    SELECT strftime(?, date) AS period, 
     6 AS total_expenses,
           8 AS total_income
          
    FROM transactions
    WHERE date BETWEEN ? AND ?
  `;*/
let query = `
    SELECT strftime(?, date) AS period, 
           SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) AS total_income,
           SUM(CASE WHEN amount < 0 THEN -amount ELSE 0 END) AS total_expenses
    FROM transactions
    WHERE date BETWEEN ? AND ?
  `; 
  const params: any[] = [groupBy, startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]];

  if (category !== 'All') {
    query += ` AND category = ?`;
    params.push(category);
  }

  query += ` GROUP BY period ORDER BY period DESC;`;

  try {
    const rows = await db.getAllAsync(query, params); 
    //console.log("rows is:"+ rows[0].total_expenses);
    return rows.map((row: any) => ({
      label: row.period,
      income: row.total_income,
      expenses: row.total_expenses,
    }));
  } catch (error) {
    
    console.error("Error executing query:", error);
    return [];
  }
};

export default db;
