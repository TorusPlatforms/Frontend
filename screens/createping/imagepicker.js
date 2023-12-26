import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import Icon from '@expo/vector-icons/Ionicons';
import { View, TouchableOpacity, Image, Text, TextInput, TouchableWithoutFeedback, Keyboard } from "react-native";
import { launchCamera } from 'react-native-image-picker';

const ImagePickerComponent = ({ setSelectedImage }) => {
  const [selectedImageLocal, setSelectedImageLocal] = useState(null); // Fix: Added an initial value

  useEffect(() => {
    // Request camera roll permission
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access camera roll was denied');
      }
    })();

    // request camera permission
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access camera was denied');
        Alert.alert('Permission Denied', 'Please grant camera permission to use this feature.');
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        console.log("Selected Image in ImagePicker:", result);
        setSelectedImage(result);
      }
    } catch (error) {
      console.error("Error picking an image", error);
    }

  };

  const openCamera = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        console.log('Selected Image from Camera:', result);
        setSelectedImage(result);
      }
    } catch (error) {
      console.error('Error opening the camera', error);
    }
  
  
    launchCamera(options, (response) => {
        console.log('Camera response:', response);
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else {
          // Handle the selected image (response.uri)
          console.log('Image URI: ', response.uri);
          const selectedImage = {
            uri: response.uri,
            type: response.type,
            name: response.fileName,
          };
          setSelectedImage(selectedImage);
        }
      });
    };

  return (
    <View style={{flexDirection:"row"}}>

        <TouchableOpacity style={{ marginRight: 10 }} onPress={pickImage}>
    <Icon name="image-outline" size={30} color="#FFFFFF" />
  </TouchableOpacity>

    <TouchableOpacity style={{ marginLeft: 10 }} onPress={openCamera}>
      <Icon name="camera-outline" size={30} color="#FFFFFF" />
    </TouchableOpacity>
    </View>
    

 

  );
};

export default ImagePickerComponent;
