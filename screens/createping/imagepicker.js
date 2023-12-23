import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from '@expo/vector-icons/Ionicons';

const ImagePickerComponent = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  const selectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setSelectedImage({ uri: result.uri });
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={selectImage}>
        <Icon name="image-outline" size={30} color="#ff0000" />
      </TouchableOpacity>

      {selectedImage && (
        <Image
          source={{ uri: selectedImage.uri }}
          style={{ width: 200, height: 200 }}
        />
      )}
    </View>
  );
};

export default ImagePickerComponent;
