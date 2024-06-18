import React, { useState, useCallback, useEffect } from 'react';
import { View, TouchableOpacity, Image, Text, ScrollView, Alert, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';

import { getLoop, joinLoop, leaveLoop } from "../../components/handlers";
import LoopPings from "../looppings";
import LoopEvents from "../loopevents";
import LoopAnnouncements from '../loopannouncements';

import styles from "./styles";
import Scroll from '@birdwingo/react-native-swipe-modal/src/components/SwipeModal/scroll';

const Tab = createMaterialTopTabNavigator();

const torus_default_url = "https://cdn.torusplatform.com/5e17834c-989e-49a0-bbb6-0deae02ae5b5.jpg"


export default function LoopsPage({ route }) {
  const navigation = useNavigation()
  const [refreshing, setRefreshing] = useState(false)
  const { loop_id } = route.params

  const [loop, setLoop] = useState();


  async function fetchLoop() {
    const loop = await getLoop(loop_id)
    setLoop(loop)
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
      }},
    ]);
  }

  const onRefresh = useCallback(async() => {
      setRefreshing(true);
      await fetchLoop()
      setRefreshing(false)
  }, []);


  useEffect(() => {
    fetchLoop()
  }, []);

  if (!loop) {
    return <ActivityIndicator />
  }


  return (
    <SafeAreaView style={{flex: 1, backgroundColor: "rgb(22, 23, 24)"}}>
      <ScrollView style={{flex: 0.2}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={{paddingHorizontal: 20, flexDirection: "row", justifyContent: "space-between"}}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="white" />        
            </TouchableOpacity>

            {loop.isJoined && (
                <View style={{flexDirection: "row", justifyContent: "space-between", width: 90}}>
                    <TouchableOpacity onPress={() => navigation.push("LoopChat", {loop: loop})}>
                      <Ionicons name="chatbubble-ellipses" size={24} color="white" />            
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.push("LoopMembers", {loop_id: loop.loop_id, isOwner: loop.isOwner})}>
                      <Ionicons name="information-circle" size={24} color="white" />      
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


        <View style={{marginBottom: 20, alignItems: "center"}}>
            {!loop.pfp_url && (
                <View>
                  <Image source={{uri: torus_default_url}}  style={{width: 150, height: 150, borderRadius: 75}} />
                </View>
            )}

            {loop.pfp_url && (
                <View>
                  <Image source={{uri: loop.pfp_url}}  style={{width: 150, height: 150, borderRadius: 75}} />
                </View>
            )}

            <Text style={{color: "white", fontSize: 24, marginTop: 10}}>{loop.name}</Text>
            <Text style={{color: "white", fontSize: 14, marginTop: 5}}>{loop.description}</Text>
        </View>
        
      </ScrollView>

      <View style={{flex: 2}}>
        {loop.isJoined && (
            <Tab.Navigator screenOptions={{lazy: true, tabBarStyle: { backgroundColor: 'rgb(22, 23, 24)' }, tabBarLabelStyle: { color: "white", fontSize: 10 }}}>
              <Tab.Screen name="Pings" component={LoopPings} initialParams={{loop: loop}}/>
              <Tab.Screen name="Events" component={LoopEvents} initialParams={{loop: loop}} />
              <Tab.Screen name="Announcements" component={LoopAnnouncements} initialParams={{loop: loop}} />
            </Tab.Navigator>
        )}

        {!(loop.isJoined) && !(loop.joinPending) && (
            <View style={{justifyContent: "center", alignItems: "center"}}>
              <TouchableOpacity onPress={handleJoinLoop} style={{backgroundColor: "yellow", padding: 20, paddingHorizontal: 50, borderRadius: 20}}>
                <Text style={{color: "black"}}>{loop.public ? "Join" : "Request to Join"}</Text>
              </TouchableOpacity>
            </View>
        )}

        {!(loop.isJoined) && (loop.joinPending) && (
            <View style={{justifyContent: "center", alignItems: "center"}}>
              <TouchableOpacity onPress={handleJoinLoop} style={{backgroundColor: "gray", padding: 20, paddingHorizontal: 50, borderRadius: 20}}>
                <Text style={{color: "black"}}>Request Pending</Text>
              </TouchableOpacity>
            </View>
        )}
      </View>

    </SafeAreaView>
  )
}
