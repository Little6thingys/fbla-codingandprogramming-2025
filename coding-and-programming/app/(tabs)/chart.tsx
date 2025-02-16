import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { PieChart, BarChart } from "react-native-chart-kit";
import ModalSelector from 'react-native-modal-selector';
import { dropTransactionTable, setupDatabase, insertTransactionsAsArray, fetchExpenseTransactionsByCategory, fetchIncomeTransactionsByCategory, getSummary } from "./database";



///

import { Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';



import { Button } from 'react-native-paper';  // ✅ Updated import
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as SQLite from 'expo-sqlite';


const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    backgroundColor: '#003D5B',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
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
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 8,
  },
 
  cell: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    padding: 5,
  },
  headerText: {
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  chartContainer: {
    flexGrow: 1, // Allow content to grow and ensure it scrolls vertically
    paddingBottom: 20, // Optional: adds space at the bottom when scrolling
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', // This will center the chart horizontally
    padding: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
});

////

export default function ChartScreen() {
   
  const [dataExpenseTotalTransactions, setExpenseTotalData] = useState<any[]>([]);
  const [dataIncomeTotalTransactions, setIncomeTotalData] = useState<any[]>([]);
  const [transactions, setTransactions] = useState([]);

  /*const transactionsTable = [
    { category: 1, title: "Groceries", amount: 50.75, date: "2025-02-13", periodic: false, frequency: "" },
    { category: 2, title: "Netflix", amount: 15.99, date: "2025-02-14", periodic: true, frequency: "monthly" },
    { category: 3, title: "Salary", amount: 120, date: "2025-02-15", periodic: false, frequency: "" },
    { category: 1, title: "Groceries", amount: 50.75, date: "2025-01-13", periodic: false, frequency: "" },
    { category: 2, title: "Netflix", amount: 15.99, date: "2025-01-14", periodic: true, frequency: "monthly" },
    { category: 3, title: "Salary", amount: 120, date: "2025-01-15", periodic: false, frequency: "" },

    { category: 4, title: "Company1", amount: 50.75, date: "2025-02-13", periodic: false, frequency: "" },
    { category: 4, title: "Company2", amount: 15.99, date: "2025-02-14", periodic: true, frequency: "monthly" },
    { category: 4, title: "Company3", amount: 120, date: "2025-02-15", periodic: false, frequency: "" },
    { category: 4, title: "Company1", amount: 50.75, date: "2025-01-13", periodic: false, frequency: "" },
    { category: 4, title: "Company2", amount: 15.99, date: "2025-01-14", periodic: true, frequency: "monthly" },
    { category: 4, title: "Company3", amount: 120, date: "2025-01-15", periodic: false, frequency: "" },


  ];*/

  const transactionsTable = [
    { category: 1, title: "Groceries", amount: -1, date: "2025-02-13", periodic: false, frequency: "" },
    { category: 2, title: "Netflix", amount: -2, date: "2025-02-14", periodic: true, frequency: "monthly" },
    { category: 3, title: "Salary", amount: 3, date: "2025-02-15", periodic: false, frequency: "" },
    { category: 1, title: "Groceries", amount: -4, date: "2025-01-13", periodic: false, frequency: "" },
    { category: 2, title: "Netflix", amount: -5, date: "2025-01-14", periodic: true, frequency: "monthly" },
    { category: 3, title: "Salary", amount: 6, date: "2025-01-15", periodic: false, frequency: "" },

   


  ];


  const [chartData, setChartData] = useState<ChartDataType>([]);
  const [filter, setFilter] = useState('monthly'); // 'monthly' or 'weekly'
  const [category, setCategory] = useState('All'); // Category filter
  const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 6))); // 6 months ago
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  useEffect(() => {
    console.log("starting!");
      // drop table if exist
          dropTransactionTable();
          console.log("dropTransactionTable is completed!");
          // create table 
          setupDatabase();
          console.log("setupDatabase is completed!");
          // insert into table transaction or update table transaction
          insertTransactionsAsArray(transactionsTable);
          console.log("insertTransactionsAsArray is completed!");
          fetchExpensePieChartData();
          fetchIncomePieChartData();

         //fetchTransactions();
         console.log("piechart is completed!");

         fetchBarChartData();
         console.log("bar chart is completed!");

        
    }, [filter, category, startDate, endDate]);

  type ChartDataType = {
    label: string;
    income: number;
    expenses: number;
  }[];
  
  
    
  
    const categories = [
      { key: "All", label: "All Categories" },
      { key: "Food", label: "Food" },
      { key: "Transportation", label: "Transportation" },
      { key: "Entertainment", label: "Entertainment" },
      { key: "Salary", label: "Salary" },
      { key: "Rent", label: "Rent" },
      { key: "Others", label: "Others" },
    ];
   
     
    const fetchBarChartData = async () => {
      try {
        const data: ChartDataType = await getSummary(startDate, endDate, filter, category);
        setChartData(data); 
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
  
  /* fetch cheXart for expense pie chart from all the transaction group by category */
  const fetchExpensePieChartData = async () => {
    try {
      const transactions = await fetchExpenseTransactionsByCategory(startDate, endDate); // Wait for the database query to complete
  
      const formattedData = transactions.map((item) => ({
        name: `Category ${item.category}`,
        amount: item.total,
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Generate a random color
        legendFontColor: "#000",
        legendFontSize: 15,
      }));
      console.log(formattedData[0].amount);
      //console.log(formattedData[1].amount);
      setExpenseTotalData(formattedData); 
      //console.log(dataExpenseTotalTransactions[0].amount);
      //console.log('startDate is:' + startDate.toISOString().split('T')[0]);
      //console.log('endDate is:' + endDate.toISOString().split('T')[0]);
      //console.log(dataExpenseTotalTransactions[1].amount);
    } catch (error) {
      console.error("Error fetching expense chart data", error);
    }
  };

   /* fetch cheXart for income pie chart from all the transaction group by category */
   const fetchIncomePieChartData = async () => {
    try {
      const transactions = await fetchIncomeTransactionsByCategory(startDate, endDate); // Wait for the database query to complete
  
      const formattedData = transactions.map((item) => ({
        name: `Category ${item.category}`,
        amount: item.total,
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Generate a random color
        legendFontColor: "#000",
        legendFontSize: 15,
      }));
  
      setIncomeTotalData(formattedData); // Update state with formatted data
      } catch (error) {
      console.error("Error fetching income chart data", error);
    }
  };
  

  /*const fetchTransactions = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM transactions;",
        [],
        (_, { rows }) => setTransactions(rows._array),
        (_, error) => console.error("Error fetching transactions:", error)
      );
    });
  };

  const renderHeader = () => (
    <View style={[styles.row, styles.header]}>
      <Text style={[styles.cell, styles.headerText]}>ID</Text>
      <Text style={[styles.cell, styles.headerText]}>Category</Text>
      <Text style={[styles.cell, styles.headerText]}>Title</Text>
      <Text style={[styles.cell, styles.headerText]}>Amount</Text>
      <Text style={[styles.cell, styles.headerText]}>Date</Text>
      <Text style={[styles.cell, styles.headerText]}>Periodic</Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.id}</Text>
      <Text style={styles.cell}>{item.category}</Text>
      <Text style={styles.cell}>{item.title}</Text>
      <Text style={styles.cell}>${item.amount.toFixed(2)}</Text>
      <Text style={styles.cell}>{item.date}</Text>
      <Text style={styles.cell}>{item.periodic ? "Yes" : "No"}</Text>
    </View>
  );
*/

  return (
   
   
    <ScrollView >
           
          
            
          {/* Filter Controls */}
          
              {/* Date Pickers */}
              <TouchableOpacity onPress={() => setShowStartPicker(true)}>
                <Text style={{ fontWeight: 'bold' }}>Start Date: {startDate.toISOString().split('T')[0]}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowEndPicker(true)}>
                <Text style={{ fontWeight: 'bold' }}>End Date: {endDate.toISOString().split('T')[0]}</Text>
              </TouchableOpacity>
      
              {showStartPicker && (
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  display="default"
                  onChange={(_, date) => {
                    setShowStartPicker(false);
                    if (date) setStartDate(date);
                  }}
                />
              )}
      
              {showEndPicker && (
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  display="default"
                  onChange={(_, date) => {
                    setShowEndPicker(false);
                    if (date) setEndDate(date);
                  }}
                />
              )}
           
      
            
            {/* Category Filter */}
            
            <Text>Selected: {category}</Text>
            <ModalSelector
              data={categories}
              initValue="Select Category"
              onChange={(option) => setCategory(option.key)}
            />
         
      
      
            {/* Toggle Buttons */}
           
              <Button
                mode={filter === 'monthly' ? 'contained' : 'outlined'}
                onPress={() => setFilter('monthly')}
                style={{ marginHorizontal: 5 }}
              >
                Monthly
              </Button>
              <Button
                mode={filter === 'weekly' ? 'contained' : 'outlined'}
                onPress={() => setFilter('weekly')}
                style={{ marginHorizontal: 5 }}
              >
                Weekly
              </Button>
           
          
          {/* Bar Chart */}
          <ScrollView horizontal>
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Income vs Expenses</Text>
        <BarChart
          data={{
            labels: chartData.map(item => item.label),
            datasets: [
              { data: chartData.map(item => item.income), color: () => '#4CAF50' }, // Green for income //4CAF50
              { data: chartData.map(item => item.expenses), color: () => '#4CAF50' } // Red for expenses //F44336
            ]
          }}
          width={chartData.length * 160} // Adjust width for scrollability
          height={350}
          yAxisLabel={'$'}
          yAxisSuffix={'$'}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#f3f3f3',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 16 },
            barPercentage: 0.6,
            formatYLabel: (value) => `$${parseFloat(value).toFixed(2)}`, // Custom Y-axis label formatting
          }}
          verticalLabelRotation={30}
          showBarTops={false}
          fromZero
        />
      </View>
    </ScrollView>
            
      {/*Show category pie chart of expense transactions */}
      <Text style={{ fontSize: 18, textAlign: "center", margin: 20 }}>Category Expenses</Text>
            <PieChart
              data={dataExpenseTotalTransactions}
              width={300}
              height={220}
              chartConfig={{
                backgroundColor: "#e26a00",
                backgroundGradientFrom: "#fb8c00",
                backgroundGradientTo: "#ffa726",
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              }}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />

            {/*Show category pie chart of income transactions */}
            <Text style={{ fontSize: 18, textAlign: "center", margin: 20 }}>Category Income</Text>
            <PieChart
              data={dataIncomeTotalTransactions}
              width={300}
              height={220}
              chartConfig={{
                backgroundColor: "#e26a00",
                backgroundGradientFrom: "#fb8c00",
                backgroundGradientTo: "#ffa726",
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              }}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
         
           
          </ScrollView>
      
         
      
         
        );
}

