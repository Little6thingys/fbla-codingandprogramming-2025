import React, { useRef, useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, Switch, StyleSheet, Modal } from "react-native";
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

  const gainOrLoss = [
    {label: 'Gain', value: '1'},
    {label: 'Loss', value: '-1'}
  ]
  type TransactionEntry = {
    id: string;
    icon: string;
    title: string;
    date: string;
    amount: string;
    description: string;
    // periodic: boolean;
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
      // periodic: false,
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

  const updateRow = (id: string, field: string , value: string) => {
    setOneTime(oneTime.map(item => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const [oneTimeModal, setOneTimeModal] = useState(false);

  const toggleOneTimeModal = () => {
    setOneTimeModal(!oneTimeModal);
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
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

  const handleOneTimeSign = (sign : number) => {
    setOneTimeSign(sign);
  }

  const handleOneTimeAmount = (amount: string) => {
    setOneTimeAmount(amount);
  }

  const handleOneTimeDay = (day: any) => {
    setOneTimeDay(day);
  }

  // const handleOneTimeMonth = (month: any) => {
  //   setOneTimeMonth(month);
  // }
  // const [oneTimeMonthFocus, setOneTimeMonthFocus] = useState(false);

  // const renderLabel = () => {
  //   if (oneTimeMonth || oneTimeMonthFocus){
  //     return(
  //       <Text style={oneTimeMonthFocus && {color: 'blue'}}>
  //         Dropdown Label
  //       </Text>
  //     )
  //   }
  //   return null;
  // }

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
 
  const renderItem = ({ item }: { item: TransactionEntry }) => (
 
    <View style={styles.item}>
      {/* <List.Icon icon="cash" color="black" /> */}
      <Text style={{fontSize: 30}}>{item.icon}</Text>
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
      {/* <Switch
        value={item.periodic}
        onValueChange={(value) => updateRow(item.id, "periodic", value.toString())}
      /> */}
      <IconButton icon="dots-horizontal" />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* <Text style={styles.header}>Periodic Transactions</Text>
      <FlatList data={oneTime.filter(item => item.periodic)} renderItem={renderItem} keyExtractor={(item) => item.id} /> */}

      <Text style={styles.header}>One-Time Transactions</Text>
      <View style={styles.tableRow}>
        <Text style={styles.columnHeader}>Title</Text>
        <Text style={styles.columnHeader}>Date</Text>
        <Text style={styles.columnHeader}>Amount</Text>
        <Text style={styles.columnHeader}>Periodic</Text>
      </View>
        {/* <FlatList data={oneTime.filter(item => !item.periodic)} renderItem={renderItem} keyExtractor={(item) => item.id} /> */}
        <FlatList data={oneTime} renderItem={renderItem} keyExtractor={(item) => item.id} />
       
      <TouchableOpacity onPress={addRow} style={styles.addButton}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.floatingButton} onPress={toggleMenu}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>

      {isMenuOpen && (
        <>
        <View style={[styles.smallButtonContainer, { bottom: 90 }]}>
          <View style={styles.labelContainer}><Text style={styles.labelText}>Periodic Transaction</Text></View>
          <TouchableOpacity
              style={styles.smallButton}
              onPress={() => console.log('Option 2 Pressed')}>
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
                {/* <Picker
                  selectedValue={oneTimeMonth}
                  onValueChange={(itemValue, itemIndex) => setOneTimeMonth(itemValue)}
                  >
                    <Picker.Item label="January" value="1"/>
                    <Picker.Item label="February" value="2"/>
                    <Picker.Item label="March" value="3"/>
                    <Picker.Item label="April" value="4"/>
                    <Picker.Item label="May" value="5"/>
                    <Picker.Item label="June" value="6"/>
                    <Picker.Item label="July" value="7"/>
                    <Picker.Item label="August" value="8"/>
                    <Picker.Item label="September" value="9"/>
                    <Picker.Item label="October" value="10"/>
                    <Picker.Item label="November" value="11"/>
                    <Picker.Item label="December" value="12"/>
                  </Picker> */}
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

  textBox: {
    borderWidth: 1,
    borderColor: "#3c5a80",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#2b415c',
    color: '#fff',
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
