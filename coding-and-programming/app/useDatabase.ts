import * as SQLite from "expo-sqlite";

// Open the SQLite database
const db = SQLite.openDatabaseSync("transactions.db");

/* create table transactions */
export const setupDatabase = () => {
    db.execAsync(
      `CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category INTEGER NOT NULL,
    icon TEXT NOT NULL,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    amount REAL NOT NULL,
    description TEXT
    );`
    )
      .then(() => console.log("Table created successfully"))
      .catch((error) => console.error("Error creating table", error));
  };

/** drop table transactions */
export const dropTransactionTable = async () => {
    try {
      await db.execAsync(`DROP TABLE IF EXISTS transactions;`);
      console.log("Table 'transactions' dropped successfully");
    } catch (error) {
      console.error("Error dropping table", error);
    }
  };


  const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  
/* insert an array to table transaction */
export const insertTransactionsAsArray = async (transactions: Array<{
    id: string;
    category: string;
    icon: string;
    title: string;
    amount: string;
    date: string;
    description: string;
  }>) => {
    console.log("feeding array length is: " + transactions.length);
    try {
      // Create a string of SQL queries to insert all transactions
      let queryString = '';
      transactions.forEach(transaction => {
        let category_random = getRandomInt(1, 7);
        queryString += `INSERT INTO transactions (category, icon, title, amount, date, description) VALUES ( '${transaction.category}','${transaction.icon}','${transaction.title}', ${transaction.amount}, '${transaction.date}', '${transaction.description}'); `;
        console.log("transaction detail:category is: " + transaction.category + "amount is:" + transaction.amount); // add category information later
      });
      console.log("insertTransactionsAsArray sql string is:" + queryString);
      // Execute all queries in one batch using execAsync
      await db.execAsync(queryString);
  
      //console.log("All transactions inserted successfully");
    } catch (error) {
      console.error("Error inserting transactions:", error);
    }
  };
    
  export const dumpArrayToTransaction = async (transactionsTable: Array<{
    id: string;
    category: string;
    icon: string;
    title: string;
    amount: string;
    date: string;
    description: string;
    }>) => {
      console.log("dumpArrayToTransaction start!");
    // drop table if exist
    dropTransactionTable();
          
    // create table 
    setupDatabase();
    console.log("before dump, feeding array length is: " + transactionsTable.length);
    // insert into table transaction with array
    insertTransactionsAsArray(transactionsTable);

    fetchTransactions();
   } 


/** insert a rwo into table transactions */    
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
  
/** query table categories to list all  */
export const fetchTransactions = async ( ): Promise<any[]> => {
  try {
    //console.log("fetchTransactions");
    let query = `
    SELECT * FROM transactions;
    `;
    const params: any[] = [];
    const result = await db.getAllAsync(query, params); 
    console.log("fetchTransactions:result length is" + result.length);
    return result ?? []; // Ensure an array is always returned
  } catch (error) {
    console.error("Error fetching Transaction data", error);
    return []; // Return an empty array in case of error
  }
};


export const deleteAllTransactions = async (
  ) => {
  try {
    await db.runAsync(
      `delete from transactions;`,[]
    );
    console.log("Data delete all successfully");
  } catch (error) {
    console.error("Error deleting data", error);
  }
};


/* query table transactions by category and expense, feeding bar chart*/
export const fetchExpenseTransactionsByCategory = async (startDate: Date,
  endDate: Date): Promise<any[]> => {
    try {
      let query = `
      SELECT category, SUM(amount*(1))*(-1)  as total FROM transactions WHERE amount <=0 and date BETWEEN ? AND ? GROUP BY category;
      `;
      const params: any[] = [startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]];

      const result = await db.getAllAsync(query, params); 
     //console.log('fetchExpenseTransactionsByCategory: result is:' + result);
      return result ?? []; // Ensure an array is always returned
    } catch (error) {
      console.error("Error fetching expense data", error);
      return []; // Return an empty array in case of error
    }
  };

  /**search table transaction */
  export const searchTransactions = async (selectedColumn: string,
    searchValue: string): Promise<any[]> => {
      try {
        const query = `SELECT * FROM transactions WHERE ${selectedColumn} LIKE ?;`;
      const params = [`%${searchValue}%`];
  
      const result = await db.getAllAsync(query, params);  
       
        return result ?? []; 
      } catch (error) {
        console.error("Error search transaction data", error);
        return []; // Return an empty array in case of error
      }
    };

  /** query table transactions by category,and income, feeding bar chart */
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
  
  
/** query table transaction to get summery report, feeding bar chart */  
export const getSummary = async (
  startDate: Date,
  endDate: Date,
  period: string,
  category: string
): Promise<ChartDataType> => {
  const groupBy = period === 'weekly' ? "%Y-W%W" : "%Y-%m";
 
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

/** Create table periodicTransactions */
export const createTablePeriodic = () => {
  db.execAsync(
    `CREATE TABLE IF NOT EXISTS periodicTransactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category INTEGER NOT NULL,
    icon TEXT,
    title TEXT NOT NULL,
    times TEXT,
    numOfPeriods TEXT,
    frequency TEXT,
    amount TEXT,
    description TEXT,
    nextDueDate TEXT
);`
  )
    .then(() => console.log("Table periodicTransactions created successfully"))
    .catch((error) => console.error("Error creating table", error));
};


/* insert an array to table Periodic transaction */
export const insertPeriodicTransactionsAsArray = async (transactions: Array<{
  id:  string;
  category: string;
  icon: string;
  title: string;
  times: string;
  numOfPeriods: string;
  frequency: string;
  amount: string;
  description: string;
  nextDueDate: Date | null;
}>) => {
  try {
    //console.log("insertPeriodicTransactionsAsArray start!!!!!!!!!!!!");
    // Create a string of SQL queries to insert all transactions
    let queryString = '';
    transactions.forEach(transaction => {
      queryString += `INSERT INTO periodicTransactions (category, icon, title, times, numOfPeriods, frequency, amount, description, nextDueDate) VALUES (${transaction.category}, '${transaction.icon}', '${transaction.title}', '${transaction.times}', '${transaction.numOfPeriods}', '${transaction.frequency}', ${transaction.amount}, '${transaction.description}', '${transaction.nextDueDate}'); `;
    });
    //console.log("query string is:" + queryString);
    // Execute all queries in one batch using execAsync
    await db.execAsync(queryString);

    console.log("All periodicTransactions inserted successfully");
  } catch (error) {
    console.error("Error inserting periodicTransactions:", error);
  }
};
  
  
  
/** insert a rwo into table  Periodictransactions */    
export const insertPeriodicTransaction = async (
  category: number,
  icon: string,
  title: string,
  times: string,
  numOfPeriods: string,
  frequency: string,
  amount: number,
  description: string,
  nextDueDate: string 
) => {
  try {
    await db.runAsync(
      `INSERT INTO periodicTransactions (category, icon, title, times, numOfPeriods, frequency, amount, description, nextDueDate)  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [category, icon, title, times, numOfPeriods, frequency, amount, description, nextDueDate]
    );
    console.log("Data inserted successfully");
  } catch (error) {
    console.error("Error inserting data", error);
  }
};



export const insertIfPeriodicEmpty = async (categoriesArray: {icon: string; title: string }[]) => {
  try {

  

    // Check if the categories table is empty
    /*const result = await db.getAllAsync(`SELECT COUNT(*) as count FROM categories;`);*/
    if((await fetchCategories()).length ==0)
    {
        console.log("periodicTransactions table is empty. Inserting default periodicTransactions...");

      for (const category of categoriesArray) {
        await db.runAsync(
          `INSERT INTO periodicTransactions (icon, title) VALUES (?, ?);`,
          [category.icon, category.title]
        );
      }
      console.log("Default periodicTransactions inserted successfully.");
    } else {
      console.log("periodicTransactions table already has data.");
    }
  } catch (error) {
    console.error("Error checking or inserting periodicTransactions:", error);
  }
};


/** query table categories to list all  */
export const fetchPeriodic = async ( ): Promise<any[]> => {
  try {
   // console.log("fetchPeriodic");
    let query = `
    SELECT * FROM periodicTransactions;
    `;
    const params: any[] = [];
    const result = await db.getAllAsync(query, params); 
    return result ?? []; // Ensure an array is always returned
  } catch (error) {
    console.error("Error fetching Income data", error);
    return []; // Return an empty array in case of error
  }
};


/** Create table categories */
export const createTableCategories = () => {
  db.execAsync(
    `CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        icon TEXT,
        title TEXT
      );`
  )
    .then(() => console.log("Table categories created successfully"))
    .catch((error) => console.error("Error creating table", error));
};

/** insert one row into table categories*/
export const insertCategories = async (
  icon: string,
  title: string
  ) => {
  try {
    await db.runAsync(
      `INSERT INTO categories (icon, title) VALUES (?, ?);`,
      [icon, title]
    );
    console.log("Data inserted successfully");
  } catch (error) {
    console.error("Error inserting data", error);
  }
};


/** query table categories to list all  */
export const fetchCategories = async ( ): Promise<any[]> => {
  try {
    //console.log("fetchCategories");
    let query = `
    SELECT * FROM categories;
    `;
    const params: any[] = [];
    const result = await db.getAllAsync(query, params); 
    return result ?? []; // Ensure an array is always returned
  } catch (error) {
    console.error("Error fetching Category data", error);
    return []; // Return an empty array in case of error
  }
};

/*export const fetchCategories = async (): Promise<any[]> => {
  try {
    const result = await db.execAsync(`SELECT * FROM categories;`);
    return result?.[0]?.rows ?? []; // Ensure an array is returned
  } catch (error) {
    console.error("❌ Error fetching categories", error);
    return []; // Return an empty array if an error occurs
  }
};*/



export const insertIfCategoriesEmpty = async (categoriesArray: {icon: string; title: string }[]) => {
  try {


    // Check if the categories table is empty
    /*const result = await db.getAllAsync(`SELECT COUNT(*) as count FROM categories;`);*/
    if((await fetchCategories()).length ==0)
    {
        console.log("Categories table is empty. Inserting default categories...");

      for (const category of categoriesArray) {
        await db.runAsync(
          `INSERT INTO categories (icon, title) VALUES (?, ?);`,
          [category.icon, category.title]
        );
      }
      console.log("Default categories inserted successfully.");
    } else {
      console.log("categories table already has data.");
    }
  } catch (error) {
    console.error("Error checking or inserting categories:", error);
  }
};




export default db;
