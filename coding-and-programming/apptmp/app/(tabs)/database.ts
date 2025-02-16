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
      .then(() => console.log("✅ Table created successfully"))
      .catch((error) => console.error("❌ Error creating table", error));
  };


export const dropTransactionTable = async () => {
    try {
      await db.execAsync(`DROP TABLE IF EXISTS transactions;`);
      console.log("✅ Table 'transactions' dropped successfully");
    } catch (error) {
      console.error("❌ Error dropping table", error);
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
  
      console.log("✅ All transactions inserted successfully");
    } catch (error) {
      console.error("❌ Error inserting transactions:", error);
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
      console.log("✅ Data inserted successfully");
    } catch (error) {
      console.error("❌ Error inserting data", error);
    }
  };
  


export const fetchTransactionsByCategory = async (): Promise<any[]> => {
    try {
      const result = await db.getAllAsync(
        `SELECT category, SUM(amount) as total FROM transactions GROUP BY category;`
      );
  
      return result ?? []; // Ensure an array is always returned
    } catch (error) {
      console.error("❌ Error fetching data", error);
      return []; // Return an empty array in case of error
    }
  };
  
export default db;
