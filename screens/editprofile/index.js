import React, { useState, useEffect } from 'react';
import { View, Text, Image, ActivityIndicator, Pressable} from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { pickImage } from '../../components/imagepicker';
import { getUser, uploadToCDN } from "../../components/utils";
import styles from './styles'

export default function EditProfile() {
    const [user, setUser] = useState(null)
    const [displayName, setDisplayName] = useState(null)
    const [bio, setBio] = useState(null)
    const navigation = useNavigation()
 
   

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
      async function fetchUser() {
        const user = await getUser()
        setUser(user)
      }
      
      fetchUser()

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

            <Pressable onPress={() => navigation.navigate("EditField", {field: "Display Name", "endpoint": "displayname", "varName": "display_name", "user": user})} style={styles.updateField}>
              <Text style={{color: "white", flex: 0.5}}>Name</Text>
              <Text style={{color: "white", flex: 1}}>{user.display_name}</Text>
            </Pressable>

            <Pressable onPress={() => navigation.navigate("EditField", {"field": "Bio", "endpoint": "bio", "varName": "bio", "user": user})} style={styles.updateField}>
              <Text style={{color: "white", flex: 0.5}}>Bio</Text>
              <Text style={{color: "white", flex: 1}}>{user.bio}</Text>
            </Pressable>
          </View>
        </View>
    )
}

