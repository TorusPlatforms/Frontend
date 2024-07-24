import React, { useState, useRef, useEffect } from "react";
import { Platform, View, TouchableOpacity, Image, Text, TextInput, TouchableWithoutFeedback, Keyboard, ActivityIndicator, Pressable, ScrollView, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import Lightbox from 'react-native-lightbox-v2';

import { requestCameraPerms, requestPhotoLibraryPerms, openCamera, pickImage } from "../../components/imagepicker";
import { getLoop, getUser, sendAnnouncement } from "../../components/handlers";
import styles from "./styles";


export default function CreateAnnouncement({ route }) {
  const navigation = useNavigation();

  const [user, setUser] = useState(null)
  const[loop, setLoop] = useState(null)
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [refreshing, setRefreshing] = useState()
  const { loop_id } = route.params


  async function fetchUser() {
      const user = await getUser()
      setUser(user)
  }

  async function fetchLoop() {
    const fetchedLoop = await getLoop(loop_id)
    setLoop(fetchedLoop)
  }
  
  useEffect(() => {
    fetchUser()
    fetchLoop()
    requestCameraPerms()
    requestPhotoLibraryPerms()
  }, []); 


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
    setRefreshing(true)

    const announcementData = {
      loop_id: loop.loop_id,
      content: content,
      image: image
    }
    console.log(announcementData)
    await sendAnnouncement(announcementData)
    
    setRefreshing(false)
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
      <SafeAreaView style={styles.container}>
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} tintColor={"white"}/>}>

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
                maxLength={500}
                onChangeText={text => setContent(text.trim())}
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


            <View style={{ flexDirection: "row", marginTop: 20 }}>

              {/* Render the ImagePickercomponeent and pass the callback function, image picker contrains both the camera and camera roll buttons */}
                <TouchableOpacity style={{ marginRight: 10 }} onPress={() => pickImage(handleImageSelect)}>
                  <Ionicons name="image-outline" size={30} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => openCamera(handleImageSelect)}>
                  <Ionicons name="camera-outline" size={30} color="#FFFFFF" />
                </TouchableOpacity>
            </View>


              

            <TouchableOpacity disabled={content.length <= 0} style={{ backgroundColor: content.length > 0 ? "rgb(54, 163, 107)" : "gray", borderRadius: 20, borderWidth: 1, borderColor: "black", paddingVertical: 10, paddingHorizontal: 20, marginTop: 20 }} onPress={handlePost}>
              <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>Post</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </SafeAreaView>
  );
};

