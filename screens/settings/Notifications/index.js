// YourAccountScreen.js
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles1 from './styles1';



export default function Notifications() {
  const navigation = useNavigation();
  const handlePress1 = (screenName) => {
    navigation.navigate(screenName);
  };



return (
  <View style={styles1.container}>
  <Text style={{ fontSize: 25, padding: 20, color: "white", paddingTop: 50, textAlign: 'center', marginBottom: -25 }}>Notifications</Text>
  <Text style={{ fontSize: 15, padding: 20, color: "white", textAlign:'center' }}>Select the kinds of of notification you get about your activities, interests, loops, or recommendations.</Text>
 
  <Pressable onPress={() => handlePress1('Notifications')}>
  <Text style={{ fontSize: 20, padding: 20, color: "white", marginBottom: -10, marginTop: 5 }}>Filters</Text>
  
  <Text style={{ fontSize: 15, color: "lightgrey", paddingLeft: 20, paddingRight: 20, marginBottom: -15 }}>Choose the notifications you’d like to see and those you don’t.</Text>
  </Pressable>

  <Pressable onPress={() => handlePress1('Notifications')}>
  <Text style={{ fontSize: 20, padding: 20, color: "white", paddingTop: 50, marginBottom: -10  }}>Preferences</Text>
  
  <Text style={{ fontSize: 15, color: "lightgrey", paddingLeft: 20, paddingRight: 20 }}>Select your preferences by notification type.</Text>
  </Pressable>

  
  </View>
)

}

