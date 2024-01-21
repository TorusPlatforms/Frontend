import React, { useState, useRef, useEffect } from "react";
import { View, Image, Text, Animated, Dimensions, Pressable, TextInput, Modal, FlatList, Button,ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

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
      <View style={styles.container}>
       
        <Pressable style={{flexDirection: "row", alignItems: "center", marginLeft: 10, marginTop: 20, paddingRight: 50}} onPress={() => handlePress('Your Account')}>
          <Ionicons name="people" size={24} color={"white"}/>
          <View style={{flexDirection: "col", marginLeft: 10, padding: 5}}>
            <Text style={{ fontSize: 18, color: "white"}}>Your Account </Text>
            <Text style={{ fontSize: 13, color: "lightgrey" }}>See information about your account, download an archive of your data, or learn about your account deactivation options.</Text>
          </View>
         
        </Pressable>

        <Pressable style={{flexDirection: "row", alignItems: "center", marginLeft: 10, marginTop: 20, paddingRight: 50}} onPress={() => handlePress('Security and Account Access')}>
          <Ionicons name="lock-closed" size={24} color={"white"}/> 
          <View style={{flexDirection: "col", marginLeft: 10, padding: 5}}>
            <Text style={{ fontSize: 18, color: "white",  }}>Security and Account Access</Text>
            <Text style={{ fontSize: 13, color: "white" }}>Manage your account’s security and keep track of your account’s usage including apps that you have connected to your account.</Text>
          </View>
        </Pressable>

        <Pressable style={{flexDirection: "row", alignItems: "center", marginLeft: 10, marginTop: 20, paddingRight: 50}} onPress={() => handlePress('Privacy and Safety')}>
          <Ionicons name="shield" size={24} color={"white"}/> 
          <View style={{flexDirection: "col", marginLeft: 10, padding: 5}}>
            <Text style={{ fontSize: 18, color: "white" }}>Privacy and Safety </Text>
            <Text style={{ fontSize: 13, color: "white"}}>Manage what information you see and share on Torus.</Text>
          </View>
        </Pressable>

        <Pressable style={{flexDirection: "row", alignItems: "center", marginLeft: 10, marginTop: 20, paddingRight: 50}} onPress={() => handlePress('Notifications')}>
          <Ionicons name="notifications" size={24} color={"white"}/> 
          <View style={{flexDirection: "col", marginLeft: 10, padding: 5}}>
            <Text style={{ fontSize: 18, color: "white" }}>Notifications</Text>
            <Text style={{ fontSize: 13, color: "white" }}>Select the kinds of notifications you get about your activities, interests, loops, and recommendations.</Text>
          </View>
        </Pressable>

        <Pressable style={{flexDirection: "row", alignItems: "center", marginLeft: 10, marginTop: 20, paddingRight: 50}} onPress={() => handlePress('Accessibility')}>
          <Ionicons name="notifications" size={24} color={"white"}/> 
          <View style={{flexDirection: "col", marginLeft: 10, padding: 5}}>
            <Text style={{ fontSize: 18, color: "white", }}>Accessibility, Display, and Languages </Text>
            <Text style={{ fontSize: 13, color: "white", }}>Manage how Torus content is displayed to you.</Text>
          </View>
        </Pressable>
        {/* <Pressable onPress={() => handlePress('Coming Soon')}>
        <Text style={{ fontSize: 18, padding: 20, color: "white", marginBottom: -15 }}>Additional Resources </Text>
        </Pressable>
        <Text style={{ fontSize: 13, color: "white", paddingLeft: 20, paddingRight: 20, marginBottom: 10 }}>Check out other places for helpful information to learn more about Torus products and services.</Text> */}
      </View>
    );
}

/*
 <Button title="Upload Profile Picture" onPress={pickImage} />
        {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
*/