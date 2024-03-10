import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, Image, Text, TextInput, TouchableWithoutFeedback, Keyboard, ActivityIndicator, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

import { requestCameraPerms, requestPhotoLibraryPerms, openCamera, pickImage } from "../../components/imagepicker";
import { getUser, uploadToCDN, createPost } from "../../components/handlers";
import styles from "./styles";

const exampleUserData = {
  pfp: "https://cdn.discordapp.com/attachments/803748247402184714/822541056436207657/kobe_b.PNG?ex=658f138d&is=657c9e8d&hm=37b45449720e87fa714d5a991c90f7fac4abb55f6de14f63253cdbf2da0dd7a4&",
  displayName: "Grant Hough",
  username: "@granthough",
  following: 128,
  followers: 259,
  description: "A pretty funny guy. Has a strong affinity for dogs. \n Stefan Murphy: 'The test is in'"
}

export default function CreatePing() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null)
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);


  async function fetchUser() {
      const user = await getUser()
      setUser(user)
  }
  
  useEffect(() => {
    fetchUser()

    requestCameraPerms()
    requestPhotoLibraryPerms()
  }, []); 

  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      console.log(location)
    })();
  }, []);


  const handleBackgroundPress = () => {
      Keyboard.dismiss();
  };

  const handleImageSelect = (image) => {
    if (!image.canceled) {
      setSelectedImage(image);
    }
    console.log("Selected Image in CreatePing:", image);
  };

  const removeImage = () => {
      setSelectedImage(null); // set image to null (delete image)
  };

  async function handlePost() {
    await createPost(user, content, location.coords.latitude, location.coords.longitude, selectedImage);
    navigation.goBack()
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

        <View style={{ alignItems: 'center', justifyContent: 'flex-start' }}>
          <Text style={{ fontWeight: "bold", fontSize: 20, color: "white" }}>Send a Ping</Text>
        </View>

        <View style={{ flexDirection: "column", alignItems: "center", marginTop: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image style={styles.pfp} source={{ uri: user.pfp_url }} />
            <TextInput
              style={{ marginLeft: 20, paddingRight: 20, paddingVertical: 10, marginTop: 10, color: "white", fontSize: 18, minWidth: 300, maxWidth: 300, maxHeight: 180 }}
              placeholder="Ping your campus and beyond"
              multiline
              maxLength={50}
              numberOfLines={4}
              placeholderTextColor="gray"
              value={content}
              onChangeText={setContent}
            />

          </View>

            {selectedImage && selectedImage.assets && selectedImage.assets.length > 0 && selectedImage.assets[0].uri && (
              <View style={{marginTop: 10}}>
                <Image source={{ uri: selectedImage.assets[0].uri }} style={{ width: 250, height: 300, borderRadius: 20, marginLeft: 20}} />
                
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


            

          <TouchableOpacity
            style={{ backgroundColor: "rgb(54, 163, 107)", borderRadius: 20, borderWidth: 1, borderColor: "black", paddingVertical: 10, paddingHorizontal: 20, marginTop: 20 }}
            onPress={handlePost}
          >
            <Text style={{ color: "black", textAlign: "center" }}>Post</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

