import React, { useState } from 'react';
import { View, Text, TextInput} from 'react-native';
import { getAuth } from "firebase/auth";

import { ImagePickerComponent } from '../../components/imagepicker';
import styles from './styles'

export default function EditProfile() {
    const [displayName, setDisplayName] = useState(null)
    const [bio, setBio] = useState(null)
    const auth = getAuth()

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

      
    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Enter Display Name"
                value={displayName}
                onChangeText={(text) => setDisplayName(text)}
                style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
            />

            <TextInput
                placeholder="Enter Bio"
                value={bio}
                onChangeText={(text) => setBio(text)}
                multiline
                numberOfLines={4}
                style={{ borderBottomWidth: 1, marginBottom: 10, padding: 8 }}
            />    

            <ImagePickerComponent handleImage={handleImageSelect} /> 
            
        </View>
    )
}

