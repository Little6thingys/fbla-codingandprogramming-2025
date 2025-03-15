import { Image, StyleSheet, Platform, Text, TouchableOpacity, View, Linking } from 'react-native';
import { useState, useEffect } from 'react';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { fetchTransactionsBalance } from '../database';

export default function HomeScreen() {
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const fetchedBalance = await fetchTransactionsBalance();
        setBalance(fetchedBalance);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };
    
    fetchBalance();
  }, []);

  const redirectToHelpCenter = () => {
    const url = 'https://financ.tawk.help/';
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  }
  
  return (
    <ThemedView style={styles.backgroundContainer}>
      <View style={{marginBottom: 200}}>
        <Text style={styles.pageTitle}>${balance !== null ? balance : "Loading..."}</Text>
        <Text style={styles.pageSubtitle}>total account balance</Text>
      </View>
      <Text style={styles.pageHeader}>Need Help?</Text>
      <TouchableOpacity style={styles.button} onPress={redirectToHelpCenter}>
        <Text style={{color: '#fff', fontSize: 15, fontWeight: 'bold', textAlign: 'center'}}>Go to Our Help Center</Text>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    backgroundColor: '#003D5B',
    justifyContent: 'center',
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
  pageTitle: {
    fontSize: 80,
    // marginBottom: 10,
    textAlign: "center",
    color: "#fff",
    fontWeight: 'bold',
  },
  pageSubtitle: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
    color: "#fff",
    // fontWeight: 'bold',
  },
  pageHeader: {
    fontSize: 25,
    marginBottom: 10,
    textAlign: "center",
    color: "#fff",
    fontWeight: 'bold',
  },
  button: {
    borderColor: '#fff',
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,
    height: 50,
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  }
});
function aysnc() {
  throw new Error('Function not implemented.');
}

