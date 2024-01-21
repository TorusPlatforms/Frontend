// YourAccountScreen.js
import React, { useState } from 'react';
//import { View, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles1 from './styles1';
import { ScrollView, Text, View, Pressable, Switch} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';


const exampleUserData ={

  privacy:true,
  

}

export default function PrivacySafety() {
  const [privacyEnabled, setPrivacyEnabled] = useState(exampleUserData.privacy);
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'Friends', value: 3},
    {label: 'Followers', value: 2},
    {label: 'Anyone', value: 1},
    {label:'No one', value: 0}
  ]);

  const handlePress1 = (screenName) => {
    navigation.navigate(screenName);
  };

  const togglePrivacy = () => {
    setPrivacyEnabled((previousState) => !previousState);
  };
  const turnOffSwitch = () => {
    setPrivacyEnabled(false);
   
  };


  
  


  return (

    <ScrollView style={{height:"100%", backgroundColor:"rgb(22,23,24)"}}>
    <View style={{backgroundColor:"rgb(22,23,24)", height:"100%"}}>
    <Text style={{ fontSize: 25, padding: 20, color: "white", paddingTop: 50, textAlign: 'center', marginBottom: -35 }}>Privacy and Safety</Text>
    <Text style={{ fontSize: 12, padding: 20, color: "white", textAlign:'center', marginBottom: -25 }}>Manage what information you allow other people on Torus to see.</Text>
    <Text style={{ fontSize: 15, color: "white", textAlign:'center', marginBottom: 25 }}>______________________________________________________</Text>

    <View style={{ paddingHorizontal: 40 }}>
  <Text style={{ fontSize: 15, color: "white" }}>Who can message me?</Text>
  <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
    />

<Text style={{ fontSize: 20, color: "white", marginTop:40, marginBottom: 10, textAlign: 'center'}}>Account Privacy</Text>
<Text style={{ fontSize: 10, color: "light grey", marginTop:0, marginBottom: 20, textAlign: 'center'}}>When your account is public, your profile and posts can be seen by anyone, on or off Torus. When your account is private, only followers can see what you share</Text>

  <Text style={{ fontSize: 15, color: "white", marginBottom: 10,}}>Private Account:</Text>
<Switch
        
        trackColor={{ false: '#767577', true: 'rgb(247, 212, 114)' }}
        thumbColor={privacyEnabled ? 'grey' : 'white'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={togglePrivacy}
        value={privacyEnabled}
      />
</View>


  
    
    </View>
    </ScrollView>
    
  )


}

// vvvv  OLD PRIVACY PAGE SAVE FOR LATER vvvv

/* return (
  <ScrollView>
  <View style={styles1.container}>
  <Text style={{ fontSize: 25, padding: 20, color: "white", paddingTop: 50, textAlign: 'center', marginBottom: -35 }}>Privacy and Safety</Text>
  <Text style={{ fontSize: 12, padding: 20, color: "white", textAlign:'center', marginBottom: -25 }}>Manage what information you allow other people on Torus to see.</Text>
  <Text style={{ fontSize: 15, color: "white", textAlign:'center', marginBottom: 25 }}>______________________________________________________</Text>
  <Text style={{ fontSize: 20, padding: 10, color: "white", marginBottom: 10 }}>  Your Torus activity</Text>

  <Pressable onPress={() => handlePress1('Notifications')}>
  <Text style={{ fontSize: 20, padding: 20, color: "white", marginBottom: -15 }}>Audience and Tagging</Text>
  
  <Text style={{ fontSize: 12, color: "lightgrey", paddingLeft: 20, paddingRight: 20, marginBottom: -15 }}>Manage what information you allow other people on Torus to see.</Text>
  </Pressable>

  <Pressable onPress={() => handlePress1('Notifications')}>
  <Text style={{ fontSize: 20, padding: 20, color: "white", paddingTop: 50, marginBottom: -15  }}>Your Posts</Text>
  
  <Text style={{ fontSize: 12, color: "lightgrey", paddingLeft: 20, paddingRight: 20, marginBottom: -15 }}>Manage the information associated with your posts.</Text>
  </Pressable>

  <Pressable onPress={() => handlePress1('Notifications')}>
  <Text style={{ fontSize: 20, padding: 20, color: "white", paddingTop: 50, marginBottom: -15 }}>Content You See</Text>
  
  <Text style={{ fontSize: 12, color: "lightgrey", paddingLeft: 20, paddingRight: 20, marginBottom:-15 }}>Decide what you see on Torus based on your preferences like interests and topics.</Text>
  </Pressable>

  <Pressable onPress={() => handlePress1('Notifications')}>
  <Text style={{ fontSize: 20, padding: 20, color: "white", paddingTop: 50, marginBottom: -15 }}>Mute and Block</Text>
  
  <Text style={{ fontSize: 12, color: "lightgrey", paddingLeft: 20, paddingRight: 20, marginBottom: -15 }}>Manage the accounts, words, and notifications that you’ve muted or blocked.</Text>
  </Pressable>


  <Pressable onPress={() => handlePress1('Notifications')}>
  <Text style={{ fontSize: 20, padding: 20, color: "white", paddingTop: 50, marginBottom: -15 }}>Direct Messages</Text>
  
  <Text style={{ fontSize: 12, color: "lightgrey", paddingLeft: 20, paddingRight: 20, marginBottom: -15 }}>Manage who can message you directly.</Text>
  </Pressable>

  <Pressable onPress={() => handlePress1('Notifications')}>
  <Text style={{ fontSize: 20, padding: 20, color: "white", paddingTop: 50, marginBottom: -15 }}>Loops</Text>
  
  <Text style={{ fontSize: 12, color: "lightgrey", paddingLeft: 20, paddingRight: 20, marginBottom: -15 }}>Manage your loops activity.</Text>
  </Pressable>

  <Pressable onPress={() => handlePress1('Notifications')}>
  <Text style={{ fontSize: 20, padding: 20, color: "white", paddingTop: 50, marginBottom: -15 }}>Discoverability and Contact</Text>
  
  <Text style={{ fontSize: 12, color: "lightgrey", paddingLeft: 20, paddingRight: 20, marginBottom:20 }}>Control your discoverability setting and manage contacts you’ve imported.</Text>
  </Pressable>

  <Text style={{ fontSize: 15, color: "white", textAlign:'center', marginBottom: 25 }}>______________________________________________________</Text>
  <Text style={{ fontSize: 20, padding: 10, color: "white", marginBottom: -20 }}>  Data Sharing and Personalization</Text>

  <Pressable onPress={() => handlePress1('Notifications')}>
  <Text style={{ fontSize: 20, padding: 20, color: "white", paddingTop: 50, marginBottom: -15 }}>Ads Preferences</Text>
  
  <Text style={{ fontSize: 12, color: "lightgrey", paddingLeft: 20, paddingRight: 20, marginBottom:-20 }}>Manage your ads experience on Torus.</Text>
  </Pressable>

  <Pressable onPress={() => handlePress1('Notifications')}>
  <Text style={{ fontSize: 20, padding: 20, color: "white", paddingTop: 50, marginBottom: -15 }}>Inferred Identity</Text>
  
  <Text style={{ fontSize: 12, color: "lightgrey", paddingLeft: 20, paddingRight: 20, marginBottom:-20 }}>Allow Torus to personalize your experience with your inferred activity, e.i. activity on devices you haven’t used to log in to Torus.</Text>
  </Pressable>

  <Pressable onPress={() => handlePress1('Notifications')}>
  <Text style={{ fontSize: 20, padding: 20, color: "white", paddingTop: 50, marginBottom: -15 }}>Data Sharing with Business Partners</Text>
  
  <Text style={{ fontSize: 12, color: "lightgrey", paddingLeft: 20, paddingRight: 20, marginBottom:-20 }}>Allow sharing of additional information with Torus’ business partners.</Text>
  </Pressable>

  <Pressable onPress={() => handlePress1('Notifications')}>
  <Text style={{ fontSize: 20, padding: 20, color: "white", paddingTop: 50, marginBottom: -15 }}>Location Information</Text>
  
  <Text style={{ fontSize: 12, color: "lightgrey", paddingLeft: 20, paddingRight: 20, marginBottom:20 }}>Manage the location information Torus uses to personalize your experience.</Text>
  </Pressable>

  <Text style={{ fontSize: 15, color: "white", textAlign:'center', marginBottom: 25 }}>______________________________________________________</Text>
  <Text style={{ fontSize: 20, padding: 10, color: "white", marginBottom: -20 }}>  Learn More about Privacy on Torus</Text>


  <Pressable onPress={() => handlePress1('Notifications')}>
  <Text style={{ fontSize: 20, padding: 20, color: "white", paddingTop: 50, marginBottom: -25 }}>Privacy Center</Text>
  </Pressable>

  <Pressable onPress={() => handlePress1('Notifications')}>
  <Text style={{ fontSize: 20, padding: 20, color: "white", paddingTop: 50, marginBottom: -25 }}>Privacy Policy</Text>
  </Pressable>


  <Pressable onPress={() => handlePress1('Notifications')}>
  <Text style={{ fontSize: 20, padding: 20, color: "white", paddingTop: 50, marginBottom: 15 }}>Contact Us</Text>
  </Pressable>


  </View>
  </ScrollView>
)*/