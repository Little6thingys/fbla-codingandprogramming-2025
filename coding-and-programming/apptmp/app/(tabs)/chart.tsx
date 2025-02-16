import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { dropTransactionTable, setupDatabase, insertTransactionsAsArray, fetchTransactionsByCategory } from "./database";





///

import { Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';



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
});

////

export default function ChartScreen() {
   
  const [data, setData] = useState<any[]>([]);

  const transactionsTable = [
    { category: 1, title: "Groceries", amount: 50.75, date: "2025-02-13", periodic: false, frequency: "" },
    { category: 2, title: "Netflix", amount: 15.99, date: "2025-02-14", periodic: true, frequency: "monthly" },
    { category: 3, title: "Salary", amount: 1200, date: "2025-02-15", periodic: false, frequency: "" },
  ];
  useEffect(() => {
    // drop table if exist
        dropTransactionTable();
        console.log("dropTransactionTable is completed!");
        // create table 
        setupDatabase();
        console.log("setupDatabase is completed!");
        // insert into table transaction or update table transaction
        insertTransactionsAsArray(transactionsTable);
        console.log("insertTransactionsAsArray is completed!");
       fetchChartData();
       console.log("fetchChartData is completed!");
  }, []);

  

  const fetchChartData = async () => {
    try {
      const transactions = await fetchTransactionsByCategory(); // Wait for the database query to complete
  
      const formattedData = transactions.map((item) => ({
        name: `Category ${item.category}`,
        amount: item.total,
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Generate a random color
        legendFontColor: "#000",
        legendFontSize: 15,
      }));
  
      setData(formattedData); // Update state with formatted data
    } catch (error) {
      console.error("❌ Error fetching chart data", error);
    }
  };
  

  return (
    <View>
      <Text style={{ fontSize: 18, textAlign: "center", margin: 20 }}>Category Expenses</Text>
      <PieChart
        data={data}
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
    </View>

  );
}
  
