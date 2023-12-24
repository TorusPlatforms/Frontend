import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from '@expo/vector-icons/Ionicons';

const ImagePickerComponent = ({ setSelectedImage }) => {
  const [selectedImageLocal, setSelectedImageLocal] = useState(null); // Fix: Added an initial value

  useEffect(() => {
    // Request permission to access the camera roll
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access camera roll was denied");
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

  return (
    <TouchableOpacity style={{ marginRight: 20 }} onPress={pickImage}>
      <Icon name="image-outline" size={30} color="#FFFFFF" />
    </TouchableOpacity>
  );
};

export default ImagePickerComponent;
