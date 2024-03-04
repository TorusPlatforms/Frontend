import React, { useState, useCallback, useEffect } from 'react';
import { View, TouchableOpacity, Image, Text, TextInput, ScrollView, SafeAreaView, AnimatedFlatList } from "react-native";
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import styles from "./styles";
import { useNavigation, useFocusEffect  } from "@react-navigation/native";
import Icon from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { getLoopInfo, getUser, getLoopOwner, getMemberStatus,joinLoop, leaveLoop, getRecentMsgs, getLoopMembers } from "../../components/handlers";
import { Ping } from "../../components/pings";
import { getPings, handleLike, handleShare, postComment } from "../../components/handlers";


const exampleLoopData = {
    pfp: "https://cdn.discordapp.com/attachments/803748247402184714/822541056436207657/kobe_b.PNG?ex=658f138d&is=657c9e8d&hm=37b45449720e87fa714d5a991c90f7fac4abb55f6de14f63253cdbf2da0dd7a4&",
    displayName: "Grant's Group",
    memberCount: 30,
    notifications:false,
    description: "A place for Grants and Hoes to chill",
    chats: ['Chat 1', 'Chat 2', 'Chat 3', 'Chat 4', 'Chat 5','Chat 6', 'Chat 7', 'Chat 8', 'Chat 9'],
    recentAnnouncement: "Grant becomes world's first trillionaire after buying every single realfeel dumpad and selling them for billions each",
    recentAnnouncementUser:"@stefan",
    recentChat: "Did anyone do the GA homework? I really need it and i dont want to ask for more points back again",
    recentChatUser:"@grant",
    status:"public",
    owner:"@grant",
    users: ["DrumDogLover","TanujBeatMaster","GrantPawRhythms", "DogGrooveMaster","GrantAndTanujJams","RhythmHound","DrumBeatsWithTanuj","GrantCanineGrooves","TanujDogDrummer","BarkingBeatsGrant","DrummingTanujPaws","GrantAndDogRhythms","TanujDrumTails","PuppyGroovesGrant","BeatBuddyTanuj","WoofingRhythmsGrant","DrummingPawsTanuj","GrantGroovePup","TanujAndTheBeat","DoggyDrummingGrant","RhythmTanujTail","GrantPercussionPup","TanujDoggieBeats","PawsAndSnaresGrant","DrummingDogTanuj","GrantBeatsHowl","TanujRhythmBuddy","DogBeatHarmonyGrant","DrumPawsTanujGroove","GrantAndTanujRhythmic",]
}

const examplePingData = {
    author:"tanujks",
    content:"whats good guys",
    pfp_url: "https://cdn.discordapp.com/attachments/1183631743740284938/1185415012685201508/IMG_3018.jpg?ex=65f50a42&is=65e29542&hm=79b1ac32172cc9e5d3cd90496c3068824914d1999c3ab5ced28ab2d3cd79e615&",
    isLiked:true,
    image_url:"https://i.imgur.com/Xy1Lqha.png",
    numberof_likes:10,
    numberof_comments:2,
    postURL:"idk"
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

  

const LoopsPage = ({route}) => {
    const {loopId} = route.params;
    const navigation = useNavigation()
    const [notifications, setNotifications] = useState(exampleLoopData.notifications);
    const [isMember, setIsMember] = useState(exampleUserData.member);
    const [activeButton, setActiveButton] = useState("chat");
    const [memberCount, setMemberCount] = useState();
    const [loopData, setLoopData] = useState([]);
    const [ownerName, setOwnerName] = useState([]);
    const [pings, setPings] = useState("hi")

    const fetchLoopData = async () => {
        try {
        const user = await getUser();
          const fetchedLoopsString = await getLoopInfo(loopId);
          const fetchedLoopOwner = await getLoopOwner(loopId);
          const membership = await getMemberStatus(loopId, user.username)
          console.log("FETCHED:", fetchedLoopsString);
          console.log("OWNEROWNEROWNEROWNER:", fetchedLoopOwner.username)
          console.log("MEMBER STATUS:", membership)
          setOwnerName(fetchedLoopOwner.username);
          setLoopData(fetchedLoopsString);
          setIsMember(membership)
          const members = await getLoopMembers(loopId);
          await setMemberCount(members.length);
  
          const fetchedPings = await getPings(user);
          await setPings(fetchedPings);
          await console.log("PING PING PING PING", pings)
        
        } catch (error) {
          console.error("Error fetching loop:", error);
        }
      };

      useEffect(() => {
        fetchLoopData();
      }, []);

      async function fetchPings() {
        const user = await getUser();
        setUser(user)
  
        const fetchedPings = await getPings(user);
        setPings(fetchedPings);
        await console.log("PING PING PING PING", pings)
    
      }

      const updateLike = useCallback(() => {
        fetchPings()
      }, []);

      useFocusEffect(
        useCallback(() => {
          console.log("loop focused");
          fetchLoopData(); 
        }, [])
      );

    const exitLoop = () => { //THIS IS NAVIGATION NOT ACTUALLY LEAVING A LOOP
        navigation.navigate("Home");
      };

      const goToInfo = (loopData) => {
        navigation.navigate('LoopInfo', { loopData, ownerName });
      };

      const join = () => {
        joinLoop(loopId)
        console.log(loopId);
        fetchLoopData()
    };

    const toggleNotifications = () => {
        setNotifications((prevNotifications) => !prevNotifications);
        //TURN ON OR OFF NOTIFICATIONS FOR THIS LOOP
      };

      return (
        <SafeAreaView style={{ backgroundColor: "rgb(22, 23, 24)",height:"100%" }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <TouchableOpacity onPress={exitLoop} style={{ padding: 10, marginTop: 0 }}>
                <Text style={{ fontSize: 16, color: "white", paddingLeft: 10 }}>Back</Text>
            </TouchableOpacity>

            {isMember && (
            <View style={{ flexDirection: "row"}}>

            {/*<TouchableOpacity style={{padding:10,marginTop:30}} onPress={goToInfo}>
            <Icon name="information-circle-outline" size={30} color="#ffffff"/>
            </TouchableOpacity>*/}

            <TouchableOpacity onPress={toggleNotifications} style={{ padding: 10, marginTop: 0 }}>
            {notifications ? (
                <Icon name="notifications-outline" size={30} color="#ffffff" />
            ) : (
                <Icon name="notifications-off-outline" size={30} color="#ff0000" />
            )}
            </TouchableOpacity>

            </View>
            )}


        </View>
            {loopData && memberCount != null && (
            <View>
                <Image
                style={{ height: 150, width: 150, alignSelf: 'center', borderRadius: 200, borderWidth: 0.4, borderColor: "grey" }}
                source={{ uri: loopData.profile_picture }}
                />
                <Text style={{ color: "white", fontSize: 30, marginTop: 20, alignSelf: "center", textAlign: "center", fontWeight:500 }}>{loopData.name}</Text>
                <Text style={{ color: "white", fontSize: 20, alignSelf: "center", marginTop: 10, marginBottom: 0, fontWeight:400 }}>Advisor: {ownerName} </Text>

                <Text style={{ color: "white", fontSize: 20, alignSelf: "center", marginTop: 0, marginBottom: 0, fontWeight:400 }}>
                {memberCount} {memberCount === 1 ? "member" : "members"}
                </Text>
                <Text style={{ color: "white", fontSize: 20, alignSelf: "center", marginTop: 0, marginBottom: 30, fontWeight:400 }}>public</Text>

            </View>
            )}

          {loopData && loopData.length != [] && !isMember && (
            <LinearGradient colors={['#50C878', '#228B22', '#355E3B']} style={{overflow:"hidden", borderRadius: 40, borderWidth: 1,borderColor: "black", paddingHorizontal: 20,marginTop: 20,width: 150,alignContent: "center",alignSelf: "center", height: 60}}>
                <TouchableOpacity
                    style={{  borderRadius: 40, borderWidth: 1,borderColor: "black", paddingVertical: 10, paddingHorizontal: 20,marginTop: 0,width: 150,alignContent: "center",alignSelf: "center", height: 60}}
                    onPress={join}>
                    <Text style={{ color: "black", textAlign: "center", alignSelf: "center", marginTop: 6, fontSize: 20 }}>Join</Text>
                </TouchableOpacity>
            </LinearGradient>
            )}
          



            {isMember && (
                <View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 0,marginHorizontal:20, paddingBottom: 10, borderBottomWidth: 1, borderColor: "white" }}>

            <TouchableOpacity onPress={() => setActiveButton("chat")}>
              <Text style={{ color: activeButton === "chat" ? "rgb(54, 163, 107)" : "white", paddingHorizontal: 20 }}>Chat</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setActiveButton("pings")}>
              <Text style={{ color: activeButton === "pings" ? "rgb(54, 163, 107)" : "white", paddingHorizontal: 20, alignSelf: "center" }}>Pings</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setActiveButton("events")}>
              <Text style={{ color: activeButton === "events" ? "rgb(54, 163, 107)" : "white", paddingHorizontal: 20 }}>Events</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setActiveButton("about")}>
              <Text style={{ color: activeButton === "about" ? "rgb(54, 163, 107)" : "white", paddingHorizontal: 20 }}>About</Text>
            </TouchableOpacity>

          </View>
          <ScrollView style = {{height:"100%"}}>



          {activeButton === "pings" && (
            <View style={{alignSelf:"center", alignContent:"center", marginLeft:0,marginBottom:500, height:"100%"}}>

            {pings.map((ping, index) => (
                <Ping 
                        data={ping} 
                        //setModalVisible={setModalVisible} 
                        handleLike={() => handleLike(item, updateLike)} 
                        handleComment={() => setCommentPing(item)} handleShare={handleShare}
                        navigation={navigation}
                />
                ))}
        
                </View>
                    

)}



{activeButton === "chat" && (
<TouchableOpacity
        onPress={() => navigation.navigate("LoopChat", { username: "Chat", loopId: loopId })}>
        <View style={{ alignSelf: 'left', marginTop: 10, backgroundColor: 'transparent', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 40, zIndex: 0, }}>
            <Text style={{ color: 'white', fontSize: 15 }}>Main Chat</Text>
        </View>
        
    

 <View style={{ backgroundColor: 'rgb(50,50,50)', alignSelf: "center", marginTop: -5, width: "90%", borderRadius: 20, marginVertical: 0 }}>

    <View>


    <View style={{ paddingHorizontal: 15, marginBottom:30,marginTop:20 }}>
        <Text style={{ color: "white", fontWeight: 'bold'}}>{loopData.recentChatUser}</Text>
        <Text style={{ color: "white" }}>{loopData.recentChat}</Text>
    </View>
    </View>

</View>
</TouchableOpacity>
)}
{activeButton === "about" && (
            <View style ={{ alignContent:"center", marginVertical:20, flexDirection:"column"}}>
            <Text style = {{color:"white", alignSelf:"center",fontSize:20, fontWeight:400}}>"{loopData.description}"</Text>
              <Text style = {{color:"white", alignSelf:"center",fontSize:20, marginTop:10, fontWeight:500}}>Rules: </Text>
              <Text style = {{color:"white", alignSelf:"center",fontSize:20}}>{loopData.rules}</Text>
              <TouchableOpacity style={{}} onPress={() => goToInfo(loopData)}>
                <Text style={{color: "white", alignSelf: "center", fontSize: 25, textDecorationLine: "underline", marginTop: 150}}>More Info</Text>
                </TouchableOpacity>
            </View>
          )}
          </ScrollView>
</View>

)}


</SafeAreaView>
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