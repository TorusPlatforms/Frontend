import React, { useState, useCallback, useEffect } from 'react';
import { View, TouchableOpacity, Image, Text, TextInput, ScrollView } from "react-native";
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";
import Icon from '@expo/vector-icons/Ionicons';

const exampleLoopData = {
    pfp: "https://cdn.discordapp.com/attachments/803748247402184714/822541056436207657/kobe_b.PNG?ex=658f138d&is=657c9e8d&hm=37b45449720e87fa714d5a991c90f7fac4abb55f6de14f63253cdbf2da0dd7a4&",
    displayName: "Grant's Group",
    memberCount: 30,
    notifications:false,
    description: "A place for Grants and Hoes to chill",
    chats: ['Chat 1', 'Chat 2', 'Chat 3', 'Chat 4', 'Chat 5','Chat 6', 'Chat 7', 'Chat 8', 'Chat 9'],
    recentAnnouncement: "Grant becomes world's first trillionaire after buying every single realfeel dumpad and selling them for billions each",
    recentAnnouncementUser:"@stefan",
    recentChat: "Did anyone do the GA homework?",
    recentChatUser:"@grant",
    users: ["DrumDogLover","TanujBeatMaster","GrantPawRhythms", "DogGrooveMaster","GrantAndTanujJams","RhythmHound","DrumBeatsWithTanuj","GrantCanineGrooves","TanujDogDrummer","BarkingBeatsGrant","DrummingTanujPaws","GrantAndDogRhythms","TanujDrumTails","PuppyGroovesGrant","BeatBuddyTanuj","WoofingRhythmsGrant","DrummingPawsTanuj","GrantGroovePup","TanujAndTheBeat","DoggyDrummingGrant","RhythmTanujTail","GrantPercussionPup","TanujDoggieBeats","PawsAndSnaresGrant","DrummingDogTanuj","GrantBeatsHowl","TanujRhythmBuddy","DogBeatHarmonyGrant","DrumPawsTanujGroove","GrantAndTanujRhythmic",]
}

const exampleUserData ={

    member: false

}


const ChatButton = ({ name, navigation }) => (
    <TouchableOpacity 
      onPress={() => navigation.navigate("LoopChat", {username: "Chat"})}
      style={{alignSelf: 'center', marginVertical: 10, backgroundColor: 'rgb(50,50,50)', paddingVertical: 15,paddingHorizontal: 50, borderRadius: 40,zIndex:0}}>
      <Text style={{ color: 'white', fontSize: 20 }}>{name}</Text>
    </TouchableOpacity>
  );


  

const LoopsPage = () => {
    const navigation = useNavigation()
    const [notifications, setNotifications] = useState(exampleLoopData.notifications);
    const [isMember, setIsMember] = useState(exampleUserData.member);

    const leaveLoop = () => {
        navigation.goBack();
      };

      const goToInfo = () => {
        navigation.navigate('LoopInfo'); 
      };

      const join = () => {
        setIsMember(true);
        // JOIN THIS LOOP
    };

    const toggleNotifications = () => {
        setNotifications((prevNotifications) => !prevNotifications);
        //TURN ON OR OFF NOTIFICATIONS FOR THIS LOOP
      };


      return (
        <View style={{  paddingTop: 20, backgroundColor: "rgb(22, 23, 24)",height:"100%" }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <TouchableOpacity onPress={leaveLoop} style={{ padding: 10, marginTop: 30 }}>
                <Text style={{ fontSize: 16, color: "white", paddingLeft: 10 }}>Back</Text>
            </TouchableOpacity>

            {isMember && (
            <View style={{ flexDirection: "row"}}>

            <TouchableOpacity style={{padding:10,marginTop:30}} onPress={goToInfo}>
            <Icon name="information-circle-outline" size={30} color="#ffffff"/>
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleNotifications} style={{ padding: 10, marginTop: 30 }}>
            {notifications ? (
                <Icon name="notifications-outline" size={30} color="#ffffff" />
            ) : (
                <Icon name="notifications-off-outline" size={30} color="#ff0000" />
            )}
            </TouchableOpacity>

            </View>
            )}


        </View>
         
          <Image style={{height:150, width:150, alignSelf:'center', borderRadius:200}}source={{uri: exampleLoopData.pfp}}/>
          <Text style={{color:"white", fontSize:30,marginTop:20, alignSelf:"center"}}>{exampleLoopData.displayName}</Text>
          <Text style={{color:"white", fontSize:20, alignSelf:"center",marginTop:10, marginBottom:30}}>{exampleLoopData.description}</Text>

          {!isMember && (
                <TouchableOpacity
                    style={{ backgroundColor: "rgb(247, 212, 114)", borderRadius: 40, borderWidth: 1,borderColor: "black", paddingVertical: 10, paddingHorizontal: 20,marginTop: 20,width: 150,alignContent: "center",alignSelf: "center", height: 60}}
                    onPress={join}>
                    <Text style={{ color: "black", textAlign: "center", alignSelf: "center", marginTop: 6, fontSize: 20 }}>Join</Text>
                </TouchableOpacity>
            )}

          <View style={{ backgroundColor: 'rgb(50,50,50)', alignSelf: "center", marginTop: 20, width: "85%", borderRadius: 20, marginVertical: 0 }}>

{/* Conditionally render announcements */}
{isMember && (
    <View>

    <TouchableOpacity
        onPress={() => navigation.navigate("LoopAnnouncements", { username: "Chat" })}
        style={{ alignSelf: 'center', marginTop: 10, backgroundColor: 'rgb(50,50,50)', paddingVertical: 10, paddingHorizontal: 50, borderRadius: 40, zIndex: 0, }}>
        <Text style={{ color: 'white', fontSize: 20, textDecorationLine: "underline" }}>Announcements</Text>
    </TouchableOpacity>

    <View style={{ paddingHorizontal: 25, marginBottom: 40 }}>
        <Text style={{ color: "white" }}>{exampleLoopData.recentAnnouncementUser}</Text>
        <Text style={{ color: "white" }}>{exampleLoopData.recentAnnouncement}</Text>
    </View>
    </View>
)}

</View>

 <View style={{ backgroundColor: 'rgb(50,50,50)', alignSelf: "center", marginTop: 20, width: "85%", borderRadius: 20, marginVertical: 0 }}>
{isMember && (
    <View>

    <TouchableOpacity
        onPress={() => navigation.navigate("LoopChat", { username: "Announcements" })}
        style={{ alignSelf: 'center', marginTop: 10, backgroundColor: 'rgb(50,50,50)', paddingVertical: 10, paddingHorizontal: 50, borderRadius: 40, zIndex: 0, }}>
        <Text style={{ color: 'white', fontSize: 20, textDecorationLine: "underline" }}>Chat</Text>
    </TouchableOpacity>

    <View style={{ paddingHorizontal: 25, marginBottom: 40 }}>
        <Text style={{ color: "white" }}>{exampleLoopData.recentChatUser}</Text>
        <Text style={{ color: "white" }}>{exampleLoopData.recentChat}</Text>
    </View>
    </View>
)}
</View>


</View>
);
}

export default LoopsPage;

/* 
            <ScrollView style={{marginTop:10, alignSelf:"center",alignContent:"center",maxHeight:300,borderBottomWidth:0,borderTopWidth:0,borderColor:'white', minWidth:"100%",}}>
            {exampleLoopData.chats.map((name, index) => (
            <ChatButton key={index} name={name} navigation={navigation} />
            ))
            MULTIPLE CHATS GO HERE
            }

            
            </ScrollView>
            */