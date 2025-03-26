import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from "react-native";
import { PieChart, BarChart } from "react-native-chart-kit";
import ModalSelector from "react-native-modal-selector";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

import {
  dropTransactionTable,
  setupDatabase,
  dumpArrayToTransaction,
  insertTransactionsAsArray,
  deleteAllTransactions,
  fetchExpenseTransactionsByCategory,
  fetchIncomeTransactionsByCategory,
  getSummary,
  fetchTransactions,
  fetchCategories,
} from "../database";
import { Button } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { opacity } from "react-native-reanimated/lib/typescript/Colors";

const styles = StyleSheet.create({
  resetButton: {
    marginTop: 10,
    padding: 8,
    backgroundColor: "#003D5B",
    borderRadius: 5,
    alignItems: "center",
  },
  resetButtonText: {
    color: "#FFFFFF",
    fontWeight: "normal",
  },
  backgroundContainer: {
    flex: 1,
    backgroundColor: "#003D5B",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
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
    position: "absolute",
  },
  container: {
    flex: 1,
    backgroundColor: "#003D5B",
    padding: 20,
  },

  tableRow: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },

  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },

  columnHeader: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
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
    justifyContent: "center",
    alignItems: "center", // This will center the chart horizontally
    padding: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#fff",
  },
});

////

export default function ChartScreen() {
  const [dataExpenseTotalTransactions, setExpenseTotalData] = useState<any[]>(
    []
  );
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

  /**const transactionsTable = [
    { category: 1, title: "Groceries", amount: -2, date: "2025-02-13", periodic: false, frequency: "" },
    { category: 2, title: "Netflix", amount: -4, date: "2025-02-14", periodic: true, frequency: "monthly" },
    { category: 3, title: "Salary", amount:6, date: "2025-02-15", periodic: false, frequency: "" },
    { category: 1, title: "Groceries", amount: -8, date: "2025-01-13", periodic: false, frequency: "" },
    { category: 2, title: "Netflix", amount: -10, date: "2025-01-14", periodic: true, frequency: "monthly" },
    { category: 3, title: "Salary", amount: 12, date: "2025-01-15", periodic: false, frequency: "" },

     ];*/

  /**tmptory debugging use */
  const transactionsTable = [
    {
      id: "1",
      category: "1",
      title: "Groceries",
      amount: "-2",
      date: "2025-02-13",
      icon: "",
      description: "",
    },
    {
      id: "2",
      category: "2",
      title: "Netflix",
      amount: "-4",
      date: "2025-02-14",
      icon: "",
      description: "",
    },
    {
      id: "3",
      category: "3",
      title: "Salary",
      amount: "6",
      date: "2025-02-15",
      icon: "",
      description: "",
    },
    {
      id: "4",
      category: "1",
      title: "Groceries",
      amount: "-8",
      date: "2025-01-13",
      icon: "",
      description: "",
    },
    {
      id: "5",
      category: "2",
      title: "Netflix",
      amount: "-10",
      date: "2025-01-14",
      icon: "",
      description: "",
    },
    {
      id: "6",
      category: "3",
      title: "Salary",
      amount: "12",
      date: "2025-01-15",
      icon: "",
      description: "",
    },
  ];

  const [chartData, setChartData] = useState<ChartDataType>([]);
  const [filter, setFilter] = useState("monthly"); // 'monthly' or 'weekly'
  const [category, setCategory] = useState("All"); // Category filter
  const [startDate, setStartDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 6))
  ); // 6 months ago
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [categoriesTable, setCategoriesTable] = useState<any[]>([]);
  const [singualTransactionsTable, setTransactionsTable] = useState<any[]>([]);

  useEffect(() => {
    console.log("!!!!!!!!!!!!!starting to refresh chart page!");

    //dumpArrayToTransaction(transactionsTable); //for debugging

    fetchExpensePieChartData();
    fetchIncomePieChartData();

    //fetchTransactions();
    //console.log("piechart is completed!");

    fetchBarChartData();
    //console.log("bar chart is completed!");

    //fetchCategories();
    /*const loadCategories = async () => {
          const data = await fetchCategories();
          setCategoriesTable(data);
        };*/

    fetchTransactions();
    //console.log("fetchTransactions is completed!");
    const loadTransactions = async () => {
      const data = await fetchTransactions();
      setTransactionsTable(data);
    };
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
      const data: ChartDataType = await getSummary(
        startDate,
        endDate,
        filter,
        category
      );
      setChartData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getRandomColor = () => {
    let color;
    do {
      color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    } while (
      color.toLowerCase() === "#ffffff" ||
      parseInt(color.substring(1), 16) > 0xeeeeee
    ); // Avoid white & near-white
    return color;
  };

  // Function to check if color is too light (avoiding white or very bright colors)
  const isColorTooLight = (hexColor: string) => {
    // Convert hex to RGB
    const r = parseInt(hexColor.substring(1, 3), 16);
    const g = parseInt(hexColor.substring(3, 5), 16);
    const b = parseInt(hexColor.substring(5, 7), 16);

    // Calculate brightness (perceived luminance formula)
    const brightness = r * 0.299 + g * 0.587 + b * 0.114;

    return brightness > 200; // Threshold: 200+ means it's too light
  };

  /* fetch cheXart for expense pie chart from all the transaction group by category */
  const fetchExpensePieChartData = async () => {
    try {
      const transactions = await fetchExpenseTransactionsByCategory(
        startDate,
        endDate
      ); // Wait for the database query to complete

      const formattedData = transactions.map((item) => ({
        name: `Category ${item.category}`,
        amount: item.total,
        color: getRandomColor(),
        legendFontColor: "#fff",
        legendFontSize: 15,
      }));

      setExpenseTotalData(formattedData);
    } catch (error) {
      console.error("Error fetching expense chart data", error);
    }
  };

  /* fetch cheXart for income pie chart from all the transaction group by category */
  const fetchIncomePieChartData = async () => {
    try {
      const transactions = await fetchIncomeTransactionsByCategory(
        startDate,
        endDate
      ); // Wait for the database query to complete

      const formattedData = transactions.map((item) => ({
        name: `Category ${item.category}`,
        amount: item.total,
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Generate a random color
        legendFontColor: "#fff",
        legendFontSize: 15,
      }));

      setIncomeTotalData(formattedData); // Update state with formatted data
    } catch (error) {
      console.error("Error fetching income chart data", error);
    }
  };

  const handleReset = () => {
    deleteAllTransactions(); // Clears the array or reset to default state
    console.log("Reset button clicked!");
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
    <ScrollView style={styles.container}>
      {/* Reset Button */}
      <TouchableOpacity
        style={styles.resetButton}
        onPress={() => handleReset()} // Function to handle reset action
      >
        <Text style={styles.resetButtonText}>Reset</Text>
      </TouchableOpacity>

      {/* Filter Controls */}

      {/* Date Pickers */}
      <TouchableOpacity onPress={() => setShowStartPicker(true)}>
        <Text style={{ fontWeight: "bold", fontSize: 18, color: "#fff" }}>
          Start Date: {startDate.toISOString().split("T")[0]}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setShowEndPicker(true)}>
        <Text style={{ fontWeight: "bold", fontSize: 18, color: "#fff" }}>
          End Date: {endDate.toISOString().split("T")[0]}
        </Text>
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

      {/*<Text>Selected: {category}</Text>
            <ModalSelector
              data={categories}
              initValue="Select Category"
              onChange={(option) => setCategory(option.key)}
            />*/}

      {/* Toggle Buttons */}

      <Button
        mode={filter === "monthly" ? "contained" : "outlined"}
        onPress={() => setFilter("monthly")}
        style={{ marginHorizontal: 5, marginVertical: 10 }}
      >
        Monthly
      </Button>
      <Button
        mode={filter === "weekly" ? "contained" : "outlined"}
        onPress={() => setFilter("weekly")}
        style={{ marginHorizontal: 5 }}
      >
        Weekly
      </Button>

      {/* Bar Chart */}
      <ScrollView horizontal>
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Income </Text>{" "}
          {/* later income vs expense */}
          <BarChart
            data={{
              labels: chartData.map((item) => item.label.toString()),
              datasets: [
                {
                  data: chartData.map((item) => item.income),
                  color: () => "#4CAF50",
                }, // Green for income //4CAF50
                {
                  data: chartData.map((item) => item.expenses),
                  color: () => "#4CAF50",
                }, // Red for expenses //F44336
              ],
            }}
            width={chartData.length * 160} // Adjust width for scrollability
            height={350}
            yAxisLabel={"$"}
            yAxisSuffix={"$"}
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#f3f3f3",
              backgroundGradientTo: "#ffffff",
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
      <Text
        style={{ fontSize: 18, textAlign: "center", margin: 5, color: "#fff" }}
      >
        Category Expenses
      </Text>
      <PieChart
        data={dataExpenseTotalTransactions}
        width={400}
        height={220}
        chartConfig={{
          backgroundColor: "#e26a00",
          backgroundGradientFrom: "#fb8c00",
          backgroundGradientTo: "#ffa726",
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="15"
        center={[10, 0]} // Adjust centering if needed
        absolute
      />

      {/*Show category pie chart of income transactions */}
      <Text
        style={{ fontSize: 18, textAlign: "center", margin: 5, color: "#fff" }}
      >
        Category Income
      </Text>
      <PieChart
        data={dataIncomeTotalTransactions}
        width={400}
        height={220}
        chartConfig={{
          backgroundColor: "#e26a00",
          backgroundGradientFrom: "#fb8c00",
          backgroundGradientTo: "#ffa726",
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="15"
        center={[10, 0]}
        absolute
      />
    </ScrollView>
  );
}
