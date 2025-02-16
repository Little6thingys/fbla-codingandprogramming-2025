import React, { useRef, useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, Switch, StyleSheet, Modal, ScrollView } from "react-native";
import { List, IconButton } from 'react-native-paper';
// import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Picker } from "@react-native-picker/picker";
import { Dropdown } from 'react-native-element-dropdown';
// import EmojiSelector, { Categories } from 'react-native-emoji-selector';
// import EmojiPicker, {emojiFromUtf16} from 'rn-emoji-picker';
// import {emojis} from "rn-emoji-picker/dist/data";
// import { Emoji } from "rn-emoji-picker/dist/interfaces";
import EmojiPicker, { EmojiType } from 'rn-emoji-keyboard';

export default function TransactionsScreen() {
  function Balance(){
    let sum = 0;
    for (let item of oneTime){
      sum += parseFloat(item.amount);
    }
    return sum;
  }
  
  const gainOrLoss = [
    {label: 'Gain', value: '1'},
    {label: 'Loss', value: '-1'}
  ]
  
  const months = [
    {label: 'January', value: '1'},
    {label: 'February', value: '2'},
    {label: 'March', value: '3'},
    {label: 'April', value: '4'},
    {label: 'May', value: '5'},
    {label: 'June', value: '6'},
    {label: 'July', value: '7'},
    {label: 'August', value: '8'},
    {label: 'September', value: '9'},
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

  type OneTimeTransactionEntry = {
    id: string;
    icon: string;
    title: string;
    date: string;
    amount: string;
    description: string;
  };
  
  const [oneTime, setOneTime] = useState([
    { id: "1", icon: "🍚", title: "Ordered Food", date: "12/09/2024", amount: "-15", description: ""},
    { id: "2", icon: "👚", title: "Bought Clothes", date: "12/07/2024", amount: "-30", description: ""},
    { id: "3", icon: "💸", title: "Found Money on Ground", date: "12/06/2024", amount: "5", description: ""},
    { id: "4", icon: "💸", title: "idk at this point", date: "12/06/2024", amount: "5", description: ""},
  ]);

  const addRow = () => {
    const newRow = {
      id: Date.now().toString(),
      icon: "💸",
      title: "New Item",
      date: "MM/DD/YYYY",
      amount: "0.00",
      description: "",
    };
    setOneTime([...oneTime, newRow]);
  };

  const addOneTime = () => {
    const newRow = {
      id: Date.now().toString(),
      icon: oneTimeIcon,
      title: oneTimeTitle,
      date: `${oneTimeMonth}/${oneTimeDay}/${oneTimeYear}`,
      amount: oneTimeSign * (parseFloat(oneTimeAmount) || 0) + "",
      description: oneTimeDescription,
    };
    setOneTime([...oneTime, newRow]);
  }

  const updateOneTimeRow = (id: string, field: string , value: string) => {
    setOneTime(oneTime.map(item => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const [oneTimeModal, setOneTimeModal] = useState(false);

  const toggleOneTimeModal = () => {
    setOneTimeModal(!oneTimeModal);
  };

  const [isOneTimeEmojiOpen, setIsOneTimeEmojiOpen] = useState(false);

  const [oneTimeIcon, setOneTimeIcon] = useState('');
  const [oneTimeTitle, setOneTimeTitle] = useState('');
  const [oneTimeSign, setOneTimeSign] = useState(1);
  const [oneTimeAmount, setOneTimeAmount] = useState('');
  // const [oneTimeDate, setOneTimeDate] = useState('');
  // const [oneTimeDate, setOneTimeDate] = useState(new Date());
  const [oneTimeDay, setOneTimeDay] = useState('');
  const [oneTimeMonth, setOneTimeMonth] = useState(null);
  const [oneTimeYear, setOneTimeYear] = useState('');
  const [oneTimeDescription, setOneTimeDescription] = useState('');

  const handleOneTimeIcon = (emojiObject: EmojiType) => {
    setOneTimeIcon(emojiObject.emoji);
  }

  const handleOneTimeTitle = (title: string) => {
    setOneTimeTitle(title);
  }

  const handleOneTimeSign = (sign : any) => {
    setOneTimeSign(sign.value);
  }

  const handleOneTimeAmount = (amount: string) => {
    setOneTimeAmount(amount);
  }

  const handleOneTimeDay = (day: any) => {
    setOneTimeDay(day);
  }

  const handleOneTimeYear = (year: any) => {
    setOneTimeYear(year);
  }

  const handleOneTimeDescription = (description: string) => {
    setOneTimeDescription(description);
  }

  const handleOneTimeAdd = () => {
    addOneTime();
    toggleOneTimeModal();
  }
 
  const renderOneTimeItem = ({ item }: { item: OneTimeTransactionEntry }) => (
 
    <View style={styles.oneTimeItem}>
      {/* <List.Icon icon="cash" color="black" /> */}
      <Text style={{fontSize: 30}}>{item.icon}</Text>
      <View style={styles.textContainer}>
        <Text
          style={styles.oneTimeTitle}
        >{item.title}</Text>
      </View>
      <View style={[styles.transactionInfoContainer, {width: 75}]}>
        <Text
            style={styles.oneTimeDate}
          >{item.date}</Text>
      </View>
      <View style={[styles.transactionInfoContainer, {width: 50, paddingLeft: 15}]}>
        <Text
          style={[styles.oneTimeAmount, { color: item.amount.startsWith('-') ? '#FF0000' : '#00FF11' }]}
        >{item.amount}</Text>
      </View>
      {/* <Switch
        value={item.periodic}
        onValueChange={(value) => updateRow(item.id, "periodic", value.toString())}
      /> */}
      {/* <IconButton icon="dots-horizontal" /> */}
    </View>
  );

  type PeriodicTransactionEntry = {
    id: string;
    icon: string;
    title: string;
    times: string;
    frequency: string,
    amount: string;
    description: string;
  };

  const [periodic, setPeriodic] = useState([
    { id: "1", icon: "💼", title: "Job", times: "1", frequency: "1 week(s)", amount: "500", description: ""},
    { id: "2", icon: "💸", title: "Mow Lawns", times: "1", frequency: "1 day(s)", amount: "15", description: ""},
    { id: "3", icon: "🏠", title: "Rent", times: "1", frequency: "1 month(s)", amount: "-1500", description: ""},
    { id: "4", icon: "📰", title: "NYT Subscription", times: "1", frequency: "4 week(s)", amount: "-25", description: ""},
  ])

  const addPeriodic = () => {
    const newRow = {
      id: Date.now().toString(),
      icon: periodicIcon,
      title: periodicTitle,
      times: periodicTimes,
      frequency: periodicNumOfPeriods + " " + periodicPeriod,
      amount: periodicSign * (parseFloat(periodicAmount) || 0) + "",
      description: periodicDescription,
    };
    setPeriodic([...periodic, newRow]);
  }

  const updatePeriodicRow = (id: string, field: string , value: string) => {
    setPeriodic(periodic.map(item => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const [periodicModal, setPeriodicModal] = useState(false);

  const togglePeriodicModal = () => {
    setPeriodicModal(!periodicModal);
  };

  const [isPeriodicEmojiOpen, setIsPeriodicEmojiOpen] = useState(false);

  const [periodicIcon, setPeriodicIcon] = useState('');
  const [periodicTitle, setPeriodicTitle] = useState('');
  const [periodicSign, setPeriodicSign] = useState(1);
  const [periodicAmount, setPeriodicAmount] = useState('');
  const [periodicTimes, setPeriodicTimes] = useState('');
  const [periodicNumOfPeriods, setPeriodicNumOfPeriods] = useState('');
  const [periodicPeriod, setPeriodicPeriod] = useState(null);
  const [periodicDescription, setPeriodicDescription] = useState('');

  const handlePeriodicIcon = (emojiObject: EmojiType) => {
    setPeriodicIcon(emojiObject.emoji);
  }

  const handlePeriodicTitle = (title: string) => {
    setPeriodicTitle(title);
  }

  const handlePeriodicSign = (sign : any) => {
    setPeriodicSign(sign.value);
  }

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

  const handlePeriodicAdd = () => {
    addPeriodic();
    togglePeriodicModal();
  }

  const renderPeriodicItem = ({item} : { item: PeriodicTransactionEntry}) => (
    <View style={styles.periodicItem}>
      {/* <List.Icon icon="cash" color="black" /> */}
      <Text style={{fontSize: 50}}>{item.icon}</Text>
        <Text
          style={[styles.periodicTitle]}
        >{item.title}</Text>
      <Text
        style={[styles.periodicAmount, { color: item.amount.startsWith('-') ? '#FF0000' : '#00FF11' }]}
      >{item.amount}</Text>
      <Text
        style={styles.periodicFrequency}
      >{item.times}x/{item.frequency}</Text>
      {/* <IconButton icon="dots-horizontal" /> */}
    </View>
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

        <Text style={styles.header}>One-Time Transactions</Text>
        <View style={styles.tableRow}>
          <Text style={[styles.columnHeader, {marginLeft: 30}]}>Title</Text>
          <Text style={[styles.columnHeader, {marginLeft: 100}]}>Date</Text>
          <Text style={[styles.columnHeader, {marginLeft: 5}]}>Amount</Text>
        </View>
          {/* <FlatList data={oneTime.filter(item => !item.periodic)} renderItem={renderItem} keyExtractor={(item) => item.id} /> */}
        <FlatList
        style={{marginBottom: 70}} 
        data={oneTime} 
        renderItem={renderOneTimeItem} 
        keyExtractor={(item) => item.id} 
        scrollEnabled={false}/>
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
              onPress={togglePeriodicModal}>
              <Text style={styles.smallButtonText}>2</Text>
            </TouchableOpacity>
        </View>
        <View style={[styles.smallButtonContainer, { bottom: 140 }]}>
        <View style={styles.labelContainer}><Text style={styles.labelText}>One-Time Transaction</Text></View>
          <TouchableOpacity
            style={styles.smallButton}
            onPress={toggleOneTimeModal}>
            <Text style={styles.smallButtonText}>1</Text>
          </TouchableOpacity>
        </View>
        </>
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={oneTimeModal}
        onRequestClose={toggleOneTimeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* <Text style={styles.modalTitle}>Modal Title</Text> */}
            <View style={styles.modalBody}>
              <Text style={[styles.modalTitle, {fontSize: 16}]}>
                Icon
              </Text>
              <View style={{marginBottom: 20}}>
                  {/* <EmojiSelector onEmojiSelected={handleOneTimeIcon}/> */}
                  <TouchableOpacity style={[styles.textBox, {width: 50, height:50, justifyContent: 'center', alignItems: 'center'}]} onPress={() => setIsOneTimeEmojiOpen(true)}>
                    <Text style={{fontSize: 25, lineHeight: 50, includeFontPadding: false, marginTop: -3, marginLeft: -2}}>{oneTimeIcon}</Text>
                  </TouchableOpacity>
                  <EmojiPicker 
                    onEmojiSelected={handleOneTimeIcon}
                    open={isOneTimeEmojiOpen}
                    onClose={() => setIsOneTimeEmojiOpen(false)}
                  />
              </View>
              <Text style={[styles.modalTitle, {fontSize: 16}]}>
                Title
              </Text>
              <TextInput
                style={[styles.textBox, {width: 300, height: 50, marginBottom: 20}]}
                placeholder="Title"
                placeholderTextColor='#3c5a80'
                value={oneTimeTitle}
                onChangeText={handleOneTimeTitle}
              />
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
                    value={oneTimeSign}
                    onChange={handleOneTimeSign}
                  />
                </View>
                <Text style={{fontSize: 20, color: '#fff', textAlign: 'center', marginLeft: 10, marginTop: 30, marginRight: -5}}>$</Text>
                <View style={{flexDirection: 'column', marginHorizontal: 10}}>
                  <Text style={[styles.modalTitle, {fontSize: 12}]}>Amount</Text>
                  <TextInput
                    style={[styles.textBox, {width: 175, height: 50, marginBottom: 20}]}
                    placeholder="X.XX"
                    placeholderTextColor='#3c5a80'
                    value={oneTimeAmount}
                    onChangeText={handleOneTimeAmount}
                    keyboardType="numeric"
                  />
                </View>
              </View>
              <Text style={[styles.modalTitle, {fontSize: 16}]}>
                Date of Transaction
              </Text>
              <View style={{flexDirection: 'row', marginBottom: 20}}>
                <View style={{flexDirection: 'column', marginHorizontal: 10}}>
                <Text style={[styles.modalTitle, {fontSize: 12}]}>Date: </Text>
                  <TextInput
                    style={[styles.textBox, {width: 60, height: 50}]}
                    placeholder="Date"
                    placeholderTextColor='#3c5a80'
                    value={oneTimeDay}
                    onChangeText={handleOneTimeDay}
                    keyboardType="numeric"
                  />
                </View>
                <View style={{flexDirection: 'column', marginHorizontal: 10}}>
                  <Text style={[styles.modalTitle, {fontSize: 12}]}>Month: </Text>
                  <Dropdown
                    style={[styles.textBox, {height: 50, width: 150}]}
                    placeholderStyle={{color: '#3c5a80'}}
                    selectedTextStyle={{color: '#fff'}}
                    data={months}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Month"
                    value={oneTimeMonth}
                    onChange={(item: { value: React.SetStateAction<null>; }) => {
                      setOneTimeMonth(item.value);
                    }}
                  />
                </View>
                  <View style={{flexDirection: 'column', marginHorizontal: 10}}>
                    <Text style={[styles.modalTitle, {fontSize: 12}]}>Year: </Text>
                    <TextInput
                      style={[styles.textBox, {width: 100, height: 50}]}
                      placeholder="Year"
                      placeholderTextColor='#3c5a80'
                      value={oneTimeYear}
                      onChangeText={handleOneTimeYear}
                      keyboardType="numeric"
                    />
                  </View>
              </View>
              <Text style={[styles.modalTitle, {fontSize: 16}]}>
                Description
              </Text>
              <TextInput
                style={[styles.textBox, {width: 300, height: 200, marginBottom: 20}]}
                placeholder="Description"
                placeholderTextColor='#3c5a80'
                multiline={true}
                value={oneTimeDescription}
                onChangeText={handleOneTimeDescription}
              />
            </View>
            <View style={styles.modalBottom}>
              <TouchableOpacity style={styles.cancelButton} onPress={toggleOneTimeModal}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{fontSize: 30, color: '#ab0000', paddingRight: 10}}>+</Text><Text style={styles.cancelButtonText}>Cancel</Text>
                  </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={handleOneTimeAdd}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{fontSize: 30, color: '#fff', paddingRight: 10}}>+</Text><Text style={styles.closeButtonText}>Add</Text>
                  </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={periodicModal}
        onRequestClose={togglePeriodicModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
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
                    value={periodicSign}
                    onChange={handlePeriodicSign}
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
                  onChange={(item: { value: React.SetStateAction<null>; }) => {
                    setPeriodicPeriod(item.value);
                  }}
                />
              </View>
              <Text style={[styles.modalTitle, {fontSize: 16}]}>
                Description
              </Text>
              <TextInput
                style={[styles.textBox, {width: 300, height: 200, marginBottom: 20}]}
                placeholder="Description"
                placeholderTextColor='#3c5a80'
                multiline={true}
                value={periodicDescription}
                onChangeText={handlePeriodicDescription}
              />
            </View>
            <View style={styles.modalBottom}>
              <TouchableOpacity style={styles.cancelButton} onPress={togglePeriodicModal}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{fontSize: 30, color: '#ab0000', paddingRight: 10}}>+</Text><Text style={styles.cancelButtonText}>Cancel</Text>
                  </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={handlePeriodicAdd}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{fontSize: 30, color: '#fff', paddingRight: 10}}>+</Text><Text style={styles.closeButtonText}>Add</Text>
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
  oneTimeItem: {
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
  oneTimeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: '#fff',
    width: 175,
  },
  oneTimeDate: {
    fontSize: 12,
    color: "#fff",
  },
  oneTimeAmount: {
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
  modalBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
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
  }
});
