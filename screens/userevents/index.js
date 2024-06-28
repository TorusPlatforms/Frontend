import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, RefreshControl, Image, Text, FlatList, Animated, ActivityIndicator, Pressable } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useIsFocused, useNavigation } from '@react-navigation/native';

import { Event } from "../../components/events";
import { getUserEvents } from "../../components/handlers";
import styles from "./styles";


export default function UserEvents() {
  const navigation = useNavigation()

  const [events, setEvents] = useState([]);


  async function fetchEvents() {
    const events = await getUserEvents()
    console.log("Fetched", events.length, "user events. First entry:", events[0])
    setEvents(events)
  }

  const isFocused = useIsFocused()
  
  useEffect(() => {
    fetchEvents()
  }, [isFocused]);



  if (!events) {
    return (
      <View style={{backgroundColor: "rgb(22, 23, 24)", flex: 1, justifyContent: "center", alignItems: "center"}}>
          <ActivityIndicator />
      </View>
    )
  }


  return (
    <View style={{flex: 1, backgroundColor: "rgb(22, 23, 24)"}}>
        <FlatList
            style={{paddingHorizontal: 20}}
            data={events}
            renderItem={
              ({item}) => <Event data={item} navigation={navigation} 
            />}
            ItemSeparatorComponent={() => <View style={styles.item_seperator}/>}
            keyExtractor={(item) => item.event_id}
        />
    </View>
  )
}
