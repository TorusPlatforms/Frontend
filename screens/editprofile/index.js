import React, { useState, useEffect } from 'react';
import { View, Text, Image, ActivityIndicator, Pressable} from 'react-native';
import { getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { pickImage } from '../../components/imagepicker';
import styles from './styles'

export default function EditProfile() {
    const [user, setUser] = useState(null)
    const [displayName, setDisplayName] = useState(null)
    const [bio, setBio] = useState(null)
    const auth = getAuth()
    const navigation = useNavigation()

    async function getUser() {
      const exampleUserData = {
          profile_picture: "https://cdn.discordapp.com/attachments/803748247402184714/822541056436207657/kobe_b.PNG?ex=658f138d&is=657c9e8d&hm=37b45449720e87fa714d5a991c90f7fac4abb55f6de14f63253cdbf2da0dd7a4&",
          display_name: "Grant Hough",
          username: "@granthough",
          following_count: 128,
          follower_count: 259,
          bio: "A pretty funny guy. Has a strong affinity for dogs. \n Stefan Murphy: 'The test is in'"
      }


      const auth = getAuth()
      console.log(auth.currentUser.uid)
      const url = `https://backend-26ufgpn3sq-uc.a.run.app/api/user/id/${auth.currentUser.uid}`;
      console.log(url)
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const userData = await response.json();
      console.log('User Data:', userData);
   
      setUser(userData)
  }
 
    async function uploadToCDN(image) {
        const serverUrl = 'https://backend-26ufgpn3sq-uc.a.run.app/api/upload'; // Replace with your server's upload endpoint
        
        const formData = new FormData();
        formData.append('image', {
          uri: image.assets[0].uri,
          type: 'image/png', // Adjust the type based on the actual image type
          name: image.assets[0].fileName,
        });
    
        const response = await fetch(serverUrl, {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
    
        if (!response.ok) {
          throw new Error(`Failed to upload image. Status: ${response.status}`);
        }
    
        const responseData = await response.json();
        console.log('Upload successful. Server response:', responseData);
        return responseData
    }

    async function updateUserProfilePicture(profilePictureURL) {
        const serverUrl = 'https://backend-26ufgpn3sq-uc.a.run.app/api/user/update/profilepicture';
      
        const requestBody = {
          token: auth.currentUser.uid,
          profile_picture: profilePictureURL,
        };
      
        
        const response = await fetch(serverUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        });
    
        if (!response.ok) {
        throw new Error(`Failed to update profile picture. Status: ${response.status}`);
        }
    
        console.log('Profile picture update successful');
      }
    

    async function handleImageSelect(image) {
        console.log("Selected Image in CreatePing:", image);

        try {
            res = await uploadToCDN(image)
            console.log(res.url)
            await updateUserProfilePicture(res.url)
        } catch (error) {   
            console.error('Error uploading image:', error.message);
        }

        
      };

    
    useEffect(() => {
      getUser()

    }, []);

    
    if (!user) {
      return <ActivityIndicator />
    }

    return (
        <View style={styles.container}>
          <View style={{alignItems: "center", justifyContent: "space-around", flex: 0.2}}>
            <Image style={styles.pfp} source={{uri: user.profile_picture}}/>
            <Pressable onPress={() => pickImage(handleImageSelect)}>
              <Text style={{fontWeight: "bold", color: "white"}}>Edit Profile Picture</Text>
            </Pressable>
          </View>
            
          <View style={{alignContent: "flex-start", flex: 1, marginTop: 50}}>
            <View style={[styles.updateField, {borderTopWidth: 1}]}>
              <Text style={{color: "white", flex: 0.5}}>Username</Text>
              <Text style={{color: "white", flex: 1}}>@{user.username}</Text>
            </View>

            <Pressable onPress={() => navigation.navigate("EditField", {field: "Display Name", endpoint: "displayName", varName: "display_name"})} style={styles.updateField}>
              <Text style={{color: "white", flex: 0.5}}>Name</Text>
              <Text style={{color: "white", flex: 1}}>{user.display_name}</Text>
            </Pressable>

            <Pressable onPress={() => navigation.navigate("EditField", {field: "Bio", endpoint: "bio", varName: "bio"})} style={styles.updateField}>
              <Text style={{color: "white", flex: 0.5}}>Bio</Text>
              <Text style={{color: "white", flex: 1}}>{user.bio}</Text>
            </Pressable>
          </View>
        </View>
    )
}

