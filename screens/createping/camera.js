import React, { useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Icon from '@expo/vector-icons/Ionicons';

const CameraComponent = () => {
  const [isCameraOpen, setCameraOpen] = useState(false);
  const [isCameraLoading, setCameraLoading] = useState(false); 

  const CameraPress = () => {
    setCameraOpen(!isCameraOpen);
  };

  const onCameraReady = () => {
    setCameraLoading(false);
  };

  return (
    <View style={{}}>
      {isCameraOpen && (
        <RNCamera
          style={{}}
          type={RNCamera.Constants.Type.back}
          captureAudio={false}
          onCameraReady={onCameraReady}
        />
      )}
      <TouchableOpacity onPress={CameraPress}>
        {isCameraLoading ? (
          <ActivityIndicator size="large" color="#ff0000" />
        ) : (
          <Icon name="camera-outline" size={30} color="#ff0000" />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default CameraComponent;
