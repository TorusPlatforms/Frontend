import React, { useState, useCallback, useEffect } from 'react';
import { View, TouchableOpacity, Image, Text, TextInput, ScrollView, Modal, TouchableWithoutFeedback, Alert } from "react-native";
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";
import Icon from '@expo/vector-icons/Ionicons';
import { getLoopInfo, getUser,editLoop, removeLoop, isOwner,leaveLoop, getLoopMembers } from "../../components/handlers";

import { requestCameraPerms, requestPhotoLibraryPerms, pickImage, openCamera } from '../../components/imagepicker';

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


  

const LoopInfo = ({route}) => {
    const [loopData,setLoopData] = useState(route.params.loopData);
    const navigation = useNavigation();
    const [notifications, setNotifications] = useState(true);
    const [isManageVisible, setManageVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isLoopOwner, setIsLoopOwner] = useState(false);
    const [loopMembers, setLoopMembers] = useState()

    const [isEditMode, setIsEditMode] = useState(false);
    const [editedData, setEditedData] = useState({
        name: loopData.name, 
        description:loopData.description,
        rules:loopData.rules, 
        profile_picture: loopData.profile_picture
    });

  const toggleEditMode = async () => {
    setSelectedImage(null)
    if(isEditMode){
        const newData = {
        "name": editedData.name,
        "description": editedData.description,
        "creator_id": loopData.creator_id,
        "rules": editedData.rules,
        "status": loopData.useState,
        "location": loopData.location,
        "profile_picture": editedData.profile_picture
        }
        try {
            console.log(newData, "\n")
            console.log(loopData.loop_id)
            const user = await getUser();
            await console.log(user.username)
            await editLoop(user.username, loopData.loop_id, newData);
            setLoopData(newData);
          } catch (error) {
  
            console.error('Error editing loop: ON PAGE', error);
          }
    }
    
    await setIsEditMode(!isEditMode)
    await console.log(isEditMode)
  };

  const handleTextChange = (key, value) => {
    setEditedData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };
    /*const [loopData, setLoopData] = useState({ 
        pfp: "https://cdn.discordapp.com/attachments/803748247402184714/822541056436207657/kobe_b.PNG?ex=658f138d&is=657c9e8d&hm=37b45449720e87fa714d5a991c90f7fac4abb55f6de14f63253cdbf2da0dd7a4&",
        displayName: "Grant's Group",
        memberCount: 30,
        description: "A place for Grants and Hoes to chill",
        chatCount:1,
        chats: ['Chat 1', 'Chat 2', 'Chat 3', 'Chat 4', 'Chat 5','Chat 6', 'Chat 7', 'Chat 8', 'Chat 9'],
        recentAnnouncement: "Grant becomes world's first trillionaire after buying every single realfeel dumpad and selling them for billions each",
        recentAnnouncementUser:"@stefan",
        users: ["DrumDogLover","TanujBeatMaster","GrantPawRhythms", "DogGrooveMaster","GrantAndTanujJams","RhythmHound","DrumBeatsWithTanuj","GrantCanineGrooves","TanujDogDrummer","BarkingBeatsGrant","DrummingTanujPaws","GrantAndDogRhythms","TanujDrumTails","PuppyGroovesGrant","BeatBuddyTanuj","WoofingRhythmsGrant","DrummingPawsTanuj","GrantGroovePup","TanujAndTheBeat","DoggyDrummingGrant","RhythmTanujTail","GrantPercussionPup","TanujDoggieBeats","PawsAndSnaresGrant","DrummingDogTanuj","GrantBeatsHowl","TanujRhythmBuddy","DogBeatHarmonyGrant","DrumPawsTanujGroove","GrantAndTanujRhythmic",]
    });*/

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
        setEditedData((prevData) => ({
            ...prevData,
            profile_picture: image.assets[0].uri,
          }));
        console.log("Selected Image in CreateLoop:", image);
      };

      const handleResetImage = () => {
        setSelectedImage(null);
      };

      /*const updateLoopImage = () => {
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
        
    };*/


        const leave = async () => {
        Alert.alert(
            'Leave Loop?',
            'Are you sure you want to leave this loop?',
            [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Confirm',
                onPress: async () => {
                await leaveLoop(loopData.loop_id)
                await navigation.navigate("Home");
                await console.log("LOOPID:", loopData.loop_id)
                console.log('leave loop');
                },
            },
            ],
            { cancelable: false }
        );
        };


        const deleteLoop = async () => {
        Alert.alert(
            'Delete Loop?',
            'Are you sure you want to delete this loop?',
            [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Confirm',
                onPress: async () => {
                    try {
                        console.log(loopData.loop_id)
                        const user = await getUser();
                        await console.log(user.username)
                        await removeLoop(user.username, loopData.loop_id);
                        await navigation.navigate("Home");
                      } catch (error) {
              
                        console.error('Error deleting loop: ON PAGE', error);
                      }
                console.log('delete loop');
                },
            },
            ],
            { cancelable: false }
        );
        };

      useEffect(() => {
        // run this whenever the selected image changes
        requestCameraPerms();
        requestPhotoLibraryPerms();
      
        if (selectedImage && selectedImage.assets && selectedImage.assets.length > 0 && selectedImage.assets[0].uri) {
          console.log('Image is available:', selectedImage.assets[0].uri);
        } else {
          console.log('No image available');
          
        }
      
        const fetchLoopInfo = async () => {
            try {
              const user = await getUser();
              await console.log("POPOPOPOPOPOPOPOPOPOPOP")
              await console.log(loopData.loop_id)
              const members = await getLoopMembers(loopData.loop_id);
              await console.log("||||||||||")
              await console.log(members)
              await setLoopMembers(members)
              const ownerResult = await isOwner(user.username, loopData.loop_id);
              await setIsLoopOwner(ownerResult.isOwner); 
              await console.log(isLoopOwner)
            } catch (error) {
              console.error('Error checking ownership:', error);
            }
          };

          fetchLoopInfo();
      }, [selectedImage], [loopData.loop_id]);

      
      return (
        <View style={{ paddingTop: 20, backgroundColor: "rgb(22, 23, 24)", height: "100%" }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>

          <TouchableOpacity onPress={goToLoop} style={{ padding: 10, marginTop: 30 }}>
                <Text style={{ fontSize: 16, color: "white", paddingLeft: 10 }}>Back</Text>
            </TouchableOpacity>


            {isLoopOwner && (
            <TouchableOpacity onPress={toggleEditMode} style={{ padding: 10, marginTop: 30 }}>
            <Text style={{ fontSize: 16, color: "white", paddingLeft: 10 }}>
                {isEditMode ? "Save" : "Edit"}
            </Text>
            </TouchableOpacity>
            )}


            <TouchableOpacity onPress={isEditMode ? deleteLoop : leave} style={{ padding: 10, marginTop: 30 }}>
            <Text style={{ fontSize: 16, color: "red", paddingLeft: 10 }}>
                {isEditMode ? "Delete" : "Leave"}
            </Text>
            </TouchableOpacity>


            


          </View>

        <Image
            source={selectedImage ? { uri: selectedImage.assets[0].uri } : { uri: loopData.profile_picture }}
            style={{
                width: 100,
                height: 100,
                marginLeft: 140,
                marginTop: 20,
                backgroundColor: "white",
                borderRadius: 100,
            }}
            />
            {isEditMode && (
                <View style={{marginTop:10,marginLeft:150}}>
                  <View style={{flexDirection:"row"}}>
                    <TouchableOpacity style={{ marginRight: 10 }} onPress={() => pickImage(handleImageSelect)}>
                      <Icon name="image-outline" size={30} color="#FFFFFF" />
                    </TouchableOpacity>

                    <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => openCamera(handleImageSelect)}>
                      <Icon name="camera-outline" size={30} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>     
                </View>
            )}
            {selectedImage && (
                <>
                    <TouchableOpacity onPress={handleResetImage} style={{ marginTop: 10, marginBottom: 0, marginLeft: 140 }}>
                        <Text style={{ color: "red", textDecorationLine: "underline", fontSize: 15 }}>Remove Image</Text>
                    </TouchableOpacity>

                    {/*<TouchableOpacity onPress={updateLoopImage} style={{ marginTop: 10, marginBottom: 10, marginLeft: 140 }}>
                        <Text style={{ color: "rgb(23, 154, 235)", textDecorationLine: "underline", fontSize: 15 }}>Set New Image</Text>
                    </TouchableOpacity>*/}
                </>
            )}

            <View>
            <View>

        {isEditMode ? (
            <TextInput
            style={{ color: "white", fontSize: 25, alignSelf: "center", borderWidth: 1, borderColor: 'white', marginTop:20 }}
            placeholder="Enter Name"
            placeholderTextColor="gray"
            value={editedData.name}
            onChangeText={(text) => handleTextChange("name", text)}
            />
        ) : (
            <Text style={{ color: "white", fontSize: 25, alignSelf: "center",marginTop:20 }}>
            {loopData.name}
            </Text>
        )}
        </View>

        <View>

        {isEditMode ? (
            <TextInput
            style={{ color: "white", fontSize: 20, alignSelf: "center", borderWidth: 1, borderColor: 'white' }}
            placeholder="Enter Description"
            placeholderTextColor="gray"
            value={editedData.description}
            onChangeText={(text) => handleTextChange("description", text)}
            />
        ) : (
            <Text style={{ color: "white", fontSize: 20, alignSelf: "center" }}>
            {loopData.description}
            </Text>
        )}
        </View>

  <View>

  {isEditMode ? (
    <TextInput
      style={{ color: "white", fontSize: 20, alignSelf: "center", borderWidth: 1, borderColor: 'white',marginVertical:20 }}
      placeholder="Enter Rules"
      placeholderTextColor="gray"
      value={editedData.rules}
      onChangeText={(text) => handleTextChange("rules", text)}
    />
  ) : (
    <Text style={{ color: "white", fontSize: 20, alignSelf: "center",marginVertical:20 }}>
      {loopData.rules}
    </Text>
  )}
</View>
</View>

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
