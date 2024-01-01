import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, Text, TextInput, TouchableWithoutFeedback, Keyboard, ScrollView, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from '@expo/vector-icons/Ionicons';
import ImagePickerComponent from "./imagepicker";
import defaultPic from "../../assets/user.png"

const exampleLoopData = {
    pfp: "https://cdn.discordapp.com/attachments/803748247402184714/822541056436207657/kobe_b.PNG?ex=658f138d&is=657c9e8d&hm=37b45449720e87fa714d5a991c90f7fac4abb55f6de14f63253cdbf2da0dd7a4&",
    displayName: "Grant's Group",
    memberCount: 30,
    notifications:false,
    description: "A place for Grants and Hoes to chill",
    chats: ['Chat 1', 'Chat 2', 'Chat 3', 'Chat 4', 'Chat 5','Chat 6', 'Chat 7', 'Chat 8', 'Chat 9'],
    recentAnnouncement: "Grant becomes world's first trillionaire after buying every single realfeel dumpad and selling them for billions each",
    recentAnnouncementUser:"@stefan",
    users: ["DrumDogLover","TanujBeatMaster","GrantPawRhythms", "DogGrooveMaster","GrantAndTanujJams","RhythmHound","DrumBeatsWithTanuj","GrantCanineGrooves","TanujDogDrummer","BarkingBeatsGrant","DrummingTanujPaws","GrantAndDogRhythms","TanujDrumTails","PuppyGroovesGrant","BeatBuddyTanuj","WoofingRhythmsGrant","DrummingPawsTanuj","GrantGroovePup","TanujAndTheBeat","DoggyDrummingGrant","RhythmTanujTail","GrantPercussionPup","TanujDoggieBeats","PawsAndSnaresGrant","DrummingDogTanuj","GrantBeatsHowl","TanujRhythmBuddy","DogBeatHarmonyGrant","DrumPawsTanujGroove","GrantAndTanujRhythmic",]
}

const CreatePing = () => {
    const navigation = useNavigation();
    const [nameInputValue, setNameInputValue] = useState("");
    const [discInputValue, setDiscInputValue] = useState("");
    const [chats, setChats] = useState([{ id: 1, value: "" }]);
    const [selectedImage, setSelectedImage] = useState(null);
    
    const handleCreateLoop = () => {
        const loopData = {
          name: nameInputValue,
          description: discInputValue,
          chats: chats.map((chat) => chat.value),
          chatCount:chats.length,
          image: selectedImage ? selectedImage.assets[0].uri : null,
        };
    
        // Do something with the loopData, such as sending it to a server or storing it locally
        console.log("Loop Data:", loopData);
      };
  
    const textInputRefs = useRef(chats.reduce((acc, _, index) => {
      acc[index] = React.createRef();
      return acc;
    }, {}));
  
    useEffect(() => {
      textInputRefs.current[0].current.focus();
    }, []);
  
    const handleTapOutside = () => {
      Keyboard.dismiss();
    };
    
    const handleImageSelect = (image) => {
        setSelectedImage(image);
        console.log("Selected Image in CreateLoop:", image);
      };

    const handleAddChat = () => {
        const newId = chats.length + 1;
        setChats([...chats, { id: newId, value: "" }]);
      
        // Ensure the new ref is created
        textInputRefs.current[newId - 1] = React.createRef();
      
        // Check if the ref is not null before focusing
        if (textInputRefs.current[newId - 1].current) {
          textInputRefs.current[newId - 1].current.focus();
        }
      };

      const handleResetImage = () => {
        setSelectedImage(null);
      };

      const handleRemoveChat = () => {
        if (chats.length > 1) {
          const updatedChats = [...chats];
          updatedChats.pop(); // Remove the last chat
          setChats(updatedChats);
        }
      };
  
    const handleChatInputChange = (text, index) => {
      const updatedChats = [...chats];
      updatedChats[index].value = text;
      setChats(updatedChats);
    };
  
    return (
      <TouchableWithoutFeedback onPress={handleTapOutside}>
        <View style={{ flex: 1, paddingTop: 20, backgroundColor: "rgb(22, 23, 24)" }}>
          <View>
          <View style={{flexDirection:"row", justifyContent:"space-between"}}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 10,marginTop:20 }}>
                    <Text style={{ fontSize: 16, color: "white", paddingLeft: 10 }}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleCreateLoop} style={{ padding: 10,marginTop:20 }}>
                    <Text style={{ fontSize: 16, color: "white", paddingLeft: 10 }}>Create</Text>
            </TouchableOpacity>

          </View>
           
  
            <View style={{ alignItems: 'center', justifyContent: 'flex-start' }}>
              <Text style={{ paddingTop: 0, fontWeight: "bold", fontSize: 30, color: "white",marginTop:20 }}>Create New Loop</Text>
            </View>
            <Image
            source={selectedImage ? { uri: selectedImage.assets[0].uri } : defaultPic}
            style={{
                width: 100,
                height: 100,
                marginLeft: 140,
                marginVertical: 30,
                backgroundColor: "white",
                borderRadius: 100,
            }}
            />
            {selectedImage && (
                <TouchableOpacity onPress={handleResetImage} style={{ marginTop: -10,marginBottom:10, marginLeft: 155 }}>
                <Text style={{ color: "red",textDecorationLine:"underline", fontSize: 10 }}>Remove Image</Text>
                </TouchableOpacity>
            )}
            <View style={{marginLeft:150}}>
                <ImagePickerComponent style={{}} setSelectedImage={handleImageSelect}></ImagePickerComponent>

            </View>
            

            <View style={{ flexDirection: "row", alignItems: "baseline" }}>
              <Text style={{ color: "white", fontSize: 25, marginTop: 50, marginLeft: "5%" }}>Name:</Text>
              <TextInput
                ref={textInputRefs.current[0]}
                style={{
                  marginLeft: 10,
                  color: "white",
                  fontSize: 25,
                  backgroundColor: "black",
                  paddingBottom: 0,
                  paddingRight: 70,
                  paddingLeft: 5,
                  maxWidth: 350,
                  minWidth: 138
                }}
                placeholder="Name"
                multiline
                numberOfLines={4}
                maxLength={40}
                placeholderTextColor="gray"
                value={nameInputValue}
                onChangeText={(text) => setNameInputValue(text)}
              />
            </View>
  
            <View style={{ flexDirection: "row", alignItems: "baseline" }}>
              <Text style={{ color: "white", fontSize: 25, marginTop: 25, marginLeft: "5%" }}>Description:</Text>
              <TextInput
                ref={textInputRefs.current[0]}
                style={{
                  marginLeft: 10,
                  color: "white",
                  fontSize: 10,
                  backgroundColor: "black",
                  paddingBottom: 0,
                  paddingRight: 10,
                  paddingLeft: 5,
                  maxWidth: 220,
                  minWidth: 135
                }}
                placeholder="What is your loop about?"
                multiline
                numberOfLines={4}
                maxLength={100}
                placeholderTextColor="gray"
                value={discInputValue}
                onChangeText={(text) => setDiscInputValue(text)}
              />
            </View>
          </View>
  
          <View style={{ marginTop: 50, }}>
            <Text style={{ color: "white", marginLeft: "5%", fontSize: 25 }}>Chats:</Text>
            <View style={{flexDirection:"row",}}>
                <ScrollView style={{maxHeight:450}}>

                {chats.map((chat, index) => (
              <View key={chat.id} style={{ flexDirection: "row", marginTop: "5%" }}>
                <TextInput
                  ref={textInputRefs.current[index]}
                  style={{
                    marginLeft: 10,
                    color: "white",
                    fontSize: 25,
                    backgroundColor: "black",
                    paddingBottom: 0,
                    paddingRight: 70,
                    paddingLeft: 0,
                    maxWidth: 350,
                    minWidth: 138,
                    marginLeft: "5%"
                  }}
                  placeholder="Name"
                  multiline
                  numberOfLines={4}
                  maxLength={40}
                  placeholderTextColor="gray"
                  value={chat.value}
                  onChangeText={(text) => handleChatInputChange(text, index)}
                />
                
                
              </View>
            ))}


                </ScrollView>

                <View style={{flexDirection:"row",marginTop:8,marginRight:100}}>
                  <TouchableOpacity onPress={() => handleAddChat()}>
                    <Icon name="add-circle-outline" size={30} color="#ffffff" style={{ marginLeft: 20 }} />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => handleRemoveChat()}>
                    <Icon name="remove-circle-outline" size={30} color="#ff0000" style={{ marginLeft: 20 }} />
                  </TouchableOpacity>
                  </View>
                  </View> 
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };
  
  export default CreatePing;