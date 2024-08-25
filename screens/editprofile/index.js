import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, ActivityIndicator, Pressable, ScrollView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { deleteUser, getAuth, signOut } from 'firebase/auth';

import { pickImage } from '../../components/imagepicker';
import { getUser, uploadToCDN, updateUser, deleteUserBackend } from "../../components/handlers";
import styles from './styles'


export default function EditProfile() {
    const [user, setUser] = useState(null)
    const [image_url, setImageURL] = useState(null)
    const [refreshing, setRefreshing] = useState(false)
    const navigation = useNavigation()


    async function handleImageSelect(image) {
        console.log("Selected Image in CreatePing:", image);

        setRefreshing(true)

        try {
            res = await uploadToCDN(image)
            console.log(res.url)
            await updateUser("pfp_url", res.url)
            await fetchUser()
        } catch (error) {   
            console.error('Error uploading image:', error.message);
        } finally {
          setRefreshing(false)
        }
      };  
    
    async function deleteAccount() {
      Alert.alert("Are you sure you want to delete your account?", "This is a permanent action that cannot be undone. All your posts will be deleted as well.", [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Confirm', onPress: async() => 
          Alert.alert("Are you sure you want to delete your account?", "This is your final confirmation. This cannot be undone.", [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {text: 'Confirm', onPress: async() => {
              await deleteUserBackend();
              await logOut()
            }},
          ])
        },
      ]);
    }

    async function logOut() {
      const auth = getAuth()
      await signOut(auth)
    }

    const onRefresh = useCallback(async() => {
        setRefreshing(true);
        await fetchUser()
        setRefreshing(false)
      }, []);
    

    async function fetchUser() {
        const user = await getUser()
        setUser(user)
        setImageURL(user.pfp_url)
    }

    useEffect(() => {
      fetchUser()
    }, []);

    
    if (!user) {
      return (
        <View style={{flex: 1, backgroundColor: "rgb(22, 23, 24)", justifyContent: "center", alignItems: 'center'}}>
          <ActivityIndicator />
      </View>
      )}

    return (
        <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={"white"} />}>
          <View style={{alignItems: "center", justifyContent: "center", flex: 0.2}}>
            <Pressable onPress={() => pickImage(handleImageSelect, {allowsEditing: true})} style={{width: 100, height: 100, borderRadius: 50, borderWidth: 2, justifyContent: 'center', alignItems: "center", borderStyle: 'dashed', borderColor: "gray"}}>
                      {!image_url && (
                          <View style={{justifyContent: "center", alignItems: "center"}}>
                            <Ionicons name="camera" size={24} color="gray" />
                            <Text style={{color: "gray"}}>Upload</Text>
                          </View>
                      )}

                      {image_url && (
                          <View style={{justifyContent: "center", alignItems: "center"}}>
                            <Image style={styles.pfp} source={{uri: user.pfp_url}}/>
                          </View>
                      )}

                      <Ionicons name="add-circle" size={32} color="rgb(47, 139, 128)" style={{position: "absolute", top: 0, right: 0}}/>
                    </Pressable>
          </View>
            
          <View style={{alignContent: "flex-start", flex: 1, marginTop: 20}}>
            <View style={[styles.updateField, {borderTopWidth: 1}]}>
              <Text style={{color: "gray", flex: 0.5}}>Username</Text>
              <Text style={{color: "gray", flex: 1}}>@{user.username}</Text>
            </View>

            <View style={[styles.updateField]}>
              <Text style={{color: "gray", flex: 0.5}}>College</Text>
              <Text style={{color: "gray", flex: 1}}>{user.college}</Text>
            </View>

            <TouchableOpacity onPress={() => navigation.push("EditField", {field: "Display Name", endpoint: "display_name", user: user, type: "user", maxLength: 25})} style={styles.updateField}>
              <Text style={{color: "white", flex: 0.5}}>Name</Text>
              <Text style={{color: "white", flex: 1}}>{user.display_name}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.push("EditField", {field: "Bio", endpoint: "bio", user: user, type: "user", maxLength: 150})} style={styles.updateField}>
              <Text style={{color: "white", flex: 0.5}}>Bio</Text>
              <Text style={{color: "white", flex: 1}}>{user.bio}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={logOut} style={styles.updateField}>
              <Text style={{color: "red", flex: 0.5}}>Log Out</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={deleteAccount} style={styles.updateField}>
              <Text style={{color: "red", flex: 0.5}}>Delete Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
    )
}

