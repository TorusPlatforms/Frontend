import React, { useState, useRef, useEffect } from "react";
import { Platform, View, TouchableOpacity, Image, Text, TextInput, TouchableWithoutFeedback, Keyboard, ActivityIndicator, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

import { requestCameraPerms, requestPhotoLibraryPerms, openCamera, pickImage } from "../../components/imagepicker";
import { getUser, sendAnnouncement } from "../../components/handlers";
import styles from "./styles";


export default function CreateAnnouncement({ route }) {
  const navigation = useNavigation();

  const [user, setUser] = useState(null)
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const { loop } = route.params


  async function fetchUser() {
      const user = await getUser()
      setUser(user)
  }
  
  useEffect(() => {
    fetchUser()

    requestCameraPerms()
    requestPhotoLibraryPerms()
  }, []); 


  
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
    const announcementData = {
      loop_id: loop.loop_id,
      content: content,
      image: image
    }
    console.log(announcementData)
    await sendAnnouncement(announcementData)
    
    navigation.goBack()
  }


 
  if (!user) {
    return (
      <View style={{flex: 1, backgroundColor: "rgb(22, 23, 24)", justifyContent: "center", alignItems: "center"}}>
          <ActivityIndicator />
      </View>
    )
  }

  return (
    <TouchableWithoutFeedback onPress={handleBackgroundPress}>
      <SafeAreaView style={styles.container}>
        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
          <Text style={{ fontWeight: "bold", fontSize: 20, color: "white", textAlign: 'center' }}>Send an Announcement</Text>
        </View>

        <View style={{ flexDirection: "column", alignItems: "center"}}>
          <View style={{ flexDirection: "row", alignItems: Platform.OS === "ios" ? "flex-start" : "center", marginTop: Platform.OS === "ios" ? 20 : 0}}>
            <Image style={styles.pfp} source={{ uri: user.pfp_url }} />
            <TextInput
              style={{marginLeft: 20, marginTop: 10, color: "white", fontSize: 18, minWidth: 300, maxWidth: 300, minHeight: 50, paddingRight: 20}}
              placeholder="Announce something to your Loop"
              multiline
              numberOfLines={4}
              placeholderTextColor="gray"
              maxLength={image ? 250 : 500}
              onChangeText={text => setContent(text.trim())}
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


            

          <TouchableOpacity style={{ backgroundColor: "rgb(54, 163, 107)", borderRadius: 20, borderWidth: 1, borderColor: "black", paddingVertical: 10, paddingHorizontal: 20, marginTop: 20 }} onPress={handlePost}>
            <Text style={{ color: "black", textAlign: "center" }}>Post</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

