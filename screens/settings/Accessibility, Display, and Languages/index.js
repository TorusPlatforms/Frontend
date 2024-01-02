// YourAccountScreen.js
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles1 from './styles1';



export default function Accessibility() {
  const navigation = useNavigation();
  const handlePress1 = (screenName) => {
    navigation.navigate(screenName);
  };



return (
  <View style={styles1.container}>
  <Text style={{ fontSize: 25, padding: 20, color: "white", paddingTop: 50, textAlign: 'center', marginBottom: -25 }}>Accessibility, Display, and Languages</Text>
  <Text style={{ fontSize: 15, padding: 20, color: "white", textAlign:'center' }}>Manage how Torus content is displayed to you.</Text>
 
  <Pressable onPress={() => handlePress1('Notifications')}>
  <Text style={{ fontSize: 20, padding: 20, color: "white", marginBottom: -10, marginTop: 20 }}>Accessibility</Text>
  
  <Text style={{ fontSize: 15, color: "lightgrey", paddingLeft: 20, paddingRight: 20 }}>Manage aspects of your Torus experience such as limiting color contrast and motion. These settings affect all the Torus accounts on this device.</Text>
  </Pressable>

  <Pressable onPress={() => handlePress1('Notifications')}>
  <Text style={{ fontSize: 20, padding: 20, color: "white", paddingTop: 50, marginBottom: -10  }}>Display and Sound</Text>
  
  <Text style={{ fontSize: 15, color: "lightgrey", paddingLeft: 20, paddingRight: 20 }}>Manage you font size, color and background. These settings affect all the Torus accounts on this device.</Text>
  </Pressable>

  <Pressable onPress={() => handlePress1('Notifications')}>
  <Text style={{ fontSize: 20, padding: 20, color: "white", paddingTop: 50, marginBottom: -10 }}>Languages</Text>
  
  <Text style={{ fontSize: 15, color: "lightgrey", paddingLeft: 20, paddingRight: 20 }}>Manage which languages are used to personalize your Torus experience.</Text>
  </Pressable>

  <Pressable onPress={() => handlePress1('Notifications')}>
  <Text style={{ fontSize: 20, padding: 20, color: "white", paddingTop: 50, marginBottom: -10 }}>Data Usage</Text>
  
  <Text style={{ fontSize: 15, color: "lightgrey", paddingLeft: 20, paddingRight: 20 }}>Limit how Torus uses some of your network data. These settings affect all the Torus accounts on this device.</Text>
  </Pressable>

  </View>
)

}

