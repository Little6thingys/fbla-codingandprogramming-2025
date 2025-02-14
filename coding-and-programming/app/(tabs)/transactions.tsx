import React, { useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, Switch, StyleSheet, Modal } from "react-native";
import { List, IconButton } from 'react-native-paper';
// import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';

export default function TransactionsScreen() {
  type TransactionEntry = {
    id: string;
    title: string;
    date: string;
    amount: string;
    description: string;
    // periodic: boolean;
  };
  
  const [oneTime, setOneTime] = useState([
    { id: "1", title: "Ordered Food", date: "12/09/2024", amount: "-15", description: ""},
    { id: "2", title: "Bought Clothes", date: "12/07/2024", amount: "-30", description: ""},
    { id: "3", title: "Found Money on Ground", date: "12/06/2024", amount: "5", description: ""},
    { id: "4", title: "idk at this point", date: "12/06/2024", amount: "5", description: ""},
  ]);

  const addRow = () => {
    const newRow = {
      id: Date.now().toString(),
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
      title: oneTimeTitle,
      date: `${oneTimeMonth}/${oneTimeDay}/${oneTimeYear}`,
      amount: oneTimeAmount,
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

  const [oneTimeTitle, setOneTimeTitle] = useState('');
  const [oneTimeAmount, setOneTimeAmount] = useState('');
  // const [oneTimeDate, setOneTimeDate] = useState('');
  // const [oneTimeDate, setOneTimeDate] = useState(new Date());
  const [oneTimeDay, setOneTimeDay] = useState('');
  const [oneTimeMonth, setOneTimeMonth] = useState('');
  const [oneTimeYear, setOneTimeYear] = useState('');
  const [oneTimeDescription, setOneTimeDescription] = useState('');

  const handleOneTimeTitle = (title: string) => {
    setOneTimeTitle(title);
  }

  const handleOneTimeAmount = (amount: any) => {
    setOneTimeAmount(amount);
  }

  const handleOneTimeDay = (day: any) => {
    setOneTimeDay(day);
  }

  const handleOneTimeMonth = (month: any) => {
    setOneTimeMonth(month);
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
              <Text style={styles.modalTitle}>
                Transaction Title
              </Text>
              <TextInput
                style={[styles.textBox, {marginBottom: 20}]}
                placeholder="Title"
                placeholderTextColor='#0c5ac4'
                value={oneTimeTitle}
                onChangeText={handleOneTimeTitle}
              />
              <Text style={styles.modalTitle}>
                Transaction Amount
              </Text>
              <View style={{flexDirection: 'row', alignContent: 'center'}}>
                <Text style={{fontSize: 20, color: '#fff', padding: 10, textAlign: 'center'}}>$</Text>
                <TextInput
                  style={[styles.textBox, {marginBottom: 20}]}
                  placeholder="X.XX"
                  placeholderTextColor='#0c5ac4'
                  value={oneTimeAmount}
                  onChangeText={handleOneTimeAmount}
                  keyboardType="numeric"
                />
              </View>
              <Text style={styles.modalTitle}>
                Date of Transaction
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Text>Day: </Text>
                <TextInput
                  style={[styles.textBox, {marginBottom: 20}]}
                  placeholder="Day"
                  placeholderTextColor='#0c5ac4'
                  value={oneTimeDay}
                  onChangeText={handleOneTimeDay}
                  keyboardType="numeric"
                />
                <Text>Month: </Text>
                <Picker
                  selectedValue={oneTimeMonth}
                  onValueChange={(value) => handleOneTimeMonth(value)}
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
                  </Picker>
                  <Text>Year: </Text>
                  <TextInput
                    style={[styles.textBox, {marginBottom: 20}]}
                    placeholder="Year"
                    placeholderTextColor='#0c5ac4'
                    value={oneTimeYear}
                    onChangeText={handleOneTimeYear}
                    keyboardType="numeric"
                  />
              </View>
              <Text style={styles.modalTitle}>
                Transaction Description
              </Text>
              <TextInput
                style={[styles.bigTextBox, {marginBottom: 20}]}
                placeholder="Description"
                placeholderTextColor='#0c5ac4'
                multiline={true}
                value={oneTimeDescription}
                onChangeText={handleOneTimeDescription}
              />
            </View>
            <View style={styles.modalBottom}>
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
    width: 300,
    height: 50,
    borderWidth: 1,
    borderColor: "#093f87",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#022554',
    color: '#fff',
  },

  bigTextBox: {
    width: 300,
    height: 200,
    borderWidth: 1,
    textAlignVertical: 'top',
    borderColor: "#093f87",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: '#022554',
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
    width: '90%',
    height: '90%',
    padding: 20,
    backgroundColor: '#021937',
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
    fontSize: 16,
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
});
