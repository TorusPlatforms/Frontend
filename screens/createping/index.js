import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, Image, Text, TextInput, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from '@expo/vector-icons/Ionicons';

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

const CreatePing = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null)
  const [textInputValue, setTextInputValue] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const textInputRef = useRef(null);

  useEffect(() => {
    // run this whenever the selected image changes
    async function fetchUser() {
      const user = await getUser()
      setUser(user)
    }

    fetchUser()

    requestCameraPerms()
    requestPhotoLibraryPerms()
    
    if (selectedImage && selectedImage.assets && selectedImage.assets.length > 0 && selectedImage.assets[0].uri) {
      console.log('Image is available:', selectedImage.assets[0].uri);
      
    } else {
      console.log('No image available');
    }

  }, [selectedImage]); 

  const closeKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleBackgroundPress = () => {
    closeKeyboard();
  };

  const handleImageSelect = (image) => {
    if (!image.canceled) {
      setSelectedImage(image);
    }
    console.log("Selected Image in CreatePing:", image);
  };

  const handlePictureTaken = (uri) => {
    setSelectedImage({ assets: [{ uri }] });
  };

  const removeImage = () => {

    setSelectedImage(null); // set image to null (delete image)
  };



  const Post = () => { // when you click post
    var string = textInputValue;

    const newStr = string.replace(/\n{2,}/g, '\n\n');
    var imageValid = (selectedImage && selectedImage.assets && selectedImage.assets.length > 0 && selectedImage.assets[0].uri)

    if(newStr.trim() != "" || (imageValid) ){
        var postData; // object for post data

            if (imageValid) {
                postData = {
                    "text": newStr,
                    "image": selectedImage.assets[0].uri // if theres an image use it in the post
                };
            } else {
                postData = {
                    "text": newStr,
                    "image": null // if there isnt an image dont include one
                };
            }
            
            console.log(postData); // log the ping data, eventually make this a server upload shenanigan

    }


    

  };
  
  return (
    <TouchableWithoutFeedback onPress={handleBackgroundPress}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 10 }}>
          <Text style={{ fontSize: 16, color: "white", paddingLeft: 10 }}>Cancel</Text>
        </TouchableOpacity>

        <View style={{ alignItems: 'center', justifyContent: 'flex-start' }}>
          <Text style={{ fontWeight: "bold", fontSize: 20, color: "white" }}>New Ping</Text>
        </View>

        <View style={{ flexDirection: "column", alignItems: "center", marginTop: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image style={styles.pfp} source={{ uri: exampleUserData.pfp }} />
            <TextInput
              ref={textInputRef}
              style={{ marginLeft: 20, paddingRight: 20, paddingVertical: 10, marginTop: 10, color: "white", fontSize: 18, minWidth: 300, maxWidth: 300, maxHeight: 180 }}
              placeholder="Ping your campus and beyond"
              multiline
              maxLength={50}
              numberOfLines={4}
              placeholderTextColor="gray"
              value={textInputValue}
              onChangeText={(text) => setTextInputValue(text)}
            />
          </View>

          <View style={{ flexDirection: "row", marginTop: 20 }}>

            {/* Render the ImagePickercomponeent and pass the callback function, image picker contrains both the camera and camera roll buttons */}
            <View style={{flexDirection:"row"}}>
              <TouchableOpacity style={{ marginRight: 10 }} onPress={() => pickImage(handleImageSelect)}>
                <Icon name="image-outline" size={30} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => openCamera(handleImageSelect)}>
                <Icon name="camera-outline" size={30} color="#FFFFFF" />
              </TouchableOpacity>
            </View> 
          </View>

          {selectedImage && selectedImage.assets && selectedImage.assets.length > 0 && selectedImage.assets[0].uri && (
            <View>
            <Image source={{ uri: selectedImage.assets[0].uri }} style={{ width: 200, height: 200, borderWidth: 2, borderColor: "white", marginTop: 15 }} />
            <TouchableOpacity onPress={removeImage}>
                <Text style={{alignSelf:"center", marginTop:10, color:"red", textDecorationLine:"underline"}}>Remove Image</Text>
            </TouchableOpacity>
             </View>
            
            
          )}

            

          <TouchableOpacity
            style={{ backgroundColor: "rgb(54, 163, 107)", borderRadius: 20, borderWidth: 1, borderColor: "black", paddingVertical: 10, paddingHorizontal: 20, marginTop: 20 }}
            onPress={async() => {await createPost(user, textInputValue, selectedImage); navigation.goBack()}}
          >
            <Text style={{ color: "black", textAlign: "center" }}>Post</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CreatePing;
