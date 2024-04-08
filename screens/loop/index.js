import React, { useState, useCallback, useEffect } from 'react';
import { View, TouchableOpacity, Image, Text, Animated, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';

import { getLoop, joinLoop } from "../../components/handlers";
import LoopPings from "../looppings";
import LoopEvents from "../loopevents";
import LoopAnnouncements from '../loopannouncements';

import styles from "./styles";

const Tab = createMaterialTopTabNavigator();


export default function LoopsPage({ route }) {
  const navigation = useNavigation()

  const { loop_id } = route.params

  const [loop, setLoop] = useState();


  async function fetchLoop() {
    const loop = await getLoop(loop_id)
    setLoop(loop)
  }

  async function handleJoinLoop() {
    await joinLoop(loop_id);
    navigation.navigate("Loop", {loop_id: loop_id})
  }

  useEffect(() => {
    fetchLoop()
  }, []);

  if (!loop) {
    return <ActivityIndicator />
  }


  return (
    <SafeAreaView style={{flex: 1, backgroundColor: "rgb(22, 23, 24)"}}>
        <View style={{paddingHorizontal: 20, flexDirection: "row", justifyContent: "space-between"}}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="white" />        
            </TouchableOpacity>

            <View style={{flexDirection: "row", justifyContent: "space-between", width: loop.isOwner ? 90 : 60}}>
              <TouchableOpacity onPress={() => navigation.navigate("LoopChat", {loop: loop})}>
                <Ionicons name="chatbubble-ellipses" size={24} color="white" />            
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate("LoopMembers", {loop_id: loop.loop_id})}>
                <Ionicons name="information-circle" size={24} color="white" />      
              </TouchableOpacity>
              
              {loop.isOwner && (
                <TouchableOpacity>
                    <Ionicons name="settings" size={24} color="white" />                    
                </TouchableOpacity>
              )}
             
            </View>
        </View>


        <View style={{marginBottom: 20, alignItems: "center"}}>
            {!loop.pfp_url && (
                <View>
                  <Image source={{uri: "https://fdlc.org/wp-content/uploads/2021/01/157-1578186_user-profile-default-image-png-clipart.png.jpeg"}}  style={{width: 150, height: 150, borderRadius: 75}} />
                </View>
            )}

            {loop.pfp_url && (
                <View>
                  <Image source={{uri: loop.pfp_url}}  style={{width: 150, height: 150, borderRadius: 75}} />
                </View>
            )}

            <Text style={{color: "white", fontSize: 24, marginTop: 10}}>{loop.name}</Text>
            <Text style={{color: "white", fontSize: 18, marginTop: 5}}>{loop.description}</Text>
        </View>
        

        <View style={{flex: 1}}>
          {loop.isJoined && (
              <Tab.Navigator screenOptions={{lazy: true, tabBarStyle: { backgroundColor: 'rgb(22, 23, 24)' }, tabBarLabelStyle: { color: "white", fontSize: 10 }}}>
                <Tab.Screen name="Pings" component={LoopPings} initialParams={{loop: loop}}/>
                <Tab.Screen name="Events" component={LoopEvents} initialParams={{loop: loop}} />
                <Tab.Screen name="Announcements" component={LoopAnnouncements} initialParams={{loop: loop}} />
              </Tab.Navigator>
          )}

          {!(loop.isJoined) && (
              <View style={{justifyContent: "center", alignItems: "center"}}>
                <TouchableOpacity onPress={handleJoinLoop} style={{backgroundColor: "yellow", padding: 20, paddingHorizontal: 50, borderRadius: 20}}>
                  <Text style={{color: "black"}}>Join</Text>
                </TouchableOpacity>
              </View>
          )}

        </View>

    </SafeAreaView>
  )
}
