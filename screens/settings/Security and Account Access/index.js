// YourAccountScreen.js
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles1 from './styles1';



export default function SecurityAccountAccess() {
  const navigation = useNavigation();
  const handlePress1 = (screenName) => {
    navigation.navigate(screenName);
  };



return (
  <View style={styles1.container}>
  <Text style={{ fontSize: 25, padding: 20, color: "white", paddingTop: 50, textAlign: 'center', marginBottom: -25 }}>Security and Account Access</Text>
  <Text style={{ fontSize: 15, padding: 20, color: "white", textAlign:'center' }}>Manage your account’s security and keep track of your account’s usage including apps that you have connected to your account.</Text>
 
  <Pressable onPress={() => handlePress1('Coming Soon')}>
  <Text style={{ fontSize: 20, padding: 20, color: "white", marginBottom: -10, marginTop: 20 }}>Security</Text>
  
  <Text style={{ fontSize: 15, color: "lightgrey", paddingLeft: 20, paddingRight: 20 }}>Manage your Account’s Security</Text>
  </Pressable>

  <Pressable onPress={() => handlePress1('Coming Soon')}>
  <Text style={{ fontSize: 20, padding: 20, color: "white", paddingTop: 50, marginBottom: -10  }}>Apps and Sessions</Text>
  
  <Text style={{ fontSize: 15, color: "lightgrey", paddingLeft: 20, paddingRight: 20 }}>See information about when you logged into your account and the apps you connected to your account.</Text>
  </Pressable>

  <Pressable onPress={() => handlePress1('Coming Soon')}>
  <Text style={{ fontSize: 20, padding: 20, color: "white", paddingTop: 50, marginBottom: -10 }}>Connected Accounts</Text>
  
  <Text style={{ fontSize: 15, color: "lightgrey", paddingLeft: 20, paddingRight: 20 }}>Manage Google or Apple accounts connected to Torus to log in.</Text>
  </Pressable>

  <Pressable onPress={() => handlePress1('Coming Soon')}>
  <Text style={{ fontSize: 20, padding: 20, color: "white", paddingTop: 50, marginBottom: -10 }}>Delegates</Text>
  
  <Text style={{ fontSize: 15, color: "lightgrey", paddingLeft: 20, paddingRight: 20 }}>Manage your shared accounts.</Text>
  </Pressable>

  </View>
)

}

