import React, { useState } from 'react';
import { ScrollView, Text, View, Pressable, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles1 from './styles1';

const exampleUserData = {
  privacy: true,
  messagePrivacy: 'everyone', // Assuming this is part of your user data
};

const messageOptions = [
  { label: 'Anyone', value: 'everyone' },
  { label: 'Followers', value: 'followers' },
  { label: 'People I Follow', value: 'following' },
  { label: 'No one', value: 'none' },
];

export default function PrivacySafety() {
  const [privacyEnabled, setPrivacyEnabled] = useState(exampleUserData.privacy);
  const [messagePrivacy, setMessagePrivacy] = useState(exampleUserData.messagePrivacy);
  const navigation = useNavigation();

  const togglePrivacy = () => {
    setPrivacyEnabled((previousState) => !previousState);
  };

  // ...

  const selectMessagePrivacy = (value) => {
    setMessagePrivacy(value);
  };

  // Render options dynamically
  const renderMessageOptions = () => {
    return messageOptions.map((option) => (
      <Pressable
        key={option.value}
        onPress={() => selectMessagePrivacy(option.value)}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 5,
        }}
      >
        <Text style={{ fontSize: 15, color: "white" }}>{option.label}</Text>
        <View
          style={{
            height: 24,
            width: 24,
            borderRadius: 12,
            borderWidth: messagePrivacy === option.value ? 2 : 1,
            borderColor: messagePrivacy === option.value ? 'rgb(247, 212, 114)' : 'white',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {messagePrivacy === option.value && (
            <View
              style={{
                height: 12,
                width: 12,
                borderRadius: 6,
                backgroundColor: 'rgb(247, 212, 114)',
              }}
            />
          )}
        </View>
      </Pressable>
    ));
  };

  return (
    <View style={{ height: "100%", backgroundColor: "rgb(22,23,24)" }}>
      

        <View style={{ paddingHorizontal: 40 }}>
          <Text style={{ fontSize: 25, color: "white",marginTop: 20, marginBottom: 15 }}>Who can message me?</Text>
          {renderMessageOptions()}
        </View>

        {/* <Text style={{ fontSize: 25, color: "white", marginTop:40, marginBottom: 10, textAlign: 'center'}}>Account Privacy</Text>
        <Text style={{ fontSize: 15, color: "white", marginTop:0, marginBottom: 20, paddingHorizontal: 15, textAlign: 'center'}}>When your account is public, your profile and posts can be seen by anyone, on or off Torus. When your account is private, only followers can see what you share</Text>

        <Text style={{ fontSize: 15, color: "white", textAlign: 'center', marginBottom: 10}}>Private Account:</Text>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Switch 
              trackColor={{ false: '#767577', true: 'rgb(247, 212, 114)' }}
              thumbColor={privacyEnabled ? 'grey' : 'white'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={togglePrivacy}
              value={privacyEnabled}
          />
        </View> */}
    </View>
  );
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

)


*/