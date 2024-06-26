import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, RefreshControl, Image, Text, FlatList, Animated, ActivityIndicator, Pressable } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import { Event } from "../../components/events";
import { getLoopEvents } from "../../components/handlers";
import styles from "./styles";


export default function LoopEvents({ route }) {
  const navigation = useNavigation()

  const loop = route.params.loop;
  const [events, setEvents] = useState([]);


  const [refreshing, setRefreshing] = useState(false)

  const fadeAnim = useRef(new Animated.Value(1)).current;



  const handleScrollEnd = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  };

  const handleScrollBegin = () => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };


  const onRefresh = useCallback(async() => {
    setRefreshing(true);
    await fetchEvents()
    setRefreshing(false)
  }, []);



  async function fetchEvents() {
    const events = await getLoopEvents(loop.loop_id)
    console.log(events)
    setEvents(events)
  }

  useEffect(() => {
    fetchEvents()
  }, []);



  if (!events) {
    return <ActivityIndicator />
  }


  return (
    <View style={{flex: 1, backgroundColor: "rgb(22, 23, 24)"}}>
        <FlatList
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            style={{paddingHorizontal: 5}}
            data={events}
            renderItem={
              ({item}) => 
                <Event data={item} navigation={navigation} />
            }
            ItemSeparatorComponent={() => <View style={styles.item_seperator}/>}
            onMomentumScrollBegin={handleScrollBegin}
            onMomentumScrollEnd={handleScrollEnd}
        />
        
        
        {loop.isOwner && (
          <Animated.View style={{opacity: fadeAnim, width: 50, height: 50, borderRadius: 25, backgroundColor: "rgb(47, 139, 128)", position: "absolute", bottom: 50, right: 25, alignItems: "center", justifyContent: "center"}}>
            <Pressable onPress={() => navigation.navigate("CreateEvent", {loop: loop})}>
                <Ionicons size={50} color={"white"} name="add" />
            </Pressable>
          </Animated.View>
        )}
        
    </View>
  )
}
