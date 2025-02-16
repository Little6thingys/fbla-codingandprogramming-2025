import { StyleSheet, Text, View, Image } from 'react-native';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.pageContainer}>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#2E4769',
        headerShown: true,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
            height: 100,
            justifyContent: 'center',
            paddingBottom: 20,
            paddingTop: 20,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            backgroundColor: '#021937',
            borderTopWidth: 0,
            zIndex: 10,
          },
          default: {
            height: 100,
            justifyContent: 'center',
            paddingBottom: 20,
            paddingTop: 20,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            backgroundColor: '#021937',
            borderTopWidth: 0,
            zIndex: 10,
          },
        }),
        tabBarLabelStyle: {
          marginTop: 5, // Adds spacing between the icon and the label
        },
        tabBarIconStyle: {
          overflow: 'visible',
        },
      }}>
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Transactions',
          header: () => (
            <View style={styles.headerContainer}>
              <Image
                source={require('@/assets/images/icon.png')}
                style={styles.logo}
              />
              <Text style={styles.headerText}>App Name</Text>
            </View>
          ),
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="coloncurrencysign.circle" color={color} library="fontAwesome5"/>,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          header: () => (
            <View style={styles.headerContainer}>
              <Image
                source={require('@/assets/images/icon.png')}
                style={styles.logo}
              />
              <Text style={styles.headerText}>App Name</Text>
            </View>
          ),
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="house.fill" color={color} library="fontAwesome5"/>,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          header: () => (
            <View style={styles.headerContainer}>
              <Image
                source={require('@/assets/images/icon.png')}
                style={styles.logo}
              />
              <Text style={styles.headerText}>App Name</Text>
            </View>
          ),
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="line.horizontal.3" color={color} library="material"/>,
        }}
      />
      <Tabs.Screen
        name="chart"
        options={{
          title: 'Charts3',
          header: () => (
            <View style={styles.headerContainer}>
              <Image
                source={require('@/assets/images/icon.png')}
                style={styles.logo}
              />
              <Text style={styles.headerText}>App Name</Text>
            </View>
          ),
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="line.horizontal.3" color={color} library="material"/>,
        }}
      />
    
    </Tabs>
    
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    backgroundColor: '#003D5B',
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 320 : 80,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    backgroundColor: '#003D5B', // You can customize this background color
    justifyContent: 'flex-start',
    zIndex: 10, // Ensure it sits above the content
  },
  logo: {
    width: 40, // Adjust the size of the logo
    height: 40,
    marginRight: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});
