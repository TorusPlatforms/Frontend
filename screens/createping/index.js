import React, { useState, useRef, useEffect } from "react";
import { Platform, View, TouchableOpacity, Image, Text, TextInput, TouchableWithoutFeedback, Keyboard, ActivityIndicator, Pressable, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

import { requestCameraPerms, requestPhotoLibraryPerms, openCamera, pickImage } from "../../components/imagepicker";
import { getUser, createPost } from "../../components/handlers";
import styles from "./styles";

const exampleUserData = {
  pfp: "https://cdn.discordapp.com/attachments/803748247402184714/822541056436207657/kobe_b.PNG?ex=658f138d&is=657c9e8d&hm=37b45449720e87fa714d5a991c90f7fac4abb55f6de14f63253cdbf2da0dd7a4&",
  displayName: "Grant Hough",
  username: "@granthough",
  following: 128,
  followers: 259,
  description: "A pretty funny guy. Has a strong affinity for dogs. \n Stefan Murphy: 'The test is in'"
}

export default function CreatePing({ route }) {
  console.log("Navigated to CreatePing with params", route.params)
  const navigation = useNavigation();
  const [user, setUser] = useState(null)
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [isPublic, setIsPublic] = useState(route.params?.loop ? false : true);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);


  async function fetchUser() {
      const fetchedUser = await getUser()
      setUser(fetchedUser)
  }
  
  useEffect(() => {
    fetchUser()

    requestCameraPerms()
    requestPhotoLibraryPerms()
  }, [route.params]); 

  // useEffect(() => {
  //   (async () => {
      
  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== 'granted') {
  //       setErrorMsg('Permission to access location was denied');
  //       return;
  //     }

  //     let location = await Location.getCurrentPositionAsync({});
  //     setLocation(location);
  //     console.log("Fetched location:", location)
  //   })();
  // }, []);


  const handleBackgroundPress = () => {
      Keyboard.dismiss();
  };

  const handleImageSelect = (image) => {
    if (!image.canceled) {
      setImage(image);
    }
    console.log("Selected Image in CreatePing:", image);
  };

  const removeImage = () => {
      setImage(null);
  };

  async function handlePost() {
    const postData = {
      author: (route.params?.loop && isPublic) ? route.params.loop.name : user.username, 
      pfp_url: user.pfp_url, 
      content: content, 
      // latitude: location?.coords.latitude, 
      // longitude: location?.coords.longitude, 
      college: user.college, 
      image: image, 
      loop_id: route.params?.loop?.loop_id,
      isPublic: isPublic
    }
    console.log("Creating post with data:", postData)
    await createPost(postData)
    
    navigation.goBack()
  }


  function handleLockPress() {
    let alertTitle, alertMessage = ""
    if (isPublic) {
      alertTitle = "Are you sure you want to make this ping private?"
      alertMessage = "This means only members of this loop will be able to see this ping."
    } else {
      alertTitle = "Are you sure you want to make this ping public?"
      alertMessage = "This means anyone from your college will be able to see this ping."
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
    <TouchableWithoutFeedback onPress={handleBackgroundPress}>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 20 }}>
          <Text style={{ fontSize: 16, color: "white" }}>Cancel</Text>
        </TouchableOpacity>

        <View style={{flexDirection: "row"}}>
          <View style={{flex: 0.25}}/>
          <View style={{justifyContent: "center", alignItems: "center", flex: 0.5}}>
              <Text style={{ fontWeight: "bold", fontSize: 20, color: "white" }}>Send a Ping</Text>

              {route.params?.loop && (
                <Text style={{color: "white", fontSize: 12, textAlign: "center"}}>Posting {isPublic ? "as" : "in"} {route.params.loop.name}</Text>
              )}
          </View>
          <View style={{flex: 0.25, justifyContent: "center", alignItems: "flex-end"}}>
              {route.params?.loop && route.params?.loop?.isOwner && (
                <Pressable onPress={handleLockPress} style={{marginRight: 30}} >
                    {({pressed}) => (
                      <Ionicons name={isPublic ? "lock-open" : "lock-closed"} size={24} color={pressed ? "gray" : "white"}/>
                  )}
                </Pressable>                
              )}
          </View>
        </View>

        <View style={{ flexDirection: "column", alignItems: "center"}}>
          <View style={{ flexDirection: "row", alignItems: Platform.OS === "ios" ? "flex-start" : "center", marginTop: Platform.OS === "ios" ? 20 : 0}}>
            <Image style={styles.pfp} source={{ uri: user.pfp_url }} />
            <TextInput
              style={{marginLeft: 20, marginTop: 10, color: "white", fontSize: 18, width: 300, minHeight: 50, maxHeight: 300}}
              placeholder="Ping your campus and beyond"
              multiline
              numberOfLines={4}
              maxLength={300}
              placeholderTextColor="gray"
              onChangeText={ text => setContent(text.trim())}
            />

          </View>

            {image && (
              <View style={{marginTop: 10}}>
                <Image source={{ uri: image.assets[0].uri }} style={{ width: 250, height: 300, borderRadius: 20, marginLeft: 20}} />
                
                <Pressable onPress={removeImage} style={{position: "absolute", right: -10, top: -10}} >
                  <MaterialIcons name="cancel" size={32} color="gray" />
                </Pressable>

              </View>
            )}


          <View style={{ flexDirection: "row", marginTop: 20 }}>

            {/* Render the ImagePickercomponeent and pass the callback function, image picker contrains both the camera and camera roll buttons */}
              <TouchableOpacity style={{ marginRight: 10 }} onPress={() => pickImage(handleImageSelect)}>
                <Ionicons name="image-outline" size={30} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => openCamera(handleImageSelect)}>
                <Ionicons name="camera-outline" size={30} color="#FFFFFF" />
              </TouchableOpacity>
          </View>


            

          <TouchableOpacity style={{ backgroundColor: content.length > 0 ? "rgb(54, 163, 107)" : "gray", borderRadius: 20, borderWidth: 1, borderColor: "black", paddingVertical: 10, paddingHorizontal: 20, marginTop: 20 }} onPress={handlePost}>
            <Text style={{ color: "black", textAlign: "center" }}>Post</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

