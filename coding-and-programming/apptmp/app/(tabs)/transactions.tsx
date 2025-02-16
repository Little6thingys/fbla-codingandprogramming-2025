import React, { useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, Switch, StyleSheet } from "react-native";
import { List, IconButton } from 'react-native-paper';

 
import { dropTransactionTable, setupDatabase, insertTransaction, insertTransactionsAsArray } from "./database";



export default function TransactionsScreen() {
  const [data, setData] = useState([
    { id: "1", category : "1", title: "Ordered Food", date: "12/09/2024", amount: "-15", periodic: false, frequency: "" },
    { id: "2", category : "2",  title: "Bought Clothes", date: "12/07/2024", amount: "-30", periodic: false, frequency:"" }, 
    { id: "3", category : "3",  title: "Found Money on Ground", date: "12/06/2024", amount: "5", periodic: false, frequency:"" },
    { id: "4", category : "4", title: "idk at this point", date: "12/06/2024", amount: "5", periodic: false , frequency:""},
  ]);

  /*CREATE TABLE IF NOT EXISTS transaction (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category INTEGER NOT NULL,
    title TEXT NOT NULL,
    amount REAL NOT NULL,
    date TEXT NOT NULL,
    periodic BOOLEAN NOT NULL,
    frequency TEXT
);
*/

  const addRow = () => {
    const newRow = {
      id: "1",
      category: "1",
      title: "New Item",
      date: "MM/DD/YYYY",
      amount: "0.00",
      periodic: false,
      frequency: "weekly"
    };
    setData([...data, newRow]);
  };

  const transactionsTable = [
    { category: 1, title: "Groceries", amount: 50.75, date: "2025-02-13", periodic: false, frequency: "" },
    { category: 2, title: "Netflix", amount: 15.99, date: "2025-02-14", periodic: true, frequency: "monthly" },
    { category: 3, title: "Salary", amount: 1200, date: "2025-02-15", periodic: false, frequency: "" },
  ];

  const updateRow = (id: string, field: string , value: string) => {
    setData(data.map(item => (item.id === id ? { ...item, [field]: value } : item)));
    // drop table if exist
    dropTransactionTable();
    // create table 
    setupDatabase();
    // insert into table transaction or update table transaction
    insertTransactionsAsArray(transactionsTable);
  };

    

  type TransactionEntry = {
    id: string;
    category: string;
    title: string;
    date: string;
    amount: string;
    periodic: boolean;
    frequency: string;
  };
  
  const renderItem = ({ item }: { item: TransactionEntry }) => (
  
    <View style={styles.item}>
      <List.Icon icon="cash" color="black" />
      <View style={styles.textContainer}>
        <TextInput
          style={styles.title}
          value={item.title}
          onChangeText={(text) => updateRow(item.id, "title", text)}
        />
      </View>
      <TextInput
          style={styles.date}
          value={item.date}
          onChangeText={(text) => updateRow(item.id, "date", text)}
        />
      <TextInput
        style={[styles.amount, { color: item.amount.startsWith('-') ? 'red' : 'green' }]}
        value={item.amount}
        keyboardType="numeric"
        onChangeText={(text) => updateRow(item.id, "amount", text)}
      />
      <Switch
        value={item.periodic}
        onValueChange={(value) => updateRow(item.id, "periodic", value.toString())}
      />
      <TextInput
         style={styles.frequency}
        value={item.frequency}
        onChangeText={(text) => updateRow(item.id, "frequency", text)}
      />
      <IconButton icon="dots-horizontal" />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Periodic Transactions</Text>
      <FlatList data={data.filter(item => item.periodic)} renderItem={renderItem} keyExtractor={(item) => item.id} />

      <Text style={styles.header}>One-Time Transactions</Text>
      <View style={styles.tableRow}>
        <Text style={styles.columnHeader}>Title</Text>
        <Text style={styles.columnHeader}>Date</Text>
        <Text style={styles.columnHeader}>Amount</Text>
        <Text style={styles.columnHeader}>Periodic</Text>
        <Text style={styles.columnHeader}>Frequency</Text>
      </View>
        <FlatList data={data.filter(item => !item.periodic)} renderItem={renderItem} keyExtractor={(item) => item.id} />
        
      <TouchableOpacity onPress={addRow} style={styles.addButton}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>


     
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },

  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },

  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },

  columnHeader: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d9e2ec",
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  frequency: {
    fontSize: 16,
    fontWeight: "bold",
  },
  date: {
    fontSize: 12,
    color: "gray",
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "white",
    fontSize: 18,
  },
});