import React, { useState, useRef, useEffect } from "react";
import { View, Image, Text, Animated, Dimensions, Pressable, TextInput, Modal, FlatList, Button,ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker';

import styles from "./styles";

export default function Settings() {
  const navigation = useNavigation();
  
  const handlePress = (screenName) => {
    navigation.navigate(screenName);
  };

    const [image, setImage] = useState(null);

    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      console.log(result);
  
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    };
  
    return (
      <ScrollView style={styles.container}>
       
        <Pressable onPress={() => handlePress('Your Account')}>
        <Text style={{ fontSize: 25, padding: 20, color: "white", paddingTop: 20, marginBottom: -15 }}>Your Account </Text>
        
        <Text style={{ fontSize: 15, color: "lightgrey", paddingLeft: 20, paddingRight: 20, marginBottom: 10 }}>See information about your account, download an archive of your data, or learn about your account deactivation options.</Text>
        </Pressable>
        <Pressable onPress={() => handlePress('Security and Account Access')}>
        <Text style={{ fontSize: 25, padding: 20, color: "white", marginBottom: -15 }}>Security and Account Access </Text>
        </Pressable>
        <Text style={{ fontSize: 15, color: "white", paddingLeft: 20, paddingRight: 20, marginBottom: 10 }}>Manage your account’s security and keep track of your account’s usage including apps that you have connected to your account.</Text>
        <Pressable onPress={() => handlePress('Privacy and Safety')}>
        <Text style={{ fontSize: 25, padding: 20, color: "white", marginBottom: -15 }}>Privacy and Safety </Text>
        </Pressable>
        <Text style={{ fontSize: 15, color: "white" , paddingLeft: 20, paddingRight: 20, marginBottom: 10}}>Manage what information you see and share on Torus.</Text>
        <Pressable onPress={() => handlePress('Notifications')}>
        <Text style={{ fontSize: 25, padding: 20, color: "white", marginBottom: -15 }}>Notifications </Text>
        </Pressable>
        <Text style={{ fontSize: 15, color: "white", paddingLeft: 20, paddingRight: 20, marginBottom: 10 }}>Select the kinds of notifications you get about your activities, interests, loops, and recommendations.</Text>
        <Pressable onPress={() => handlePress('Accessibility')}>
        <Text style={{ fontSize: 25, padding: 20, color: "white", marginBottom: -15 }}>Accessibility, Display, and Languages </Text>
        </Pressable>
        <Text style={{ fontSize: 15, color: "white", paddingLeft: 20, paddingRight: 20, marginBottom: 10 }}>Manage how Torus content is displayed to you.</Text>
        <Pressable onPress={() => handlePress('AdditionalResources')}>
        <Text style={{ fontSize: 25, padding: 20, color: "white", marginBottom: -15 }}>Additional Resources </Text>
        </Pressable>
        <Text style={{ fontSize: 15, color: "white", paddingLeft: 20, paddingRight: 20, marginBottom: 10 }}>Check out other places for helpful information to learn more about Torus products and services.</Text>
      </ScrollView>
    );
}

/*
 <Button title="Upload Profile Picture" onPress={pickImage} />
        {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
*/