// YourAccountScreen.js
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles1 from './styles1';



export default function YourAccountScreen() {
  const navigation = useNavigation();
  const handlePress1 = (screenName) => {
    navigation.navigate(screenName);
  };



return (
  <View style={styles1.container}>
  <Text style={{ fontSize: 25, padding: 20, color: "white", paddingTop: 50, textAlign: 'center', marginBottom: -25 }}>Your Account</Text>
  <Text style={{ fontSize: 15, padding: 20, color: "white", textAlign:'center' }}>See information about your account, download an archive of your data, or learn about your account deactivation options.</Text>
 
  <Pressable onPress={() => handlePress1('Notifications')}>
  <Text style={{ fontSize: 20, padding: 20, color: "white", marginBottom: -15 }}>Account Information</Text>
  
  <Text style={{ fontSize: 15, color: "lightgrey", paddingLeft: 20, paddingRight: 20 }}>See your account information like your phone number and email address.</Text>
  </Pressable>

  <Pressable onPress={() => handlePress1('Notifications')}>
  <Text style={{ fontSize: 20, padding: 20, color: "white", paddingTop: 50, marginBottom: -15  }}>Change your Password</Text>
  
  <Text style={{ fontSize: 15, color: "lightgrey", paddingLeft: 20, paddingRight: 20 }}>Change your password at any time.</Text>
  </Pressable>

  <Pressable onPress={() => handlePress1('Notifications')}>
  <Text style={{ fontSize: 20, padding: 20, color: "white", paddingTop: 50, marginBottom: -15 }}>Download an archive of your data</Text>
  
  <Text style={{ fontSize: 15, color: "lightgrey", paddingLeft: 20, paddingRight: 20 }}>Get insights into the type of information stored for you account.</Text>
  </Pressable>

  <Pressable onPress={() => handlePress1('Notifications')}>
  <Text style={{ fontSize: 20, padding: 20, color: "white", paddingTop: 50, marginBottom: -15 }}>Deactivate your account</Text>
  
  <Text style={{ fontSize: 15, color: "lightgrey", paddingLeft: 20, paddingRight: 20 }}>Find out how you can deactivate your account.</Text>
  </Pressable>

  </View>
)

}

