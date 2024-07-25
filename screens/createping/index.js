import React, { useState, useRef, useEffect } from "react";
import { Platform, View, TouchableOpacity, Image, Text, TextInput, TouchableWithoutFeedback, Keyboard, ActivityIndicator, Pressable, Alert, ScrollView, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import Lightbox from 'react-native-lightbox-v2';

import { requestCameraPerms, requestPhotoLibraryPerms, openCamera, pickImage } from "../../components/imagepicker";
import { getUser, createPost } from "../../components/handlers";
import styles from "./styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { InputError } from "../../components/utils/errors";


export default function CreatePing({ route }) {
  const navigation = useNavigation();
  const [user, setUser] = useState(null)
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [isPublic, setIsPublic] = useState(route.params?.loop ? false : true);
  const [refreshing, setRefreshing] = useState(false)
  const [pollChoices, setPollChoices] = useState([])
  const [errorMessage, setErrorMessage] = useState()

  async function fetchUser() {
      const fetchedUser = await getUser()
      setUser(fetchedUser)
  }
  
  useEffect(() => {
    fetchUser()

    requestCameraPerms()
    requestPhotoLibraryPerms()
  }, [route.params]); 


  const handleImageSelect = (fetchedImage) => {
    if (!fetchedImage.canceled) {

      setImage(fetchedImage);

      if (content) {
        setContent(content.substring(0, 250).trim())
      }
    }

    console.log("Selected Image in CreatePing:", image);
  };

  const removeImage = () => {
      setImage(null);
  };

  const removePoll = (index) => {
    setPollChoices(
      pollChoices.filter((_, i) => i !== index)
    );
  };

  const handlePollChange = (index, newValue) => {
    const updatedChoices = [...pollChoices];
    updatedChoices[index] = newValue;
    setPollChoices(updatedChoices);
  };

  function addPollOption() {
    if (pollChoices?.length <= 3) {
      setPollChoices([...pollChoices, "New Poll Option"])
    }
  }

  async function handlePost() {
    setRefreshing(true)
    setErrorMessage(null)

    try {
      if (pollChoices.length == 1) {
        throw new InputError("Poll must have atleast 2 options")
      }

      const postData = {
        content: content, 
        image: image, 
        loop_id: route.params?.loop?.loop_id,
        isPublic: isPublic,
        poll_choices: pollChoices
      }
  
      console.log("Creating post with data:", postData)
      await createPost(postData)

      navigation.goBack()
    } catch(error) {
        if (error instanceof InputError) {
            setErrorMessage(error.message)
        } else {
          Alert.alert("Something went wrong!")
          console.error(error)
        } 
    } finally {
      setRefreshing(false)
    }
  }


  function handleLockPress() {
    let alertTitle, alertMessage = ""
    if (isPublic) {
      alertTitle = "Are you sure you want to make this ping private?"
      alertMessage = `This means only members of this ${route.params?.loop ? "loop" : 'campus'} will be able to see this ping.`
    } else {
      alertTitle = "Are you sure you want to make this ping public?"
      alertMessage = "This means anyone will be able to see this ping."
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
    return (
      <View style={{flex: 1, backgroundColor: "rgb(22, 23, 24)", justifyContent: "center", alignItems: "center"}}>
          <ActivityIndicator />
      </View>
    )
  }

  return (
      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView refreshControl={<RefreshControl refreshing={refreshing} tintColor={"white"}/>}>

        <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 20 }}>
          <Text style={{ fontSize: 16, color: "white" }}>Cancel</Text>
        </TouchableOpacity>

        <View style={{flexDirection: "row"}}>
          <View style={{flex: 0.25}}/>
          <View style={{justifyContent: "center", alignItems: "center", flex: 0.5}}>
              <Text style={{ fontWeight: "bold", fontSize: 20, color: "white", marginBottom: 4 }}>Send a Ping</Text>

              {!route.params?.loop && (
                <Text style={{color: "white", fontSize: 12, textAlign: "center"}}>{isPublic ? "" : `Posting to ${user.college}`}</Text>
              )}

              {route.params?.loop && (
                <Text style={{color: "white", fontSize: 12, textAlign: "center"}}>Posting {isPublic ? "as" : "in"} {route.params.loop.name}</Text>
              )}

              {errorMessage && (
                  <Text style={{ fontSize: 16, color: "red", textAlign: "center", marginTop: 5 }}>{errorMessage}</Text>
              )}
          </View>
          <View style={{flex: 0.25, justifyContent: "center", alignItems: "flex-end"}}>
              {(!(route.params?.loop) || (route.params?.loop?.isOwner || route.params?.loop?.isAdmin)) && (
                <TouchableOpacity onPress={handleLockPress} style={{marginRight: 30}} >
                    <Ionicons name={isPublic ? "lock-open" : "lock-closed"} size={24} color={"white"}/>
                </TouchableOpacity>                
              )}
          </View>
        </View>

        <View style={{ flexDirection: "column", alignItems: "center"}}>
          <View style={{ flexDirection: "row", marginTop: Platform.OS === "ios" ? 20 : 0}}>
            <Image style={styles.pfp} source={{ uri: (route.params?.loop && isPublic ? route.params.loop.pfp_url : user.pfp_url) }} />
            <TextInput
              style={{marginLeft: 20, marginTop: Platform.OS === "ios" ? 10 : 0, color: "white", fontSize: 18, width: 300, minHeight: 50, maxHeight: 350, paddingRight: 20}}
              placeholder="Ping your campus..."
              multiline
              numberOfLines={4}
              maxLength={500}
              placeholderTextColor="gray"
              onChangeText={ text => setContent(text.trim())}
            />

          </View>

            {image && (
              <View style={{marginTop: 10}}>
                  <Lightbox navigator={navigation} activeProps={{style: styles.fullscreenImage}}>
                      <Image source={{ uri: image.uri || image.assets[0].uri }} style={{ width: 250, height: 300, borderRadius: 20, marginLeft: 20}} />
                  </Lightbox>
                
                  <Pressable onPress={removeImage} style={{position: "absolute", right: -10, top: -10}} >
                    <MaterialIcons name="cancel" size={32} color="gray" />
                  </Pressable>

              </View>
            )}

            
            {pollChoices?.length > 0 && (
              <View style={{marginTop: 10}}>
                {pollChoices.map((option, index) => {
                    return (
                      <View key={index} style={{borderWidth: 2, borderColor: "white", minWidth: 230, padding: 15, borderRadius: 10, marginBottom: 10}}>
                          
                          <TextInput 
                            style={{color: "white"}}
                            placeholderTextColor={"gray"}
                            placeholder={option}
                            onChangeText={(text) => handlePollChange(index, text)}
                            maxLength={25}
                          />

                          <Pressable onPress={() => removePoll(index)} style={{position: "absolute", right: -10, top: -10}} >
                            <MaterialIcons name="cancel" size={32} color="gray" />
                          </Pressable>

                      </View> 
                    )         
                })}
                       

                  {pollChoices.length < 4 && (
                    <Pressable onPress={addPollOption} style={{position: "absolute", right: -10, bottom: -5}} >
                      <MaterialIcons name="add-circle" size={32} color="rgb(47, 139, 128)" />
                    </Pressable>
                  )}
          
              </View>
            )}

          <View style={{ flexDirection: "row", marginTop: 20 }}>

            {/* Render the ImagePickercomponeent and pass the callback function, image picker contrains both the camera and camera roll buttons */}
              <TouchableOpacity onPress={() => pickImage(handleImageSelect)}>
                <Ionicons name="image-outline" size={30} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity style={{ marginHorizontal: 15 }} onPress={() => openCamera(handleImageSelect)}>
                <Ionicons name="camera-outline" size={30} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity onPress={addPollOption}>
                <MaterialIcons name="poll" size={30} color="#FFFFFF" />
              </TouchableOpacity>
          </View>


            

          <TouchableOpacity disabled={content.length <= 0} style={{ backgroundColor: content.length > 0 ? "rgb(47, 139, 128)" : "rgb(62, 62, 62)", borderRadius: 20, borderWidth: 1, borderColor: "black", paddingVertical: 15, paddingHorizontal: 40, marginTop: 20 }} onPress={handlePost}>
            <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>Post</Text>
          </TouchableOpacity>
        </View>        
        </KeyboardAwareScrollView>

      </SafeAreaView>
  );
};

