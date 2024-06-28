import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, Text, TextInput, Image, Alert, Pressable, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { pickImage } from '../../components/imagepicker';
import { createLoop, getUser, joinLoop } from "../../components/handlers";
import { AlreadyExistsError } from "../../components/utils/errors";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";




export default function CreateLoop() {
    const navigation = useNavigation();
    const [image, setImage] = useState(); 
    const [name, setName] = useState();
    const [user, setUser] = useState();
    const [isPublic, setIsPublic] = useState(true)
    const [description, setDescription] = useState();
    const [errorMessage, setErrorMessage] = useState(null)
    
    async function handleImageSelect(image) {
      if (!image.canceled) {
        setImage(image)
      }
    };

    async function handleCreateLoop() {
  
        try {
          const createdLoop = await createLoop({
            name: name, 
            description: description, 
            image: image, 
            isPublic: isPublic 
          })

          console.log("Created Loop with Data:", createdLoop)
          
          const newLoopId = createdLoop.LOOPID
          await joinLoop(newLoopId)
          
          navigation.replace("Loop", {loop_id: newLoopId})
        } catch (error) {
          if (error instanceof AlreadyExistsError) {
            setErrorMessage(error.message)
          } else {
            console.error(error)
          }
        }
        
    }
    
    async function fetchUser() {
      const user = await getUser()
      setUser(user)
      setName(user.username + "'s loop")
    }

    useEffect(() => {
      fetchUser()
    }, []);

    function handleLockPress() {
      let alertTitle, alertMessage = ""
      if (isPublic) {
        alertTitle = "Are you sure you want to make this loop private?"
        alertMessage = "This means members will have to request to join your loop. Only you can approve members to join."
      } else {
        alertTitle = "Are you sure you want to make this loop public?"
        alertMessage = "This means anyone from your college will be able to join this loop."
      }
  
      Alert.alert(alertTitle, alertMessage, [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => setIsPublic(!isPublic)},
      ]);
  
    }
   
    
    if (!user) {
      return <ActivityIndicator />
    }
        
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "rgb(22, 23, 24)"}}>
          <KeyboardAwareScrollView contentContainerStyle={{flex: 1, backgroundColor: "rgb(22, 23, 24)"}}>

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

                  <Ionicons name="add-circle" size={32} color="rgb(47, 139, 128)" style={{position: "absolute", top: -10, right: 0}}/>
                </Pressable>
              </View>

              <View style={{marginTop: 25, alignItems: "flex-start", paddingLeft: 20, flex: 1, justifyContent: "space-evenly"}}>
                  <Text style={{color: "gray", fontWeight: "bold"}}>Loop Name</Text>
                  
                  <View style={{flexDirection: 'row'}}>
                      <TextInput 
                          defaultValue={name}
                          onChangeText={setName}
                          style={{
                            backgroundColor: "rgb(62, 62, 62)",
                            width: "70%",
                            borderRadius: 10,
                            paddingLeft: 10,
                            height: 40,
                            flex: 0.8,
                            color: "white"
                          }}
                        />

                        <Pressable onPress={handleLockPress} style={{flex: 0.2, flexDirection: "row", justifyContent: "flex-end", alignItems: "center"}}>
                            {({pressed}) => (
                              <Ionicons name={isPublic ? "lock-open" : "lock-closed"} size={32} color={pressed ? "gray" : "white"} style={{marginRight: 20}}/>
                            )}
                        </Pressable>
                  </View>
                  
                  {errorMessage && (
                    <Text style={{color: "red"}}>{errorMessage}</Text>
                  )}
              </View>
                  
              <View style={{marginTop: 25, alignItems: "flex-start", paddingLeft: 20, flex: 1, justifyContent: "space-evenly"}}>
                  <Text style={{color: "gray", fontWeight: "bold"}}>Description</Text>

                  
                  <TextInput 
                      onChangeText={setDescription}
                      placeholder="A fun place to chill!"
                      placeholderTextColor={"white"}
                      style={{
                        backgroundColor: "rgb(62, 62, 62)",
                        width: "90%",
                        borderRadius: 10,
                        paddingLeft: 10,
                        height: 40
                      }}
                    />
              </View>

              <View style={{flex: 3, marginTop: 50, alignItems: "center"}}>
                <Pressable onPress={handleCreateLoop} style={{backgroundColor: "rgb(47, 139, 128)", width: "90%", height: 40, justifyContent: "center", alignItems: "center", borderRadius: 20}}>
                  <Text style={{color: "white"}}>Create Loop</Text>
                </Pressable>
              </View>

          </KeyboardAwareScrollView>
        </SafeAreaView>

    );
};