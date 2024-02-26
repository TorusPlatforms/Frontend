// YourAccountScreen.js
import React, { useState } from 'react';
import { View, Text, Pressable,Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles1 from './styles1';

const exampleUserData ={

    pings:true,
    loops:true,

}

export default function Notifications() {
const [pingEnabled, setPingEnabled] = useState(exampleUserData.pings);
const [loopEnabled, setLoopEnabled] = useState(exampleUserData.loops);
  const navigation = useNavigation();
  const handlePress1 = (screenName) => {
    navigation.navigate(screenName);
  };
  const togglePing = () => {
    setPingEnabled((previousState) => !previousState);
  };
  const toggleLoop = () => {
    setLoopEnabled((previousState) => !previousState);
  };
  const turnOffBothSwitches = () => {
    setPingEnabled(false);
    setLoopEnabled(false);
  };




return (
  <View style={styles1.container}>
  <Text style={{ fontSize: 25, padding: 20, color: "white", paddingTop: 50, textAlign: 'center', marginBottom: -25 }}>Notifications</Text>
  <Text style={{ fontSize: 15, padding: 20, color: "white", textAlign:'center' }}>Select the kinds of of notification you get about your activities, interests, loops, or recommendations.</Text>


  <View style={{flexDirection:"row", justifyContent:"space-between", paddingHorizontal:40,marginTop:50}}>
  <Text style={{ fontSize: 20, color: "white", textAlign: 'center', }}>Ping Notifications:</Text>
    <Switch
        trackColor={{ false: '#767577', true: 'rgb(54, 163, 107)' }}
        thumbColor={pingEnabled ? 'grey' : 'white'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={togglePing}
        value={pingEnabled}
      />
  </View>

  <View style={{flexDirection:"row", justifyContent:"space-between", paddingHorizontal:40,marginTop:50}}>
  <Text style={{ fontSize: 20, color: "white", textAlign: 'center', }}>Loop Notifications:</Text>
    <Switch
        trackColor={{ false: '#767577', true: 'rgb(54, 163, 107)' }}
        thumbColor={loopEnabled ? 'grey' : 'white'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleLoop}
        value={loopEnabled}
      />
  </View>

  <Pressable
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? 'grey' : 'transparent',
            padding: 10,
            borderRadius: 5,
            marginTop: 20,
            width:"70%",
            alignSelf:"center"
          },
        ]}
        onPress={turnOffBothSwitches}>
        <Text style={{ fontSize: 18, color: 'red', textAlign: 'center' }}>Turn Off All Notifications</Text>
      </Pressable>
  

  
  </View>
)

}

