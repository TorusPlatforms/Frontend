import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, ActivityIndicator, Pressable, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from "@react-navigation/native";

import { pickImage } from '../../components/imagepicker';
import { getUser, uploadToCDN, updateUserProfilePicture } from "../../components/handlers";
import styles from './styles'

export default function EditProfile() {
    const [user, setUser] = useState(null)
    const [refreshing, setRefreshing] = useState(false)
    const navigation = useNavigation()


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

    const onRefresh = useCallback(async() => {
        setRefreshing(true);
        await fetchUser()
        setRefreshing(false)
      }, []);
    
    async function fetchUser() {
        const user = await getUser()
        setUser(user)
    }

    useEffect(() => {
      fetchUser()
    }, []);

    
    if (!user) {
      return <ActivityIndicator />
    }


    return (
        <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <View style={{alignItems: "center", justifyContent: "center", flex: 0.2}}>
            <Image style={styles.pfp} source={{uri: user.pfp_url}}/>
            <Pressable style={{marginTop: 5}} onPress={() => pickImage(handleImageSelect)}>
              <Text style={{fontWeight: "bold", color: "white"}}>Edit Profile Picture</Text>
            </Pressable>
          </View>
            
          <View style={{alignContent: "flex-start", flex: 1, marginTop: 20}}>
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
        </ScrollView>
    )
}

