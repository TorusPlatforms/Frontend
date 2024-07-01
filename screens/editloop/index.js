import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, ActivityIndicator, Pressable, ScrollView, RefreshControl, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { pickImage } from '../../components/imagepicker';
import { getLoop, uploadToCDN, updateLoop, deleteLoop } from "../../components/handlers";
import styles from './styles'

export default function EditLoop({ navigation, route }) {
    const { loop_id } = route.params
    const [loop, setLoop] = useState(null)
    const [image_url, setImageURL] = useState(null)
    const [refreshing, setRefreshing] = useState(false)

    const [membersAllowed, setMembersAllowed] = useState();
    const [isPrivate, setIsPrivate] = useState()

    async function toggleSwitch() {
      setMembersAllowed(previousState => !previousState)
      await updateLoop({ loop_id: loop.loop_id, endpoint: "allowMembersToCreateEvents", value: !loop.allowMembersToCreateEvents})
    }

    async function togglePrivate() {
      let alertMessage, alertSubtitle;
      if (!isPrivate) {
        alertMessage = "Are you sure you want to make this loop private?"
        alertSubtitle = "This means only verified members of your campus can see this loop, and you must approve all requests."
      } else {
        alertMessage = "Are you want you to make this loop public?"
        alertSubtitle = "This means all verified members of your campus can join, and everyone can request to join."
      }


      Alert.alert(alertMessage, alertSubtitle, [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: async() => {
          setIsPrivate(previousState => !previousState)
          await updateLoop({ loop_id: loop.loop_id, endpoint: "public", value: !loop.public})
          await fetchLoop()
          }
        },
      ]);

     
    }

    async function handleImageSelect(image) {
        console.log("Selected Image in EditLoop:", image);
        setRefreshing(true)

        try {
            res = await uploadToCDN(image)
            console.log(res.url)
            await updateLoop({loop_id: loop_id, endpoint: "pfp_url", value: res.url})
        } catch (error) {   
            console.error('Error uploading image:', error.message);
        } finally {
          setRefreshing(false)
        }

        
      };

    const onRefresh = useCallback(async() => {
        setRefreshing(true);
        await fetchLoop()
        setRefreshing(false)
      }, []);
    
    
    async function handleDelete() {
      Alert.alert("Are you sure you want to delete this Loop?", "This is a permanent action that cannot be undone.", [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: async() => {
            await deleteLoop(loop_id)
            navigation.navigate("Community")}
        },
      ]);
    }

    async function fetchLoop() {
      const loop = await getLoop(loop_id)
      setLoop(loop)
      setImageURL(loop.pfp_url)
      setMembersAllowed(loop.allowMembersToCreateEvents)
      setIsPrivate(!loop.public)
    }
    
    useEffect(() => {
      fetchLoop()
    }, [route.params]);

    
    if (!loop) {
      return (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgb(22, 23, 24)"}}>
          <ActivityIndicator />
        </View>
      )
    }

    return (
        <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <View style={{alignItems: "center", justifyContent: "center", flex: 0.2}}>

            <TouchableOpacity onPress={() => pickImage(handleImageSelect)} style={{width: 100, height: 100, borderRadius: 50, borderWidth: 2, justifyContent: 'center', alignItems: "center", borderStyle: 'dashed', borderColor: "gray"}}>
                {!image_url && (
                    <View style={{justifyContent: "center", alignItems: "center"}}>
                      <Ionicons name="camera" size={24} color="gray" />
                      <Text style={{color: "gray"}}>Upload</Text>
                    </View>
                )}

                {image_url && (
                    <View style={{justifyContent: "center", alignItems: "center"}}>
                      <Image style={styles.pfp} source={{uri: loop.pfp_url}}/>
                    </View>
                )}

                <Ionicons name="add-circle" size={32} color="rgb(47, 139, 128)" style={{position: "absolute", top: 0, right: 0}}/>
              </TouchableOpacity>
          </View>
            
          <View style={{alignContent: "flex-start", flex: 1, marginTop: 20}}>
            <Pressable onPress={() => navigation.navigate("EditField", {field: "Name", endpoint: "name", varName: "name", loop: loop, type: "loop"})} style={styles.updateField}>
              <Text style={{color: "white", flex: 0.5}}>Name</Text>
              <Text style={{color: "white", flex: 1}}>{loop.name}</Text>
            </Pressable>

            <Pressable onPress={() => navigation.navigate("EditField", {field: "Description", endpoint: "description", varName: "description", loop: loop, type: "loop", previousState: loop.description})} style={styles.updateField}>
              <Text style={{color: "white", flex: 0.5}}>Description</Text>
              <Text style={{color: "white", flex: 1}}>{loop.description}</Text>
            </Pressable>

            <TouchableOpacity onPress={handleDelete} style={styles.updateField}>
              <Text style={{color: "red", flex: 0.5}}>Delete Loop</Text>
            </TouchableOpacity>
          </View>

          <View style={{paddingHorizontal: 15}}>
              <View style={{ borderColor: "white", borderWidth: 1, padding: 15, flexDirection: "row", justifyContent: "space-between", borderRadius: 20, marginTop: 20}}>
                <Text style={{color: "white", width: 150}}>Allow all members to create events</Text>

                <Switch
                    trackColor={{true: 'rgb(47, 139, 128)'}}
                    onValueChange={toggleSwitch}
                    value={membersAllowed}
                    />
              </View>
          </View>

          <View style={{paddingHorizontal: 15}}>
              <View style={{ borderColor: "white", borderWidth: 1, padding: 15, flexDirection: "row", justifyContent: "space-between", borderRadius: 20, marginTop: 20}}>
                <View>
                  <Text style={{color: "white"}}>Private Loop</Text>
                  <Text style={{color: "gray", fontSize: 10, width: 200, marginTop: 2}}>When your Loop is private, members have to request to join and only you can approve their request.</Text>
                </View>
                
                <Switch
                    trackColor={{true: 'rgb(47, 139, 128)'}}
                    onValueChange={togglePrivate}
                    value={isPrivate}
                    />
              </View>
          </View>
        </ScrollView>
    )
}

