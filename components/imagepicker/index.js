import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import Icon from '@expo/vector-icons/Ionicons';
import { View, TouchableOpacity, Image, Text, TextInput, TouchableWithoutFeedback, Keyboard } from "react-native";
import { launchCamera } from 'react-native-image-picker';


export async function requestPhotoLibraryPerms() {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    console.error('Permission to access camera roll was denied');
  }
}

// request camera permission
export async function requestCameraPerms() {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    console.error('Permission to access camera was denied');
    Alert.alert('Permission Denied', 'Please grant camera permission to use this feature.');
  }
}

export async function pickImage(handleImage) {
  try {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      console.log("Selected Image in ImagePicker:", result);
      handleImage(result);
    }
  } catch (error) {
    console.error("Error picking an image", error);
  }

};

export async function openCamera(handleImage) {
try {
  let result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result.canceled) {
    console.log('Selected Image from Camera:', result);
    handleImage(result);
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
      handleImage(selectedImage);
    }
  });
};

