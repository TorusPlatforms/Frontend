import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, Image, Text, TextInput, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from '@expo/vector-icons/Ionicons';

import ImagePickerComponent from "./imagepicker.js";

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
  const [textInputValue, setTextInputValue] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const textInputRef = useRef(null);

  useEffect(() => {
    // run this whenever the selected image changes
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
    setSelectedImage(image);
    console.log("Selected Image in CreatePing:", image);
  };

  const handlePictureTaken = (uri) => {
    setSelectedImage({ assets: [{ uri }] });
  };

  const Post = () => {
    var string = textInputValue;
    const newStr = string.replace(/\n{2,}/g, '\n\n');
    console.log(newStr);
  
    if (selectedImage && selectedImage.assets && selectedImage.assets.length > 0 && selectedImage.assets[0].uri) {
      console.log('\n img', selectedImage.assets[0].uri);
      // log image if there is one
    } else {
      console.log('\n No img');
    }
  };
  
  return (
    <TouchableWithoutFeedback onPress={handleBackgroundPress}>
      <View style={{ flex: 1, paddingTop: 20, backgroundColor: "rgb(22, 23, 24)" }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 10 }}>
          <Text style={{ fontSize: 16, color: "white", paddingLeft: 10 }}>Cancel</Text>
        </TouchableOpacity>

        <View style={{ alignItems: 'center', justifyContent: 'flex-start' }}>
          <Text style={{ paddingTop: 0, fontWeight: "bold", fontSize: 30, color: "white" }}>New Ping</Text>
        </View>

        <View style={{ flexDirection: "column", alignItems: "center", marginTop: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <Image style={{ width: 50, height: 50, marginLeft: 20, borderRadius: 20 }} source={{ uri: exampleUserData.pfp }} />
            <TextInput
              ref={textInputRef}
              style={{ marginLeft: 20, paddingRight: 20, paddingVertical: 10, marginTop: 10, color: "white", fontSize: 18, minWidth: 150, maxWidth: 300, maxHeight: 180 }}
              placeholder="Type something..."
              multiline
              maxLength={50}
              numberOfLines={4}
              placeholderTextColor="gray"
              value={textInputValue}
              onChangeText={(text) => setTextInputValue(text)}
            />
          </View>

          <View style={{ flexDirection: "row", marginTop: 20 }}>

            {/* Render the ImagePickercomponeent and pass the callback function */}
            <ImagePickerComponent setSelectedImage={handleImageSelect} />
          </View>

          {selectedImage && selectedImage.assets && selectedImage.assets.length > 0 && selectedImage.assets[0].uri && (
            <Image source={{ uri: selectedImage.assets[0].uri }} style={{ width: 200, height: 200, borderWidth: 2, borderColor: "white", marginTop: 15 }} />
          )}

          <TouchableOpacity
            style={{ backgroundColor: "rgb(247, 212, 114)", borderRadius: 20, borderWidth: 1, borderColor: "black", paddingVertical: 10, paddingHorizontal: 20, marginTop: 20 }}
            onPress={Post}
          >
            <Text style={{ color: "black", textAlign: "center" }}>Post</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CreatePing;
