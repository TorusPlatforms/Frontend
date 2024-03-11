import React, { useState, useRef, useEffect, cloneElement } from "react";
import { View, TouchableOpacity, Text, TextInput, TouchableWithoutFeedback, Image, Keyboard, Pressable, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { pickImage } from '../../components/imagepicker';
import { createLoop, getUser, joinLoop, uploadToCDN } from "../../components/handlers";
import { AlreadyExistsError } from "../../components/utils/errors";

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

export default function CreateLoop() {
    const navigation = useNavigation();
    const [image, setImage] = useState(); 
    const [name, setName] = useState();
    const [user, setUser] = useState();
    const [errorMessage, setErrorMessage] = useState(null)
    
    async function handleImageSelect(image) {
      if (!image.canceled) {
        setImage(image)
      }
    };

    async function handleCreateLoop() {
  
        try {
          const createdLoop = await createLoop({name: name, creator_id: user.username, status: "public", location: user.college, image: image })

          console.log("Created Loop", createdLoop)
          
          const newLoopId = createdLoop.LOOPID
          await joinLoop(newLoopId)
          
        } catch (error) {
          if (error instanceof AlreadyExistsError) {
            setErrorMessage(error.message)
          } else {
            console.error(error)
          }
        }
        
    }
    //     const createdLoop = await createLoop(loopData);
    //     //const createdLoopLog = await JSON.parse(createdLoop);
    //     console.log("Created loop:", createdLoop);
    //     const newLoopId = await createdLoop.LOOPID
    //     await joinLoop(newLoopId);
    //     console.log("LOOOOOOOOOOOOP IDDDDDDDDDDDDDD", newLoopId);
    //     goToLoop(newLoopId)

    //   };

    //   const goToLoop = (loopId) => {
    //     console.log("||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||")
    //     console.log(loopId)
    //     navigation.navigate('Loop', { loopId });
    //   };
  
    // const textInputRefs = useRef(chats.reduce((acc, _, index) => {
    //   acc[index] = React.createRef();
    //   return acc;
    // }, {}));
  
    // const handleKeyboardDidShow = (event) => {
    //     setKeyboardHeight(event.endCoordinates.height);
    //   };
    
    //   const handleKeyboardDidHide = () => {
    //     setKeyboardHeight(0);
    //   };

    // useEffect(() => {
    //     const keyboardDidShowListener = Keyboard.addListener(
    //       'keyboardDidShow',
    //       handleKeyboardDidShow,
    //     );
    //     const keyboardDidHideListener = Keyboard.addListener(
    //       'keyboardDidHide',
    //       handleKeyboardDidHide,
    //     );
    
    //     return () => {
    //       keyboardDidShowListener.remove();
    //       keyboardDidHideListener.remove();
    //     };
    //   }, []);
    
    async function fetchUser() {
      const user = await getUser()
      setUser(user)
      setName(user.username + 's loop')
    }

    useEffect(() => {
      fetchUser()
    }, []);


    const handleTapOutside = () => {
      Keyboard.dismiss();
    };
    
    // const handleImageSelect = (image) => {
    //     setSelectedImage(image);
    //     console.log("Selected Image in CreateLoop:", image);
    //   };

    // const handleAddChat = () => {
    //     const newId = chats.length + 1;
    //     setChats([...chats, { id: newId, value: "" }]);
      
    //     // Ensure the new ref is created
    //     textInputRefs.current[newId - 1] = React.createRef();
      
    //     // Check if the ref is not null before focusing
    //     if (textInputRefs.current[newId - 1].current) {
    //       textInputRefs.current[newId - 1].current.focus();
    //     }
    //   };

    //   const handleResetImage = () => {
    //     setSelectedImage(null);
    //   };

    //   const handleRemoveChat = () => {
    //     if (chats.length > 1) {
    //       const updatedChats = [...chats];
    //       updatedChats.pop(); // Remove the last chat
    //       setChats(updatedChats);
    //     }
    //   };
  
    // const handleChatInputChange = (text, index) => {
    //   const updatedChats = [...chats];
    //   updatedChats[index].value = text;
    //   setChats(updatedChats);
    //};
    
    if (!user) {
      return <ActivityIndicator />
    } else {
        return (
          <TouchableWithoutFeedback onPress={handleTapOutside}>
              <SafeAreaView style={{ flex: 1, backgroundColor: "rgb(22, 23, 24)"}}>
                  <View style={{flex: 0.5}}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 10 }}>
                      <Text style={{ fontSize: 16, color: "white", paddingLeft: 10 }}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
            

                  <View style={{flex: 1}}>
                    <Text style={{color: "white", textAlign: "center", fontSize: 24}}>Create Your Loop</Text>
                    <Text style={{color: "white", textAlign: "center"}}>Your loop is where you can connect with your community, from your 10 friends to a hundred-member club</Text>
                  </View>

                  <View style={{alignItems: "center", flex: 1}}>
                    <Pressable onPress={() => pickImage(handleImageSelect)} style={{width: 100, height: 100, borderRadius: 50, borderWidth: 2, justifyContent: 'center', alignItems: "center", borderStyle: 'dashed', borderColor: "gray"}}>
                      {!image && (
                          <View style={{justifyContent: "center", alignItems: "center"}}>
                            <Ionicons name="camera" size={24} color="gray" />
                            <Text style={{color: "gray"}}>Upload</Text>
                          </View>
                      )}

                      
                      {image && (
                          <View style={{justifyContent: "center", alignItems: "center"}}>
                            <Image style={{width: 100, height: 100, borderRadius: 50}} source={{uri:  image.assets[0].uri}}/>
                          </View>
                      )}
                      <Ionicons name="add-circle" size={32} color="blue" style={{position: "absolute", top: -10, right: 0}}/>
                    </Pressable>
                  </View>

                  <View style={{marginTop: 25, alignItems: "flex-start", paddingLeft: 20, flex: 1, justifyContent: "space-evenly"}}>
                    <Text style={{color: "gray", fontWeight: "bold"}}>Loop Name</Text>

                    <TextInput 
                        onChangeText={setName}
                        value={name}
                        style={{
                          backgroundColor: "rgb(109, 116, 120)",
                          width: "90%",
                          borderRadius: 10,
                          paddingLeft: 10,
                          height: 40
                        }}
                      />

                      {errorMessage && (
                        <Text style={{color: "red"}}>{errorMessage}</Text>
                      )}
                  </View>

                  <View style={{flex: 3, marginTop: 50, alignItems: "center"}}>
                    <Pressable onPress={handleCreateLoop} style={{backgroundColor: "blue", width: "90%", height: 40, justifyContent: "center", alignItems: "center", borderRadius: 20}}>
                      <Text style={{color: "white"}}>Create Loop</Text>
                    </Pressable>
                  </View>
              </SafeAreaView>
              </TouchableWithoutFeedback>

        );
      }
  };