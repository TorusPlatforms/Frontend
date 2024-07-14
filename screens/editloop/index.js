import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, ActivityIndicator, Pressable, ScrollView, RefreshControl, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { pickImage } from '../../components/imagepicker';
import { getLoop, uploadToCDN, updateLoop, deleteLoop, leaveLoop, updateMember } from "../../components/handlers";
import styles from './styles'

export default function EditLoop({ navigation, route }) {
    const { loop_id } = route.params
    const [loop, setLoop] = useState(null)
    const [image_url, setImageURL] = useState(null)
    const [refreshing, setRefreshing] = useState(false)

    const [membersAllowed, setMembersAllowed] = useState();
    const [isPrivate, setIsPrivate] = useState()
    const [pingsMuted, setPingsMuted] = useState()
    const [chatMuted, setChatMuted] = useState()
    
    async function toggleSwitch() {
      const newAllowed = !membersAllowed
      setMembersAllowed(previousState => !previousState)
      await updateLoop({ loop_id: loop.loop_id, endpoint: "allowMembersToCreateEvents", value: newAllowed})
    }
    
    async function toggleChatMute() {
      const newChatMuted = !chatMuted
      setChatMuted(previousState => !previousState)
      await updateMember({ loop_id: loop.loop_id, endpoint: "chatMuted", value: newChatMuted})
    }

    async function togglePingsMuted() {
      const newPingMuted = !pingsMuted
      setPingsMuted(previousState => !previousState)
      await updateMember({ loop_id: loop.loop_id, endpoint: "pingsMuted", value: newPingMuted })
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
          const newPrivate = isPrivate
          setIsPrivate(previousState => !previousState)
          console.log("SETTING TO", newPrivate)
          await updateLoop({ loop_id: loop.loop_id, endpoint: "public", value: newPrivate})
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
    
    
    async function handleRedPress() {
        if (loop.isOwner) {
          handleDelete(loop.loop_id)
        } else {
          handleLeave(loop.loop_id)
        }
    }

    async function handleLeave(loop_id) {
      Alert.alert(`Are you sure you want to leave ${loop.name}`, 'You will be able to rejoin or request to rejoin at any time.', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: async() => {
          console.log('OK Pressed')
          await leaveLoop(loop_id)
          navigation.navigate("Community")
        }},
      ]);
    }
    
    async function handleDelete(loop_id) {
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
      const fetchedLoop = await getLoop(loop_id)
      setLoop(fetchedLoop)
      setImageURL(fetchedLoop.pfp_url)
      setMembersAllowed(fetchedLoop.allowMembersToCreateEvents)
      setIsPrivate(!fetchedLoop.public)
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
        <ScrollView contentContainerStyle={{paddingBottom: 250}} style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={"white"}/>}>
          <View style={{alignItems: "center", justifyContent: "center", flex: 0.2}}>

            <TouchableOpacity disabled={!loop.isOwner} onPress={() => pickImage(handleImageSelect)} style={{width: 100, height: 100, borderRadius: 50, borderWidth: 2, justifyContent: 'center', alignItems: "center", borderStyle: 'dashed', borderColor: "gray"}}>
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

                {loop.isOwner && (
                  <Ionicons name="add-circle" size={32} color="rgb(47, 139, 128)" style={{position: "absolute", top: 0, right: 0}}/>
                )}

              </TouchableOpacity>
          </View>
            
          <View style={{alignContent: "flex-start", flex: 1, marginTop: 20}}>
            <TouchableOpacity disabled={!loop.isOwner} onPress={() => navigation.push("EditField", {field: "Name", endpoint: "name", varName: "name", loop: loop, type: "loop", maxLength: 50})} style={styles.updateField}>
              <Text style={{color: loop.isOwner ? "white" : "gray", flex: 0.5}}>Name</Text>
              <Text style={{color: loop.isOwner ? "white" : "gray", flex: 1}}>{loop.name}</Text>
            </TouchableOpacity>

            <TouchableOpacity disabled={!loop.isOwner} onPress={() => navigation.push("EditField", {field: "Description", endpoint: "description", varName: "description", loop: loop, type: "loop", previousState: loop.description})} style={styles.updateField}>
              <Text style={{color: loop.isOwner ? "white" : "gray", flex: 0.5}}>Description</Text>
              <Text style={{color: loop.isOwner ? "white" : "gray", flex: 1}}>{loop.description}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleRedPress} style={styles.updateField}>
              <Text style={{color: "red", flex: 0.5}}>{loop.isOwner ? "Delete Loop" : "Leave Loop"}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.updateToggle}>
              <Text style={{color: "white", width: 150}}>Allow all members to create events</Text>

              <Switch
                  disabled={!loop.isOwner}
                  trackColor={{true: 'rgb(47, 139, 128)'}}
                  onValueChange={toggleSwitch}
                  value={membersAllowed}
                  />
          </View>

          <View style={styles.updateToggle}>
              <View>
                <Text style={{color: "white"}}>Private Loop</Text>
                <Text style={{color: "lightgray", fontSize: 10, width: 200, marginTop: 2}}>When a Loop is private, only students at your campus can see your loop. Members have to request to join and only the owner can approve their request.</Text>
              </View>
              
              <Switch
                  disabled={!loop.isOwner}
                  trackColor={{true: 'rgb(47, 139, 128)'}}
                  onValueChange={togglePrivate}
                  value={isPrivate}
                  />
          </View>

          <View style={styles.updateToggle}>
              <Text style={{color: "white"}}>Mute Pings</Text>
              
              <Switch
                  trackColor={{true: 'rgb(47, 139, 128)'}}
                  value={pingsMuted}
                  onValueChange={togglePingsMuted}
                  />
          </View>

          <View style={styles.updateToggle}>
              <Text style={{color: "white"}}>Mute Chat</Text>
              
              <Switch
                  trackColor={{true: 'rgb(47, 139, 128)'}}
                  value={chatMuted}
                  onValueChange={toggleChatMute}
                  />
          </View>
        </ScrollView>
    )
}

