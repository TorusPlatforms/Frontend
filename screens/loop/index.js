import React, { useState, useCallback, useEffect } from 'react';
import { View, TouchableOpacity, Image, Text, TextInput } from "react-native";
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";

const LoopsPage = () => {
    const navigation = useNavigation()
    const goToLoop = () => {
        navigation.navigate('Profile'); 
      };


  return (
    <View styles={{BackgroundColor:"gray"}}>
      <TouchableOpacity onPress={goToLoop} style={{ padding: 10, marginTop:30}}>
        <Text style={{ fontSize: 16, color: "white", paddingLeft: 10 }}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

export default LoopsPage;
