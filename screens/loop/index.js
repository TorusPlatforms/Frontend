import React, { useState, useCallback, useEffect } from 'react';
import { View, TouchableOpacity, Image, Text, ScrollView, Alert, ActivityIndicator, RefreshControl, Pressable, Share } from "react-native";
import * as Linking from 'expo-linking';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useIsFocused, useNavigation } from '@react-navigation/native';

import { getLoop, getUser, joinLoop, leaveLoop } from "../../components/handlers";
import LoopPings from "../looppings";
import LoopEvents from "../loopevents";
import LoopAnnouncements from '../loopannouncements';
import LoopChat from '../loopchat';

import styles from "./styles"




export default function LoopsPage({ route }) {
  const navigation = useNavigation()
  const Tab = createMaterialTopTabNavigator();

  const { loop_id } = route.params

  const [loop, setLoop] = useState();
  const [user, setUser] = useState()

  async function fetchUser() {
    const fetchedUser = await getUser()
    setUser(fetchedUser)
  }

  async function fetchLoop() {
    const loop = await getLoop(loop_id)
    if (loop) {
      setLoop(loop)
    } else {
      navigation.goBack()
    }
  }

  async function handleJoinLoop() {
    await joinLoop(loop_id);
    navigation.replace("Loop", {loop_id: loop_id})
  }

  async function handleLeave() {
    Alert.alert(`Are you sure you want to leave ${loop.name}`, 'You will be able to rejoin or request to rejoin at any time.', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: async() => {
        console.log('OK Pressed')
        await leaveLoop(loop.loop_id)
        navigation.navigate("Community")
      }},
    ]);
  }

  async function handleShare() {
    const prefix = Linking.createURL('/');

    await Share.share({
      title: 'Someone invited you to checkout a Loop!',
      message: `Come join ${loop.name}!`, 
      url: prefix + "loop/" + loop.loop_id
     });
  }

  const isFocused = useIsFocused()

  useEffect(() => {
    fetchLoop()
    fetchUser()
  }, [isFocused]);


  if (!loop || !user) {
      return (
          <View style={{flex: 1, backgroundColor: "rgb(22, 23, 24)", justifyContent: "center", alignItems: "center"}}>
            <ActivityIndicator />
          </View>
      )
  }


  return (
    <SafeAreaView style={{flex: 1, backgroundColor: "rgb(22, 23, 24)"}}>
      <View style={{minHeight: 150 }}>
        <View style={{paddingHorizontal: 20, marginTop: 10, flexDirection: "row", justifyContent: "space-between"}}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="white" />        
            </TouchableOpacity>

            {loop.isJoined && (
                <View style={{flexDirection: "row", justifyContent: "space-between", width: 90}}>
                    <TouchableOpacity onPress={() => navigation.push("LoopChat", {loop: loop})}>
                      <Ionicons name="chatbubble-ellipses" size={24} color="white" />            
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.push("LoopMembers", {loop_id: loop.loop_id, isOwner: loop.isOwner, hasPendingRequests: loop.hasPendingRequests})}>

                      <Ionicons name="information-circle" size={24} color="white" />
                      { loop.hasPendingRequests && (
                        <View style={{backgroundColor: "red", width: 12, height: 12, borderRadius: 6, top: 0, right: 0, position: "absolute"}}/>
                      )}

                    </TouchableOpacity>

                    {!loop.isOwner && (
                        <TouchableOpacity onPress={handleLeave}>
                          <Ionicons name="exit" size={24} color="white" />      
                        </TouchableOpacity>
                    )}
                    
                    {loop.isOwner && (
                      <TouchableOpacity onPress={() => navigation.push("EditLoop", {loop_id: loop_id})}>
                          <Ionicons name="settings" size={24} color="white" />                    
                      </TouchableOpacity>
                    )}
                </View>
            )}
        </View>


        <View style={{ marginTop: 10, paddingHorizontal: 20 }}>
            <View style={{flexDirection: "row" }}>
                <Pressable style={{flex: 0.25}} onPress={handleShare}>
                  <Image source={{uri: loop.pfp_url}}  style={{width: 80, height: 80, borderRadius: 40 }} />
                  <Ionicons name="share" size={16} color="white" style={{position: "absolute", bottom: 10, right: 8}}/>
                </Pressable>
                
                <View style={{flex: 0.7, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                  <View>
                    <Text style={{color: "white", fontSize: 18, maxWidth: 150}}>{loop.name}</Text>
                    <Text style={{color: "white", fontSize: 12, marginTop: 5, fontStyle: "italic", maxWidth: 200}}>{loop.location}</Text>
                  </View>
                  
                  <View style={{flexDirection: "row"}}>
                    <Ionicons name="people" size={16} color="white"/>
                    <Text style={{color: "white", fontSize: 12, fontStyle: "italic", marginLeft: 5}}>{loop.member_count}</Text>
                  </View>
                </View>
            </View>

            <View style={{marginLeft: 10, marginTop: 5}}>
              <Text style={{color: "white", fontSize: 14, marginTop: 5 }}>{loop.description}</Text>

            </View>
            

        </View>
        
      </View>

      <View style={{flex: 2.2, marginTop: 20 }}>
        {loop.isJoined ? (
            <Tab.Navigator initialRouteName={route.params?.initialScreen} screenOptions={{lazy: true, tabBarStyle: { backgroundColor: 'rgb(22, 23, 24)' }, tabBarLabelStyle: { color: "white", fontSize: 10 }}}>
              <Tab.Screen name="Chat" component={LoopChat} initialParams={{loop: loop, fullScreen: false}} />
              <Tab.Screen name="Pings" component={LoopPings} initialParams={{loop: loop}}/>
              <Tab.Screen name="Events" component={LoopEvents} initialParams={{loop: loop}} />
            </Tab.Navigator>
        ) :
        (
        <View style={{paddingHorizontal: 40, flex: 1 }}>
            {!(loop.isJoined) && !(loop.joinPending) && (loop.location == user.college || loop.public) && (
                  <TouchableOpacity onPress={handleJoinLoop} style={[styles.joinButton, {backgroundColor: "rgb(250, 250, 50)"}]}>
                    <Text style={{color: "black", fontSize: 20}}>{(loop.public) ? "Join" : "Request to Join"}</Text>
                  </TouchableOpacity>
            )}

            {!(loop.isJoined) && (loop.joinPending) && (
                  <TouchableOpacity onPress={handleJoinLoop} style={[styles.joinButton, {backgroundColor: "rgb(62, 62, 62)"}]}>
                    <Text style={{color: "white", fontWeight: "bold", fontSize: 20}}>Request Pending</Text>
                  </TouchableOpacity>
            )}

            <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <Ionicons name={loop.public ? "lock-open" : "lock-closed"} size={64} color="white"/>
                <Text style={{color: "white", fontWeight: "bold", fontSize: 24, textAlign: "center", marginVertical: 15}}>This Loop is {loop.public ? "Public" : "Private"}</Text>
                <Text style={{color: "gray", fontSize: 16, textAlign: "center"}}>{loop.public ? "Join" : "Request to join"} to see announcements, pings, and events. If you are not a student at this campus, you might have to request to join even if it is public.</Text>
            </View>

        </View>
        )}
       
      </View>

    </SafeAreaView>
  )
}
