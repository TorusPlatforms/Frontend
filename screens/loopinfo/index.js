import React, { useState, useCallback, useEffect } from 'react';
import { View, TouchableOpacity, Image, Text, TextInput, ScrollView, Modal, TouchableWithoutFeedback, Alert } from "react-native";
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";
import Icon from '@expo/vector-icons/Ionicons';
import ImagePickerComponent from './imagepicker';

const exampleLoopData = {
    pfp: "https://cdn.discordapp.com/attachments/803748247402184714/822541056436207657/kobe_b.PNG?ex=658f138d&is=657c9e8d&hm=37b45449720e87fa714d5a991c90f7fac4abb55f6de14f63253cdbf2da0dd7a4&",
    displayName: "Grant's Group",
    memberCount: 30,
    description: "A place for Grants and Hoes to chill",
    chatCount:1,
    chats: ['Chat 1', 'Chat 2', 'Chat 3', 'Chat 4', 'Chat 5','Chat 6', 'Chat 7', 'Chat 8', 'Chat 9'],
    recentAnnouncement: "Grant becomes world's first trillionaire after buying every single realfeel dumpad and selling them for billions each",
    recentAnnouncementUser:"@stefan",
    users: ["DrumDogLover","TanujBeatMaster","GrantPawRhythms", "DogGrooveMaster","GrantAndTanujJams","RhythmHound","DrumBeatsWithTanuj","GrantCanineGrooves","TanujDogDrummer","BarkingBeatsGrant","DrummingTanujPaws","GrantAndDogRhythms","TanujDrumTails","PuppyGroovesGrant","BeatBuddyTanuj","WoofingRhythmsGrant","DrummingPawsTanuj","GrantGroovePup","TanujAndTheBeat","DoggyDrummingGrant","RhythmTanujTail","GrantPercussionPup","TanujDoggieBeats","PawsAndSnaresGrant","DrummingDogTanuj","GrantBeatsHowl","TanujRhythmBuddy","DogBeatHarmonyGrant","DrumPawsTanujGroove","GrantAndTanujRhythmic",]
}
const exampleUserData = {

    admin:true

}


const NameList = ({ name }) => (
    <View style={{ marginBottom: 10, paddingVertical: 15,paddingHorizontal: 30}}>
      <Text style={{ color: 'white', fontSize: 15 }}>{name}</Text>
    </View>
  );


  

const LoopInfo = () => {
    const navigation = useNavigation()
    const [notifications, setNotifications] = useState(true);
    const [isManageVisible, setManageVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loopData, setLoopData] = useState({ 
        pfp: "https://cdn.discordapp.com/attachments/803748247402184714/822541056436207657/kobe_b.PNG?ex=658f138d&is=657c9e8d&hm=37b45449720e87fa714d5a991c90f7fac4abb55f6de14f63253cdbf2da0dd7a4&",
        displayName: "Grant's Group",
        memberCount: 30,
        description: "A place for Grants and Hoes to chill",
        chatCount:1,
        chats: ['Chat 1', 'Chat 2', 'Chat 3', 'Chat 4', 'Chat 5','Chat 6', 'Chat 7', 'Chat 8', 'Chat 9'],
        recentAnnouncement: "Grant becomes world's first trillionaire after buying every single realfeel dumpad and selling them for billions each",
        recentAnnouncementUser:"@stefan",
        users: ["DrumDogLover","TanujBeatMaster","GrantPawRhythms", "DogGrooveMaster","GrantAndTanujJams","RhythmHound","DrumBeatsWithTanuj","GrantCanineGrooves","TanujDogDrummer","BarkingBeatsGrant","DrummingTanujPaws","GrantAndDogRhythms","TanujDrumTails","PuppyGroovesGrant","BeatBuddyTanuj","WoofingRhythmsGrant","DrummingPawsTanuj","GrantGroovePup","TanujAndTheBeat","DoggyDrummingGrant","RhythmTanujTail","GrantPercussionPup","TanujDoggieBeats","PawsAndSnaresGrant","DrummingDogTanuj","GrantBeatsHowl","TanujRhythmBuddy","DogBeatHarmonyGrant","DrumPawsTanujGroove","GrantAndTanujRhythmic",]
    });

    const openManage = () => {
        setManageVisible(true);
      };
    
      const closeManage = () => {
        setManageVisible(false);
      };
    
      const handleManageItemPress = (item) => {
        console.log(`Selected: ${item}`);
        closeManage();
      };

    const goToLoop = () => {
        navigation.goBack();
      };

      const handleImageSelect = (image) => {
        setSelectedImage(image);
        console.log("Selected Image in CreateLoop:", image);
      };

      const handleResetImage = () => {
        setSelectedImage(null);
      };

      const updateLoopImage = () => {
            // Process the new image
            console.log("NEW IMAGE: " + selectedImage.assets[0].uri);

            // Update loop data state, changing the pfp property
            // PROBABLY NEEDS TO BE CHANGED FOR BACKEND STUFF TO CHANGE IMAGE
            setLoopData(prevData => ({
                ...prevData,
                pfp: selectedImage.assets[0].uri,
            }));

            // Reset selectedImage to null to remove the current image
            setSelectedImage(null);
        
    };

    const leaveLoop = () => {
        // Display an alert to confirm the user's decision
        Alert.alert(
          'Leave Loop',
          'Are you sure you want to leave the loop?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Confirm',
              onPress: () => {
                // HERE IS WHEN USER CONFIRMS THEY WANT TO LEAVE
                console.log('leave loop');
              },
            },
          ],
          { cancelable: false }
        );
      };


      return (
        <View style={{  paddingTop: 20, backgroundColor: "rgb(22, 23, 24)", height:"100%" }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <TouchableOpacity onPress={goToLoop} style={{ padding: 10, marginTop: 30 }}>
                <Text style={{ fontSize: 16, color: "white", paddingLeft: 10 }}>Back</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={leaveLoop} style={{ padding: 10, marginTop: 30 }}>
            <Text style={{ fontSize: 16, color: "red", paddingLeft: 10 }}>Leave</Text>
            </TouchableOpacity>

           

        </View>

        <Image
            source={selectedImage ? { uri: selectedImage.assets[0].uri } : { uri: loopData.pfp }}
            style={{
                width: 100,
                height: 100,
                marginLeft: 140,
                marginTop: 20,
                backgroundColor: "white",
                borderRadius: 100,
            }}
            />
            {exampleUserData.admin && (
        <View style={{marginTop:10,marginLeft:150}}>
                <ImagePickerComponent style={{}} setSelectedImage={handleImageSelect}></ImagePickerComponent>
            </View>
            )}
            {selectedImage && (
                <>
                    <TouchableOpacity onPress={handleResetImage} style={{ marginTop: 10, marginBottom: 0, marginLeft: 140 }}>
                        <Text style={{ color: "red", textDecorationLine: "underline", fontSize: 15 }}>Remove Image</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={updateLoopImage} style={{ marginTop: 10, marginBottom: 10, marginLeft: 140 }}>
                        <Text style={{ color: "rgb(23, 154, 235)", textDecorationLine: "underline", fontSize: 15 }}>Set New Image</Text>
                    </TouchableOpacity>
                </>
            )}
        <Text style={{color:"white", fontSize:30,marginTop:30, alignSelf:"center"}}>{exampleLoopData.displayName}</Text>
        <Text style={{color:"white", fontSize:15, alignSelf:"center"}}>{exampleLoopData.description}</Text>
        <Text style={{color:"white", fontSize:25,marginTop:20, alignSelf:"center"}}> Members: {exampleLoopData.memberCount}</Text>
        <Text style={{color:"white", fontSize:25, alignSelf:"center"}}>Chats:{exampleLoopData.chatCount}</Text>
        <Text style={{color:"white", fontSize:25, alignSelf:"center",marginTop:70, marginBottom:20}}>Users:</Text>
        
        <ScrollView style={{}}>

        {exampleLoopData.users.map((name, index) => (
            <View style={{flexDirection:"row", borderTopWidth:0.2, borderColor:"white",justifyContent:"space-between"}}>

                <NameList key={index} name={name}  style={{color:"white", alignSelf:"center", marginTop:10}}/>
            

                {exampleUserData.admin && (
                
                    <TouchableOpacity onPress={openManage}>
                        <Icon name="settings-outline" size={20} color="#ffffff" style={{ marginTop:15, marginRight:20}} />
                    </TouchableOpacity>
                )}
            
                
            
            </View>
            ))}   
         
           
        </ScrollView>
        

        <Modal
        transparent
        animationType="slide"
        visible={isManageVisible}
        onRequestClose={closeManage}
        >
  <TouchableWithoutFeedback onPress={closeManage}>
    <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
      <View style={{ backgroundColor: 'rgb(22, 23, 24)', padding: 20, borderRadius: 10, width: '100%', height: '25%',justifyContent:"space-between",borderTopWidth:5,borderColor:"grey" }}>

        <TouchableOpacity onPress={() => handleManageItemPress('Promote to moderator')}>
          <Text style={{fontSize:30,alignSelf:"center", color:"rgb(247, 212, 114)", marginTop:15, }}>Promote to moderator</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleManageItemPress('Kick member')}>
          <Text style={{fontSize:30,alignSelf:"center", color:"red", marginVertical:15, }}>Kick member</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={closeManage}>
          <Text style={{fontSize:30,alignSelf:"center", color:"white",}}>Cancel</Text>
        </TouchableOpacity>

      </View>
    </View>
  </TouchableWithoutFeedback>
</Modal>




        </View>
      );
}

export default LoopInfo;
