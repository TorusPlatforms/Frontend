import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, ActivityIndicator, Pressable, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';

import { pickImage } from '../../components/imagepicker';
import { getUser, uploadToCDN, updateUser } from "../../components/handlers";
import styles from './styles'
import { renderNode } from 'react-native-elements/dist/helpers';

export default function EditProfile() {
    const [user, setUser] = useState(null)
    const [image_url, setImageURL] = useState(null)
    const [refreshing, setRefreshing] = useState(false)
    const navigation = useNavigation()


    async function handleImageSelect(image) {
        console.log("Selected Image in CreatePing:", image);

        try {
            res = await uploadToCDN(image)
            console.log(res.url)
            await updateUser("pfp_url", res.url)
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
        setImageURL(user.pfp_url)
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
            {/* {user.pfp_url && (
                <Image style={styles.pfp} source={{uri: user.pfp_url}}/>
            )}

            {!user.pfp_url && (
                <Pressable style={{height: 100, width: 100, borderRadius: 50, backgroundColor: "red"}}/>
            )}

            <Pressable style={{marginTop: 5}} onPress={() => pickImage(handleImageSelect)}>
              <Text style={{fontWeight: "bold", color: "white"}}>Edit Profile Picture</Text>
            </Pressable> */}


            <Pressable onPress={() => pickImage(handleImageSelect)} style={{width: 100, height: 100, borderRadius: 50, borderWidth: 2, justifyContent: 'center', alignItems: "center", borderStyle: 'dashed', borderColor: "gray"}}>
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

                      <Ionicons name="add-circle" size={32} color="blue" style={{position: "absolute", top: 0, right: 0}}/>
                    </Pressable>
          </View>
            
          <View style={{alignContent: "flex-start", flex: 1, marginTop: 20}}>
            <View style={[styles.updateField, {borderTopWidth: 1}]}>
              <Text style={{color: "white", flex: 0.5}}>Username</Text>
              <Text style={{color: "white", flex: 1}}>@{user.username}</Text>
            </View>

            <Pressable onPress={() => navigation.navigate("EditField", {field: "Display Name", endpoint: "display_name", user: user, type: "user"})} style={styles.updateField}>
              <Text style={{color: "white", flex: 0.5}}>Name</Text>
              <Text style={{color: "white", flex: 1}}>{user.display_name}</Text>
            </Pressable>

            <Pressable onPress={() => navigation.navigate("EditField", {field: "Bio", endpoint: "bio", user: user, type: "user"})} style={styles.updateField}>
              <Text style={{color: "white", flex: 0.5}}>Bio</Text>
              <Text style={{color: "white", flex: 1}}>{user.bio}</Text>
            </Pressable>
          </View>
        </ScrollView>
    )
}

