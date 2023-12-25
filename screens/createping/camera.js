import React, { useState } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { RNCamera } from 'react-native-camera';
import ImagePicker from 'react-native-image-picker';
import Icon from '@expo/vector-icons/Ionicons';

const CameraComponent = ({ onPictureTaken }) => {
    
  return (
      
        <TouchableOpacity >
        <Icon name="camera-outline" size={30} color="#FFFFFF" />
        </TouchableOpacity>
 
  );
};

export default CameraComponent;
