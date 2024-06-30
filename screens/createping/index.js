import React, { useState, useRef, useEffect } from "react";
import { Platform, View, TouchableOpacity, Image, Text, TextInput, TouchableWithoutFeedback, Keyboard, ActivityIndicator, Pressable, Alert, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

import { requestCameraPerms, requestPhotoLibraryPerms, openCamera, pickImage } from "../../components/imagepicker";
import { getUser, createPost } from "../../components/handlers";
import styles from "./styles";


export default function CreatePing({ route }) {
  console.log("Navigated to CreatePing with params", route.params)
  const navigation = useNavigation();
  const [user, setUser] = useState(null)
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [isPublic, setIsPublic] = useState(route.params?.loop ? false : true);

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
      setContent(content.substring(0, 250).trim())
    }
    console.log("Selected Image in CreatePing:", image);
  };

  const removeImage = () => {
      setImage(null);
  };

  async function handlePost() {
    const postData = {
      author: (route.params?.loop && isPublic) ? route.params.loop.name : user.username, 
      pfp_url: (route.params?.loop && isPublic) ? route.params.loop.pfp_url : user.pfp_url, 
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
        {/* <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 20 }}>
          <Text style={{ fontSize: 16, color: "white" }}>Cancel</Text>
        </TouchableOpacity> */}

        <View style={{flexDirection: "row"}}>
          <View style={{flex: 0.25}}/>
          <View style={{justifyContent: "center", alignItems: "center", flex: 0.5}}>
              <Text style={{ fontWeight: "bold", fontSize: 20, color: "white", marginBottom: 4 }}>Send a Ping</Text>

              {!route.params?.loop && (
                <Text style={{color: "white", fontSize: 12, textAlign: "center"}}>Posting to {user.college}</Text>
              )}

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
          <View style={{ flexDirection: "row", alignItems: "flex-start", marginTop: Platform.OS === "ios" ? 20 : 0}}>
            <Image style={styles.pfp} source={{ uri: (route.params?.loop && isPublic ? route.params.loop.pfp_url : user.pfp_url) }} />
            <TextInput
              style={{marginLeft: 20, marginTop: 10, color: "white", fontSize: 18, width: 300, minHeight: 50, maxHeight: 350, paddingRight: 20}}
              placeholder="Ping your campus and beyond"
              multiline
              numberOfLines={4}
              maxLength={image ? 250 : 500}
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


            

          <TouchableOpacity style={{ backgroundColor: content.length > 0 ? "rgb(47, 139, 128)" : "rgb(62, 62, 62)", borderRadius: 20, borderWidth: 1, borderColor: "black", paddingVertical: 15, paddingHorizontal: 40, marginTop: 20 }} onPress={handlePost}>
            <Text style={{ color: "white", textAlign: "center" }}>Post</Text>
          </TouchableOpacity>
        </View>        
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

