import React, { useRef, useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, Switch, StyleSheet, Modal, ScrollView } from "react-native";
import { List, IconButton, Button } from 'react-native-paper';
import { Picker } from "@react-native-picker/picker";
import { Dropdown } from 'react-native-element-dropdown';
import EmojiPicker, { EmojiType } from 'rn-emoji-keyboard';
import ModalSelector from 'react-native-modal-selector';
import { dropTransactionTable, setupDatabase, insertTransaction, insertTransactionsAsArray, dumpArrayToTransaction, fetchTransactions,searchTransactions,
  insertCategories, createTableCategories, fetchCategories, insertIfCategoriesEmpty,
  createTablePeriodic, insertPeriodicTransactionsAsArray, insertPeriodicTransaction, insertIfPeriodicEmpty } from "@/app/database";
//import { white } from "react-native-paper/lib/typescript/styles/themes/v2/colors";

export default function TransactionsScreen() {


  /** array singular stores real time singular transactions **/
  const [singular, setSingular] = useState([
    { id: "1", category: "1", icon: "🍚", title: "Eating Out", date: "2024-12-09", amount: "-15", description: ""},
    { id: "2", category: "2", icon: "👚", title: "Bought Clothes", date: "2024-12-07", amount: "-30", description: ""},
    { id: "3", category: "5", icon: "🏥", title: "Hospital Bill", date: "2024-12-06", amount: "-40", description: ""},
    { id: "4", category: "4", icon: "💸", title: "Got Bonus", date: "2024-12-06", amount: "500", description: ""},
  ]);

  /** array singular stores real time singular transactions **/
  const [categories, setCategories] = useState([
    { id: "1", icon: "🍚", title: "Eating out"},
    { id: "2", icon: "👚", title: "Clothes"},
    { id: "3", icon: "💸", title: "Groceries"},
    { id: "4", icon: "🍚", title: "Salary"},
    { id: "5", icon: "👚", title: "Rent"},
    { id: "6", icon: "💸", title: "Utility"},
    { id: "7", icon: "💸", title: "Subscription"},
  ]);

  const [periodic, setPeriodic] = useState([
    { id: "1", category: "4", icon: "💼", title: "Job", times: "1", numOfPeriods: "1", frequency: "week(s)", amount: "500", description: "", nextDueDate: new Date(new Date().setDate(new Date().getDate() + 7))},
    { id: "2", category: "4", icon: "💸", title: "Mow Lawns", times: "1", numOfPeriods: "1", frequency: "day(s)", amount: "15", description: "", nextDueDate: new Date(new Date().setDate(new Date().getDate() + 1))},
    { id: "3", category: "5", icon: "🏠", title: "Rent", times: "1", numOfPeriods: "1", frequency: "month(s)", amount: "-1500", description: "", nextDueDate: new Date(new Date().setMonth(new Date().getMonth() + 1))}, 
    { id: "4", category: "7", icon: "📰", title: "NYT Subscription", times: "1", numOfPeriods: "4", frequency: "week(s)", amount: "-25", description: "", nextDueDate: new Date(new Date().setDate(new Date().getDate() + 28))},
  ])

  function Balance(){
    let sum = 0;
    for (let item of singular){
      sum += parseFloat(item.amount);
    }
    return sum;
  }
  
  const categoryValue = [
    {label: 'Eating out', value: '1'},
    {label: 'Clothes', value: '2'},
    {label: 'Groceries', value: '3'},
    {label: 'Salary', value: '4'},
    {label: 'Rent', value: '5'},
    {label: 'Utility', value: '6'},
    {label: 'Subscription', value: '7'}
  ]

  const gainOrLoss = [
    {label: 'Gain', value: '1'},
    {label: 'Loss', value: '-1'}
  ]
  
  const months = [
    {label: 'January', value: '01'},
    {label: 'February', value: '02'},
    {label: 'March', value: '03'},
    {label: 'April', value: '04'},
    {label: 'May', value: '05'},
    {label: 'June', value: '06'},
    {label: 'July', value: '07'},
    {label: 'August', value: '08'},
    {label: 'September', value: '09'},
    {label: 'October', value: '10'},
    {label: 'November', value: '11'},
    {label: 'December', value: '12'},
  ]

  const periodChoices = [
    {label: 'Day(s)', value: 'day(s)'},
    {label: 'Week(s)', value: 'week(s)'},
    {label: 'Month(s)', value: 'month(s)'},
    {label: 'Year(s)', value: 'month(s)'},
  ]

  const [isNewTransactionMenuOpen, setIsNewTransactionMenuOpen] = useState(false);

  const toggleNewTransactionMenu = () => {
    setIsNewTransactionMenuOpen((prev) => !prev);
  };


  

  type SingularTransactionEntry = {
    id: string;
    category: string;
    icon: string;
    title: string;
    date: string;
    amount: string;
    description: string;
  };
  
  const createDefaultSingularRow = () => {
    return {
      id: Date.now().toString(),
      category: "1",
      icon: "💸",
      title: "New Item",
      date: "YYYY-MM-DD",
      amount: "0.00",
      description: "",
    };
  
  };

  const loadTransactions = async () => {
    const data = await fetchTransactions();
    if(data.length > 0)
    {
      console.log("data length > 0, load table");
      setSingular(data);
    }
    else
    {
      console.log("data length = 0, keep the default");
    }
  };

  /** search in transactions table */

  const [selectedColumn, setSelectedColumn] = useState("title"); // Default column
  const [searchValue, setSearchValue] = useState("");
  const [results, setResults] = useState(singular);

  // Define the table columns
  const columns = [
    { key: "id", label: "ID" },
    { key: "category", label: "Category" },
    { key: "icon", label: "Icon" },
    { key: "title", label: "Title" },
    { key: "date", label: "Date" },
    { key: "amount", label: "Amount" },
    { key: "description", label: "Description" },
  ];

  const handleSearch = async () => {
    const data: SingularTransactionEntry[] = await searchTransactions(selectedColumn, searchValue);
    setResults(data); 
  };


 
      
  

useEffect(() => {
  console.log("!!!!!!!starting to refresh transactions page");
  createTableCategories(); // Ensure table is created
  
  insertIfCategoriesEmpty(categories); // Fetch existing categories

  createTablePeriodic();
  insertPeriodicTransactionsAsArray(periodic);

  loadTransactions();
}, []);



  
  /*const transactionsTable = [
    { category: 1, title: "Groceries", amount: 50.75, date: "2025-02-13", periodic: false, frequency: "" },
    { category: 2, title: "Netflix", amount: 15.99, date: "2025-02-14", periodic: true, frequency: "monthly" },
    { category: 3, title: "Salary", amount: 1200, date: "2025-02-15", periodic: false, frequency: "" },
  ];*/

  type TransactionEntry = {
    id: string;
    category: string;
    title: string;
    date: string;
    amount: string;
   };
  
   // creates and returns a SingularTransactionEntry using the values collected from Modals
  const createSingularRow = () => {
    return {
      id: singularID,
      category: singularCategory,
      icon: singularIcon,
      title: singularTitle,
      date: `${singularYear}-${singularMonth.padStart(2, '0')}-${singularDay.padStart(2, '0')}`,
      amount: singularSign * (parseFloat(singularAmount) || 0) + "",
      description: singularDescription,
    };
  }

  // adds a SingularTransactionEntry to the Singular Transaction Array
 const addSingular = () => {
    setSingularID((new Date()).toISOString());
    const newRow = createSingularRow();
    // console.log("newRow.category is: " + newRow.category);
    setSingular([...singular, newRow].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    dumpArrayToTransaction(singular);
  }

  // finds a transaction within the Singular Transaction array that matches the given ID and edits that transaction with the given values
  const editSingular = () => {
    setSingular((prevSingular) =>
      prevSingular.map((item) =>
        item.id === singularID ? {...item, ...createSingularRow()} : item
      )
    )
  }

  // finds a transaction within the Singular Transaction array that matches the given ID and deletes it from the array
  const deleteSingular = () => {
    setSingular((prevSingular) => prevSingular.filter((item) => item.id !== singularID));
  }

  const handleSingularAdd = () => {
    addSingular();
    toggleSingularCreationModal();
  }

  const handleSingularSave = () => {
    editSingular();
    toggleSingularEditModal();
  }

  const handleSingularDelete = () => {
    deleteSingular();
    toggleSingularEditModal();
  }

  const [singularCreationModal, setSingularCreationModal] = useState(false);

  const toggleSingularCreationModal = () => {
    setSingularCreationModal(!singularCreationModal);
    setSingularIcon('');
    setSingularCategory('');
    setSingularTitle('');
    setSingularSign(1);
    setSingularAmount('');
    setSingularDay('');
    setSingularMonth('');
    setSingularYear('');
    setSingularDescription('');
  };

  const [singularEditModal, setSingularEditModal] = useState(false);

  const toggleSingularEditModal = () => {
    setSingularEditModal(!singularEditModal);
    setSingularID((new Date()).toISOString());
    setSingularIcon('');
    setSingularCategory('');
    setSingularTitle('');
    setSingularSign(1);
    setSingularAmount('');
    setSingularDay('');
    setSingularMonth('');
    setSingularYear('');
    setSingularDescription('');
  };

  const showSingularEditModal = (item: SingularTransactionEntry) => {
    toggleSingularEditModal();
    setSingularEdit(false);
    setSingularID(item.id);
    console.log("item.category: " + item.category);
    setSingularCategory(item.category);
    setSingularIcon(item.icon);
    setSingularTitle(item.title);
    setSingularSign(parseFloat(item.amount) >= 0 ? 1 : -1);
    setSingularAmount(Math.abs(parseFloat(item.amount)).toString());
    setSingularDay(item.date.split("-")[2]);
    setSingularMonth(item.date.split("-")[1]);
    setSingularYear(item.date.split("-")[0]);
    setSingularDescription(item.description);
  }

  const [singularEdit, setSingularEdit] = useState(false);

  const [isSingularEmojiOpen, setIsSingularEmojiOpen] = useState(false);
  
  const [singularID, setSingularID] = useState('');
  const [singularCategory, setSingularCategory] = useState('');
  const [singularIcon, setSingularIcon] = useState('');
  const [singularTitle, setSingularTitle] = useState('');
  const [singularSign, setSingularSign] = useState(1);
  const [singularAmount, setSingularAmount] = useState('');
  // const [singularDate, setSingularDate] = useState('');
  // const [singularDate, setSingularDate] = useState(new Date());
  const [singularDay, setSingularDay] = useState('');
  const [singularMonth, setSingularMonth] = useState('');
  const [singularYear, setSingularYear] = useState('');
  const [singularDescription, setSingularDescription] = useState('');

  const handleSingularIcon = (emojiObject: EmojiType) => {
    setSingularIcon(emojiObject.emoji);
  }

  const handleSingularTitle = (title: string) => {
    setSingularTitle(title);
  }


  const handleSingularAmount = (amount: string) => {
    setSingularAmount(amount);
  }

  const handleSingularDay = (day: any) => {
    setSingularDay(day);
  }

  const handleSingularYear = (year: any) => {
    setSingularYear(year);
  }

  const handleSingularDescription = (description: string) => {
    setSingularDescription(description);
  }
 
  const renderSingularItem = ({ item }: { item: SingularTransactionEntry }) => (
 
    <TouchableOpacity style={styles.singularItem} onPress={() => showSingularEditModal(item)}>
      {/* <List.Icon icon="cash" color="black" /> */}
      <Text style={{fontSize: 30}}>{item.icon}</Text>
      <View style={styles.textContainer}>
        <Text
          style={styles.singularTitle}
        >{item.title}</Text>
      </View>
      <View style={[styles.transactionInfoContainer, {width: 80}]}>
        <Text
            style={styles.singularDate}
          >{item.date}</Text>
      </View>
      <View style={[styles.transactionInfoContainer, {width: 60, paddingLeft: 15}]}>
        <Text
          style={[styles.singularAmount, { color: item.amount && String(item.amount).startsWith('-') ? '#FF0000' : '#00FF11' }]}
        >{item.amount}</Text>
      </View>
      {/* <Switch
        value={item.periodic}
        onValueChange={(value) => updateRow(item.id, "periodic", value.toString())}
      /> */}
      {/* <IconButton icon="dots-horizontal" /> */}
    </TouchableOpacity>
  );

  type PeriodicTransactionEntry = {
    id: string;
    category: string;
    icon: string;
    title: string;
    times: string;
    numOfPeriods: string;
    frequency: string,
    amount: string;
    description: string;
    nextDueDate: Date;
  };

  const createPeriodicRow = () => {
    return {
      id: periodicID,
      category: periodicCategory,
      icon: periodicIcon,
      title: periodicTitle,
      times: periodicTimes,
      numOfPeriods: periodicNumOfPeriods,
      frequency: periodicPeriod + "",
      amount: periodicSign * (parseFloat(periodicAmount) || 0) + "",
      description: periodicDescription,
      nextDueDate: determineNextDueDate(periodicPeriod + "", periodicNumOfPeriods, new Date())
    };
  }

  const addPeriodic = () => {
    setPeriodicID((new Date()).toISOString());
    const newRow = createPeriodicRow();
    setPeriodic([...periodic, newRow]);
  }

  const editPeriodic = () => {
    setPeriodic((prevPeriodic) =>
      prevPeriodic.map((item) =>
        item.id === periodicID ? {...item, ...createPeriodicRow()} : item
      )
    )
  }

  const deletePeriodic = () => {
    setPeriodic((prevPeriodic) => prevPeriodic.filter((item) => item.id !== periodicID));
  }

  const handlePeriodicAdd = () => {
    addPeriodic();
    togglePeriodicCreationModal();
  }

  const handlePeriodicSave = () => {
    editPeriodic();
    togglePeriodicEditModal();
  }

  const handlePeriodicDelete = () => {
    deletePeriodic();
    togglePeriodicEditModal();
  }

  // modal used for creating a new Periodic Transaction
  const [periodicCreationModal, setPeriodicCreationModal] = useState(false);

  // function used to turn on/off the PeriodicCreationModal
  const togglePeriodicCreationModal = () => {
    setPeriodicCreationModal(!periodicCreationModal);
    setPeriodicIcon('');
    setPeriodicCategory('');
    setPeriodicTitle('');
    setPeriodicSign(1);
    setPeriodicAmount('');
    setPeriodicTimes('');
    setPeriodicNumOfPeriods('');
    setPeriodicPeriod('');
    setPeriodicDescription('');
  };

  // modal used for editing an already existing Periodic Transaction
  const [periodicEditModal, setPeriodicEditModal] = useState(false);

  // function used to turn on/off the PeriodicEditModal
  const togglePeriodicEditModal = () => {
    setPeriodicEditModal(!periodicEditModal);
    setPeriodicID((new Date()).toISOString());
    setPeriodicIcon('');
    setPeriodicCategory('');
    setPeriodicTitle('');
    setPeriodicSign(1);
    setPeriodicAmount('');
    setPeriodicTimes('');
    setPeriodicNumOfPeriods('');
    setPeriodicPeriod('');
    setPeriodicDescription('');
  };

  // function used to turn on a PeriodicEditModal and initialize it to the given item's parameters
  const showPeriodicEditModal = (item: PeriodicTransactionEntry) => {
    togglePeriodicEditModal();
    setPeriodicEdit(false);
    setPeriodicID(item.id);
    setPeriodicIcon(item.icon);
    setPeriodicCategory(item.category);
    setPeriodicTitle(item.title);
    setPeriodicSign(parseFloat(item.amount) >= 0 ? 1 : -1);
    setPeriodicAmount(Math.abs(parseFloat(item.amount)).toString());
    setPeriodicTimes(item.times);
    setPeriodicNumOfPeriods(item.numOfPeriods);
    setPeriodicPeriod(item.frequency);
    setPeriodicDescription(item.description);
  }

  const [periodicEdit, setPeriodicEdit] = useState(false);

  const [isPeriodicEmojiOpen, setIsPeriodicEmojiOpen] = useState(false);

  const [periodicID, setPeriodicID] = useState('');
  const [periodicCategory, setPeriodicCategory] = useState('');
  const [periodicIcon, setPeriodicIcon] = useState('');
  const [periodicTitle, setPeriodicTitle] = useState('');
  const [periodicSign, setPeriodicSign] = useState(1);
  const [periodicAmount, setPeriodicAmount] = useState('');
  const [periodicTimes, setPeriodicTimes] = useState('');
  const [periodicNumOfPeriods, setPeriodicNumOfPeriods] = useState('');
  const [periodicPeriod, setPeriodicPeriod] = useState('');
  const [periodicDescription, setPeriodicDescription] = useState('');

  const handlePeriodicCategory = (category: string) => {
    setPeriodicCategory(category);
  }
  
  const handlePeriodicIcon = (emojiObject: EmojiType) => {
    setPeriodicIcon(emojiObject.emoji);
  }

  const handlePeriodicTitle = (title: string) => {
    setPeriodicTitle(title);
  }

  // const handlePeriodicSign = (sign : any) => {
  //   setPeriodicSign(sign.value);
  // }

  const handlePeriodicAmount = (amount: string) => {
    setPeriodicAmount(amount);
  }

  const handlePeriodicTimes = (times: string) => {
    setPeriodicTimes(times);
  }

  const handlePeriodicNumOfPeriods = (num: string) => {
    setPeriodicNumOfPeriods(num);
  }

  const handlePeriodicDescription = (description: string) => {
    setPeriodicDescription(description);
  }

  function determineNextDueDate(frequency: string, numOfPeriods: string, nextDue: Date) {
    if(frequency === "day(s)") {
      nextDue.setDate(nextDue.getDate() + parseFloat(numOfPeriods) * 1);
    } else if (frequency === "week(s)"){
      nextDue.setDate(nextDue.getDate() + parseFloat(numOfPeriods) * 7);
    } else if (frequency === "month(s)"){
      nextDue.setMonth(nextDue.getMonth() + parseFloat(numOfPeriods) * 1);
    } else if (frequency === "year(s)"){
      nextDue.setFullYear(nextDue.getFullYear() + parseFloat(numOfPeriods) * 1);
    }

    return nextDue;
  }

  function processPeriodicTransactions(transactions: PeriodicTransactionEntry[]) {
    const now = new Date();
    let nowString = now.toISOString();
    const newTransactions: SingularTransactionEntry[] = [];
    const idTracker: {date: string, count: number}[] = [];

    transactions.forEach(transaction => {
      const nextDue = transaction.nextDueDate;

      if(now >= nextDue){
        const nextDueString = nextDue.toISOString();

        let trackerEntry = idTracker.find(entry => entry.date === nextDueString);
        if(!trackerEntry){
          trackerEntry = {date: nextDueString, count: 0};
          idTracker.push(trackerEntry);
        }

        for(let i = 1; i <= parseInt(transaction.times); i++){
          trackerEntry.count++;
          newTransactions.push({
            id: `${nextDueString} [${trackerEntry.count}]`,
            category: transaction.category,
            icon: transaction.icon,
            title: `${transaction.title} [${trackerEntry.count}]`,
            date: nextDue.toISOString().split("T")[0],
            amount: transaction.amount,
            description: transaction.description,
          })
        }

        transaction.nextDueDate = determineNextDueDate(transaction.frequency, transaction.numOfPeriods, nextDue);
      }
    });

    return newTransactions;
  }

  setInterval(() => {
    const newTransactions = processPeriodicTransactions(periodic);

    if(newTransactions.length > 0) {
      setSingular(prev => [...prev, ...newTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      dumpArrayToTransaction(singular);
    }
  }, 24 * 60 * 60 * 1000);

  const renderPeriodicItem = ({item} : { item: PeriodicTransactionEntry}) => (
    <TouchableOpacity style={styles.periodicItem} onPress={() => showPeriodicEditModal(item)}>
      {/* <List.Icon icon="cash" color="black" /> */}
      <Text style={{fontSize: 50}}>{item.icon}</Text>
        <Text
          style={[styles.periodicTitle]}
        >{item.title}</Text>
      <Text
        style={[styles.periodicAmount, { color: item.amount && String(item.amount).startsWith('-') ? '#FF0000' : '#00FF11' }]}
      >{item.amount}</Text>
      <Text
        style={styles.periodicFrequency}
      >{item.times}x/{item.numOfPeriods} {item.frequency}</Text>
      {/* <IconButton icon="dots-horizontal" /> */}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{marginLeft: 10}}>
        <View style={{flexDirection: 'row', justifyContent: 'center', marginBottom: 20}}>
          <Text style={styles.pageHeader}>Account Balance: </Text>
          <Text style={[styles.pageHeader, {fontWeight: 'bold'}]}>${Balance()}</Text>
        </View>
        <Text style={styles.header}>Periodic Transactions</Text>
        <FlatList
        style={{marginBottom: 20}} 
        data={periodic} 
        renderItem={renderPeriodicItem} 
        keyExtractor={(item) => item.id} 
        numColumns={2} 
        scrollEnabled={false}
        />

        <Text style={styles.header}>Singular Transactions</Text>
        <View style={styles.tableRow}>
          <Text style={[styles.columnHeader, {marginLeft: 30}]}>Title</Text>
          <Text style={[styles.columnHeader, {marginLeft: 100}]}>Date</Text>
          <Text style={[styles.columnHeader, {marginLeft: 5}]}>Amount</Text>
        </View>
          {/* <FlatList data={singular.filter(item => !item.periodic)} renderItem={renderItem} keyExtractor={(item) => item.id} /> */}
        <FlatList
        style={{marginBottom: 70}} 
        data={singular} 
        renderItem={renderSingularItem} 
        keyExtractor={(item) => item.id} 
        scrollEnabled={false}/>




         {/* Dropdown for selecting column using ModalSelector */}
      <Text style={{ color:  "white", fontSize: 16}}>Select Column:</Text>
      <ModalSelector
        data={columns}
        initValue="Select Column"
        onChange={(option) => setSelectedColumn(option.key)}
        style={{ marginBottom: 10, backgroundColor:  "white"}}
      >
        <TouchableOpacity style={{ padding: 10, borderWidth: 1, borderColor: "#ccc" }}>
          <Text>{columns.find((col) => col.key === selectedColumn)?.label || "Select Column"}</Text>
        </TouchableOpacity>
      </ModalSelector>

      {/* Text Input for search value */}
      <Text style={{ color:  "white", fontSize: 16}}>Enter Value:</Text>
      <TextInput 
        placeholder="Search..."
        value={searchValue}
        onChangeText={setSearchValue}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          marginBottom: 10,
          backgroundColor:  "white",
        }}
      />

      {/* Search Button */}
      <Button style={{ backgroundColor:  "white"}} onPress={handleSearch} >Search</Button>
 
      {/* Display Search Results */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1, borderColor: '#fff'}}>
            <Text style={{color:'#fff', fontSize: 14}}>ID: {item.id}</Text>
            <Text style={{color:'#fff', fontSize: 14}}>Category: {item.category}</Text>
            <Text style={{color:'#fff', fontSize: 14}}>Icon: {item.icon}</Text>
            <Text style={{color:'#fff', fontSize: 14}}>Title: {item.title}</Text>
            <Text style={{color:'#fff', fontSize: 14}}>Date: {item.date}</Text>
            <Text style={{color:'#fff', fontSize: 14}}>Amount: ${item.amount}</Text>
            <Text style={{color:'#fff', fontSize: 14}}>Description: {item.description || "N/A"}</Text>
          </View>
        )}
        scrollEnabled={false}
      />



  


      </ScrollView>


      <TouchableOpacity style={styles.floatingButton} onPress={toggleNewTransactionMenu}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>

      {isNewTransactionMenuOpen && (
        <>
        <View style={[styles.smallButtonContainer, { bottom: 90 }]}>
          <View style={styles.labelContainer}><Text style={styles.labelText}>Periodic Transaction</Text></View>
          <TouchableOpacity
              style={styles.smallButton}
              onPress={togglePeriodicCreationModal}>
              <Text style={styles.smallButtonText}>2</Text>
            </TouchableOpacity>
        </View>
        <View style={[styles.smallButtonContainer, { bottom: 140 }]}>
        <View style={styles.labelContainer}><Text style={styles.labelText}>Singular Transaction</Text></View>
          <TouchableOpacity
            style={styles.smallButton}
            onPress={toggleSingularCreationModal}>
            <Text style={styles.smallButtonText}>1</Text>
          </TouchableOpacity>
        </View>
        </>
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={singularCreationModal}
        onRequestClose={toggleSingularCreationModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalTop}>
              
            </View>
            <View style={styles.modalBody}>
              <Text style={[styles.modalTitle, {fontSize: 16}]}>
                Icon
              </Text>
              <View style={{marginBottom: 20}}>
                  {/* <EmojiSelector onEmojiSelected={handleSingularIcon}/> */}
                  <TouchableOpacity style={[styles.textBox, {width: 50, height:50, justifyContent: 'center', alignItems: 'center'}]} onPress={() => setIsSingularEmojiOpen(true)}>
                    <Text style={{fontSize: 25, lineHeight: 50, includeFontPadding: false, marginTop: -3, marginLeft: -2}}>{singularIcon}</Text>
                  </TouchableOpacity>
                  <EmojiPicker 
                    onEmojiSelected={handleSingularIcon}
                    open={isSingularEmojiOpen}
                    onClose={() => setIsSingularEmojiOpen(false)}
                  />
              </View>
              <Text style={[styles.modalTitle, {fontSize: 16}]}>
                Title
              </Text>
              <TextInput
                style={[styles.textBox, {width: 300, height: 50, marginBottom: 20}]}
                placeholder="Title"
                placeholderTextColor='#3c5a80'
                value={singularTitle}
                onChangeText={handleSingularTitle}
              />
              <View style={{flexDirection: 'column', marginHorizontal: 10}}>
                  <Text style={[styles.modalTitle, {fontSize: 12}]}>Category</Text>
                  <Dropdown
                    style={[styles.textBox, {height: 50, width: 125}]}
                    placeholderStyle={{color: '#3c5a80'}}
                    selectedTextStyle={{color: '#fff'}}
                    data={categoryValue}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Select"
                    value={singularCategory}
                    onChange={(item: { value: string}) => {
                      setSingularCategory(item.value);
                    }}
                  />
                </View>
              <Text style={[styles.modalTitle, {fontSize: 16}]}>
                Transaction
              </Text>
              <View style={{flexDirection: 'row', alignContent: 'center'}}>
                <View style={{flexDirection: 'column', marginHorizontal: 10}}>
                  <Text style={[styles.modalTitle, {fontSize: 12}]}>Classify Transaction</Text>
                  <Dropdown
                    style={[styles.textBox, {height: 50, width: 125}]}
                    placeholderStyle={{color: '#3c5a80'}}
                    selectedTextStyle={{color: '#fff'}}
                    data={gainOrLoss}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Select"
                    value={singularSign + ""}
                    onChange={(item: { value: string}) => {
                      setSingularSign(parseFloat(item.value));
                    }}
                  />
                </View>
                <Text style={{fontSize: 20, color: '#fff', textAlign: 'center', marginLeft: 10, marginTop: 30, marginRight: -5}}>$</Text>
                <View style={{flexDirection: 'column', marginHorizontal: 10}}>
                  <Text style={[styles.modalTitle, {fontSize: 12}]}>Amount</Text>
                  <TextInput
                    style={[styles.textBox, {width: 175, height: 50, marginBottom: 20}]}
                    placeholder="X.XX"
                    placeholderTextColor='#3c5a80'
                    value={singularAmount}
                    onChangeText={handleSingularAmount}
                    keyboardType="numeric"
                  />
                </View>
              </View>
              <Text style={[styles.modalTitle, {fontSize: 16}]}>
                Date of Transaction
              </Text>
              <View style={{flexDirection: 'row', marginBottom: 20}}>
                <View style={{flexDirection: 'column', marginHorizontal: 10}}>
                <Text style={[styles.modalTitle, {fontSize: 12}]}>Date </Text>
                  <TextInput
                    style={[styles.textBox, {width: 60, height: 50}]}
                    placeholder="Date"
                    placeholderTextColor='#3c5a80'
                    value={singularDay}
                    onChangeText={handleSingularDay}
                    keyboardType="numeric"
                  />
                </View>
                <View style={{flexDirection: 'column', marginHorizontal: 10}}>
                  <Text style={[styles.modalTitle, {fontSize: 12}]}>Month </Text>
                  <Dropdown
                    style={[styles.textBox, {height: 50, width: 150}]}
                    placeholderStyle={{color: '#3c5a80'}}
                    selectedTextStyle={{color: '#fff'}}
                    data={months}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Month"
                    value={singularMonth}
                    onChange={(item: { value: string}) => {
                      setSingularMonth(item.value);
                    }}
                  />
                </View>
                  <View style={{flexDirection: 'column', marginHorizontal: 10}}>
                    <Text style={[styles.modalTitle, {fontSize: 12}]}>Year </Text>
                    <TextInput
                      style={[styles.textBox, {width: 100, height: 50}]}
                      placeholder="Year"
                      placeholderTextColor='#3c5a80'
                      value={singularYear}
                      onChangeText={handleSingularYear}
                      keyboardType="numeric"
                    />
                  </View>
              </View>
              <Text style={[styles.modalTitle, {fontSize: 16}]}>
                Description
              </Text>
              <TextInput
                style={[styles.textBox, {width: 300, height: 150, marginBottom: 20}]}
                placeholder="Description"
                placeholderTextColor='#3c5a80'
                multiline={true}
                value={singularDescription}
                onChangeText={handleSingularDescription}
              />
            </View>
            <View style={styles.modalBottom}>
              <TouchableOpacity style={styles.cancelButton} onPress={toggleSingularCreationModal}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  {/* <Text style={{fontSize: 30, color: '#ab0000', paddingRight: 10}}>+</Text> */}
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                  </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={handleSingularAdd}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  {/* <Text style={{fontSize: 30, color: '#fff', paddingRight: 10}}>+</Text> */}
                  <Text style={styles.closeButtonText}>Add</Text>
                  </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={periodicCreationModal}
        onRequestClose={togglePeriodicCreationModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalTop}>
              
            </View>
            <View style={styles.modalBody}>
              <Text style={[styles.modalTitle, {fontSize: 16}]}>
                Icon
              </Text>
              <View style={{marginBottom: 20}}>
                  <TouchableOpacity style={[styles.textBox, {width: 50, height:50, justifyContent: 'center', alignItems: 'center'}]} onPress={() => setIsPeriodicEmojiOpen(true)}>
                    <Text style={{fontSize: 25, lineHeight: 50, includeFontPadding: false, marginTop: -3, marginLeft: -2}}>{periodicIcon}</Text>
                  </TouchableOpacity>
                  <EmojiPicker 
                    onEmojiSelected={handlePeriodicIcon}
                    open={isPeriodicEmojiOpen}
                    onClose={() => setIsPeriodicEmojiOpen(false)}
                  />
              </View>
              <Text style={[styles.modalTitle, {fontSize: 16}]}>
                Title
              </Text>
              <TextInput
                style={[styles.textBox, {width: 300, height: 50, marginBottom: 20}]}
                placeholder="Title"
                placeholderTextColor='#3c5a80'
                value={periodicTitle}
                onChangeText={handlePeriodicTitle}
              />

              <View style={{flexDirection: 'column', marginHorizontal: 10}}>
                  <Text style={[styles.modalTitle, {fontSize: 12}]}>Category</Text>
                  <Dropdown
                    style={[styles.textBox, {height: 50, width: 125}]}
                    placeholderStyle={{color: '#3c5a80'}}
                    selectedTextStyle={{color: '#fff'}}
                    data={categoryValue}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Select"
                    value={periodicCategory}
                    onChange={(item: { value: string}) => {
                      setPeriodicCategory(item.value);
                    }}
                  />
              </View>
              <Text style={[styles.modalTitle, {fontSize: 16}]}>
                Transaction
              </Text>
              <View style={{flexDirection: 'row', alignContent: 'center'}}>
                <View style={{flexDirection: 'column', marginHorizontal: 10}}>
                  <Text style={[styles.modalTitle, {fontSize: 12}]}>Classify Transaction</Text>
                  <Dropdown
                    style={[styles.textBox, {height: 50, width: 125}]}
                    placeholderStyle={{color: '#3c5a80'}}
                    selectedTextStyle={{color: '#fff'}}
                    data={gainOrLoss}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Select"
                    value={periodicSign + ""}
                    onChange={(item: { value: string}) => {
                      setSingularSign(parseFloat(item.value));
                    }}
                  />
                </View>
                <Text style={{fontSize: 20, color: '#fff', textAlign: 'center', marginLeft: 10, marginTop: 30, marginRight: -5}}>$</Text>
                <View style={{flexDirection: 'column', marginHorizontal: 10}}>
                  <Text style={[styles.modalTitle, {fontSize: 12}]}>Amount</Text>
                  <TextInput
                    style={[styles.textBox, {width: 175, height: 50, marginBottom: 20}]}
                    placeholder="X.XX"
                    placeholderTextColor='#3c5a80'
                    value={periodicAmount}
                    onChangeText={handlePeriodicAmount}
                    keyboardType="numeric"
                  />
                </View>
              </View>
              <Text style={[styles.modalTitle, {fontSize: 16}]}>
                Frequency of Transaction
              </Text>
              <View style={{flexDirection: 'row', marginBottom: 20}}>
                <TextInput
                  style={[styles.textBox, {width: 60, height: 50, marginRight: 10}]}
                  placeholderTextColor='#3c5a80'
                  value={periodicTimes}
                  onChangeText={handlePeriodicTimes}
                  keyboardType="numeric"
                />
                <Text style={{color: '#fff', fontSize: 14, textAlignVertical: 'center'}}>times per</Text>
                <TextInput
                  style={[styles.textBox, {width: 60, height: 50, marginLeft: 10}]}
                  placeholderTextColor='#3c5a80'
                  value={periodicNumOfPeriods + ""}
                  onChangeText={handlePeriodicNumOfPeriods}
                  keyboardType="numeric"
                />
                <Dropdown
                  style={[styles.textBox, {width: 120, height: 50, marginLeft: 5}]}
                  placeholderStyle={{color: '#3c5a80'}}
                  selectedTextStyle={{color: '#fff'}}
                  data={periodChoices}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Period"
                  value={periodicPeriod}
                  onChange={(item: { value: string }) => {
                    setPeriodicPeriod(item.value);
                  }}
                />
              </View>
              <Text style={[styles.modalTitle, {fontSize: 16}]}>
                Description
              </Text>
              <TextInput
                style={[styles.textBox, {width: 300, height: 150, marginBottom: 20}]}
                placeholder="Description"
                placeholderTextColor='#3c5a80'
                multiline={true}
                value={periodicDescription}
                onChangeText={handlePeriodicDescription}
              />
            </View>
            <View style={styles.modalBottom}>
              <TouchableOpacity style={styles.cancelButton} onPress={togglePeriodicCreationModal}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  {/* <Text style={{fontSize: 30, color: '#ab0000', paddingRight: 10}}>+</Text> */}
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                  </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={handlePeriodicAdd}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  {/* <Text style={{fontSize: 30, color: '#fff', paddingRight: 10}}>+</Text> */}
                  <Text style={styles.closeButtonText}>Add</Text>
                  </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={singularEditModal}
        onRequestClose={toggleSingularEditModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalTop}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleSingularDelete}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  {/* <Text style={{fontSize: 30, color: '#ab0000', paddingRight: 10}}>+</Text> */}
                  <Text style={styles.cancelButtonText}>Delete</Text>
                  </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.editButton} onPress={() => setSingularEdit(!singularEdit)}>
                <Text style={styles.editButtonText}>{singularEdit ? "Stop Editing" : "Edit"}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={[styles.modalTitle, {fontSize: 16}]}>
                Icon
              </Text>
              <View style={{marginBottom: 20}}>
                  {/* <EmojiSelector onEmojiSelected={handleSingularIcon}/> */}
                  <TouchableOpacity style={[singularEdit ? styles.textBox : styles.uneditedTextBox, {width: 50, height:50, justifyContent: 'center', alignItems: 'center'}]} onPress={() => setIsSingularEmojiOpen(true)}>
                    <Text style={{fontSize: 25, lineHeight: 50, includeFontPadding: false, marginTop: -3, marginLeft: -2}}>{singularIcon}</Text>
                  </TouchableOpacity>
                  <EmojiPicker 
                    onEmojiSelected={handleSingularIcon}
                    open={isSingularEmojiOpen && singularEdit}
                    onClose={() => setIsSingularEmojiOpen(false)}
                  />
              </View>
              <Text style={[styles.modalTitle, {fontSize: 16}]}>
                Title
              </Text>
              <TextInput
                style={[singularEdit ? styles.textBox : styles.uneditedTextBox, {width: 300, height: 50, marginBottom: 20}]}
                placeholder="Title"
                placeholderTextColor='#3c5a80'
                value={singularTitle}
                onChangeText={handleSingularTitle}
                readOnly={!singularEdit}
              />
              <View style={{flexDirection: 'column', marginHorizontal: 10}}>
                  <Text style={[styles.modalTitle, {fontSize: 12}]}>Category</Text>
                  <Dropdown
                    style={[singularEdit ? styles.textBox : styles.uneditedTextBox, {height: 50, width: 125}]}
                    placeholderStyle={{color: '#3c5a80'}}
                    selectedTextStyle={{color: '#fff'}}
                    data={categoryValue}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Select"
                    value={singularCategory}
                    onChange={(item: { value: string}) => {
                      setSingularCategory(item.value);
                    }}
                    disable={!singularEdit}
                  />
                </View>
              <Text style={[styles.modalTitle, {fontSize: 16}]}>
                Transaction
              </Text>
              <View style={{flexDirection: 'row', alignContent: 'center'}}>
                <View style={{flexDirection: 'column', marginHorizontal: 10}}>
                  <Text style={[styles.modalTitle, {fontSize: 12}]}>Classify Transaction</Text>
                  <Dropdown
                    style={[singularEdit ? styles.textBox : styles.uneditedTextBox, {height: 50, width: 125}]}
                    placeholderStyle={{color: '#3c5a80'}}
                    selectedTextStyle={{color: '#fff'}}
                    data={gainOrLoss}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Select"
                    value={singularSign + ""}
                    onChange={(item: { value: string}) => {
                      setSingularSign(parseFloat(item.value));
                    }}
                    disable={!singularEdit}
                  />
                </View>
                <Text style={{fontSize: 20, color: '#fff', textAlign: 'center', marginLeft: 10, marginTop: 30, marginRight: -5}}>$</Text>
                <View style={{flexDirection: 'column', marginHorizontal: 10}}>
                  <Text style={[styles.modalTitle, {fontSize: 12}]}>Amount</Text>
                  <TextInput
                    style={[singularEdit ? styles.textBox : styles.uneditedTextBox, {width: 175, height: 50, marginBottom: 20}]}
                    placeholder="X.XX"
                    placeholderTextColor='#3c5a80'
                    value={singularAmount}
                    onChangeText={handleSingularAmount}
                    keyboardType="numeric"
                    readOnly={!singularEdit}
                  />
                </View>
              </View>
              <Text style={[styles.modalTitle, {fontSize: 16}]}>
                Date of Transaction
              </Text>
              <View style={{flexDirection: 'row', marginBottom: 20}}>
                <View style={{flexDirection: 'column', marginHorizontal: 10}}>
                <Text style={[styles.modalTitle, {fontSize: 12}]}>Date </Text>
                  <TextInput
                    style={[singularEdit ? styles.textBox : styles.uneditedTextBox, {width: 60, height: 50}]}
                    placeholder="Date"
                    placeholderTextColor='#3c5a80'
                    value={singularDay}
                    onChangeText={handleSingularDay}
                    keyboardType="numeric"
                    readOnly={!singularEdit}
                  />
                </View>
                <View style={{flexDirection: 'column', marginHorizontal: 10}}>
                  <Text style={[styles.modalTitle, {fontSize: 12}]}>Month </Text>
                  <Dropdown
                    style={[singularEdit ? styles.textBox : styles.uneditedTextBox, {height: 50, width: 150}]}
                    placeholderStyle={{color: '#3c5a80'}}
                    selectedTextStyle={{color: '#fff'}}
                    data={months}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Month"
                    value={singularMonth}
                    onChange={(item: { value: string}) => {
                      setSingularMonth(item.value);
                    }}
                    disable={!singularEdit}
                  />
                </View>
                  <View style={{flexDirection: 'column', marginHorizontal: 10}}>
                    <Text style={[styles.modalTitle, {fontSize: 12}]}>Year </Text>
                    <TextInput
                      style={[singularEdit ? styles.textBox : styles.uneditedTextBox, {width: 100, height: 50}]}
                      placeholder="Year"
                      placeholderTextColor='#3c5a80'
                      value={singularYear}
                      onChangeText={handleSingularYear}
                      keyboardType="numeric"
                      readOnly={!singularEdit}
                    />
                  </View>
              </View>
              <Text style={[styles.modalTitle, {fontSize: 16}]}>
                Description
              </Text>
              <TextInput
                style={[singularEdit ? styles.textBox : styles.uneditedTextBox, {width: 300, height: 150, marginBottom: 20}]}
                placeholder="Description"
                placeholderTextColor='#3c5a80'
                multiline={true}
                value={singularDescription}
                onChangeText={handleSingularDescription}
                readOnly={!singularEdit}
              />
            </View>
            <View style={styles.modalBottom}>
              <TouchableOpacity style={styles.cancelButton} onPress={toggleSingularEditModal}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={handleSingularSave}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  {/* <Text style={{fontSize: 30, color: '#fff', paddingRight: 10}}>+</Text> */}
                  <Text style={styles.closeButtonText}>Save</Text>
                  </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={periodicEditModal}
        onRequestClose={togglePeriodicEditModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalTop}>
              <TouchableOpacity style={styles.cancelButton} onPress={handlePeriodicDelete}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  {/* <Text style={{fontSize: 30, color: '#ab0000', paddingRight: 10}}>+</Text> */}
                  <Text style={styles.cancelButtonText}>Delete</Text>
                  </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.editButton} onPress={() => setPeriodicEdit(!periodicEdit)}>
                <Text style={styles.editButtonText}>{periodicEdit ? "Stop Editing" : "Edit"}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={[styles.modalTitle, {fontSize: 16}]}>
                Icon
              </Text>
              <View style={{marginBottom: 20}}>
                  <TouchableOpacity style={[periodicEdit ? styles.textBox : styles.uneditedTextBox, {width: 50, height:50, justifyContent: 'center', alignItems: 'center'}]} onPress={() => setIsPeriodicEmojiOpen(true)}>
                    <Text style={{fontSize: 25, lineHeight: 50, includeFontPadding: false, marginTop: -3, marginLeft: -2}}>{periodicIcon}</Text>
                  </TouchableOpacity>
                  <EmojiPicker 
                    onEmojiSelected={handlePeriodicIcon}
                    open={isPeriodicEmojiOpen && periodicEdit}
                    onClose={() => setIsPeriodicEmojiOpen(false)}
                  />
              </View>
              <Text style={[styles.modalTitle, {fontSize: 16}]}>
                Title
              </Text>
              <TextInput
                style={[periodicEdit ? styles.textBox : styles.uneditedTextBox, {width: 300, height: 50, marginBottom: 20}]}
                placeholder="Title"
                placeholderTextColor='#3c5a80'
                value={periodicTitle}
                onChangeText={handlePeriodicTitle}
                readOnly={!periodicEdit}
              />
              <View style={{flexDirection: 'column', marginHorizontal: 10}}>
                  <Text style={[styles.modalTitle, {fontSize: 12}]}>Category</Text>
                  <Dropdown
                    style={[periodicEdit ? styles.textBox : styles.uneditedTextBox, {height: 50, width: 125}]}
                    placeholderStyle={{color: '#3c5a80'}}
                    selectedTextStyle={{color: '#fff'}}
                    data={categoryValue}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Select"
                    value={periodicCategory}
                    onChange={(item: { value: string}) => {
                      setPeriodicCategory(item.value);
                    }}
                    disable={!singularEdit}
                  />
              </View>
              <Text style={[styles.modalTitle, {fontSize: 16}]}>
                Transaction
              </Text>
              <View style={{flexDirection: 'row', alignContent: 'center'}}>
                <View style={{flexDirection: 'column', marginHorizontal: 10}}>
                  <Text style={[styles.modalTitle, {fontSize: 12}]}>Classify Transaction</Text>
                  <Dropdown
                    style={[periodicEdit ? styles.textBox : styles.uneditedTextBox, {height: 50, width: 125}]}
                    placeholderStyle={{color: '#3c5a80'}}
                    selectedTextStyle={{color: '#fff'}}
                    data={gainOrLoss}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Select"
                    value={periodicSign + ""}
                    onChange={(item: { value: string}) => {
                      setSingularSign(parseFloat(item.value));
                    }}
                    disable={!periodicEdit}
                  />
                </View>
                <Text style={{fontSize: 20, color: '#fff', textAlign: 'center', marginLeft: 10, marginTop: 30, marginRight: -5}}>$</Text>
                <View style={{flexDirection: 'column', marginHorizontal: 10}}>
                  <Text style={[styles.modalTitle, {fontSize: 12}]}>Amount</Text>
                  <TextInput
                    style={[periodicEdit ? styles.textBox : styles.uneditedTextBox, {width: 175, height: 50, marginBottom: 20}]}
                    placeholder="X.XX"
                    placeholderTextColor='#3c5a80'
                    value={periodicAmount}
                    onChangeText={handlePeriodicAmount}
                    keyboardType="numeric"
                    readOnly={!periodicEdit}
                  />
                </View>
              </View>
              <Text style={[styles.modalTitle, {fontSize: 16}]}>
                Frequency of Transaction
              </Text>
              <View style={{flexDirection: 'row', marginBottom: 20}}>
                <TextInput
                  style={[periodicEdit ? styles.textBox : styles.uneditedTextBox, {width: 60, height: 50, marginRight: 10}]}
                  placeholderTextColor='#3c5a80'
                  value={periodicTimes}
                  onChangeText={handlePeriodicTimes}
                  keyboardType="numeric"
                  readOnly={!periodicEdit}
                />
                <Text style={{color: '#fff', fontSize: 14, textAlignVertical: 'center'}}>times per</Text>
                <TextInput
                  style={[periodicEdit ? styles.textBox : styles.uneditedTextBox, {width: 60, height: 50, marginLeft: 10}]}
                  placeholderTextColor='#3c5a80'
                  value={periodicNumOfPeriods + ""}
                  onChangeText={handlePeriodicNumOfPeriods}
                  keyboardType="numeric"
                  readOnly={!periodicEdit}
                />
                <Dropdown
                  style={[periodicEdit ? styles.textBox : styles.uneditedTextBox, {width: 120, height: 50, marginLeft: 5}]}
                  placeholderStyle={{color: '#3c5a80'}}
                  selectedTextStyle={{color: '#fff'}}
                  data={periodChoices}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Period"
                  value={periodicPeriod}
                  onChange={(item: { value: string }) => {
                    setPeriodicPeriod(item.value);
                  }}
                  disable={!periodicEdit}
                />
              </View>
              <Text style={[styles.modalTitle, {fontSize: 16}]}>
                Description
              </Text>
              <TextInput
                style={[periodicEdit ? styles.textBox : styles.uneditedTextBox, {width: 300, height: 150, marginBottom: 20}]}
                placeholder="Description"
                placeholderTextColor='#3c5a80'
                multiline={true}
                value={periodicDescription}
                onChangeText={handlePeriodicDescription}
                readOnly={!periodicEdit}
              />
              {!periodicEdit && 
                <View style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                  <Text style={[styles.modalTitle, {fontSize: 16}]}>Next Occurrence: </Text>
                  <Text style={{color: '#fff', textAlign: 'center', textAlignVertical: 'center', marginBottom: 2.5}}>{determineNextDueDate(periodicPeriod, periodicNumOfPeriods, new Date()).toISOString().split('T')[0]}</Text>
                </View>
              }
            </View>
            <View style={styles.modalBottom}>
              <TouchableOpacity style={styles.cancelButton} onPress={togglePeriodicEditModal}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={handlePeriodicSave}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  {/* <Text style={{fontSize: 30, color: '#fff', paddingRight: 10}}>+</Text> */}
                  <Text style={styles.closeButtonText}>Save</Text>
                  </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>



  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003D5B',
    paddingHorizontal: 20,
  },

  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },

  pageHeader: {
    fontSize: 28,
    // marginBottom: 10,
    textAlign: "center",
    color: "#fff",
  },

  header: {
    fontSize: 18,
    fontWeight: "bold",
    // marginBottom: 10,
    textAlign: "center",
    color: "#fff",
  },

  columnHeader: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  },

  uneditedTextBox: {
    borderWidth: 0,
    borderColor: "#3c5a80",
    borderRadius: 8,
    paddingHorizontal: 10,
    // backgroundColor: '#2b415c',
    textAlign: 'center',
    color: '#fff',
  },
  textBox: {
    borderWidth: 1,
    borderColor: "#3c5a80",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#2b415c',
    color: '#fff',
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  singularItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2E4769",
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5
  },
  singularTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: '#fff',
    width: 175,
  },
  singularDate: {
    fontSize: 12,
    color: "#fff",
  },
  singularAmount: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    textAlign: 'center',
  },
  transactionInfoContainer: {
    backgroundColor: '#233956',
    borderRadius: 5,
    paddingVertical: 2,
    paddingHorizontal: 5,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  periodicItem: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2E4769",
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 5,
    width: 175,
    height: 175,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  periodicTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: 'center',
    textAlignVertical: 'center',
    marginRight: 3,
    color: '#fff',
  },
  periodicFrequency: {
    fontSize: 14,
    color: "#fff",
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  periodicCategory: {
    fontSize: 14,
    color: "#fff",
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  periodicAmount: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 5,
    textAlign: 'center',
    textAlignVertical: 'center',
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
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#1F2F43', // Button color
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Shadow on Android
  },
  buttonText: {
    color: '#fff',
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 60,
  },
  smallButtonContainer:{
    position: 'absolute',
    right: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallButton: {
    right: 20,
    backgroundColor: '#1F2F43',
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  smallButtonText:{
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    // lineHeight: 60,
  },
  labelContainer: {
    marginRight: 30, // Add space between the button and the label
    backgroundColor: '#1F2F43',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 2,
    paddingBottom: 2,
    borderRadius: 5,
  },
  labelText: {
    fontSize: 16,
    color: '#fff', // Label text color
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '95%',
    height: 800,
    padding: 20,
    backgroundColor: '#1F2F43',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#fff',
  },
  modalTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: -75,
    width: '100%',
  },
  modalBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: -50,
  },
  modalBottom:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    width: '100%',
  },
  closeButton: {
    backgroundColor: '#00FF11',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 20,
  },
  cancelButton: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderColor: '#ab0000',
    borderWidth: 2,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: '#ab0000',
    fontSize: 20,
  },
  editButton: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderColor: '#3c5a80',
    borderWidth: 2,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 20,
  }
});
