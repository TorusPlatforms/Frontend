import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, RefreshControl, Image, Text, FlatList, Animated, ActivityIndicator, Pressable } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import { Event } from "../../components/events";
import { getUserEvents } from "../../components/handlers";
import styles from "./styles";


export default function UserEvents() {
  const navigation = useNavigation()

  const [events, setEvents] = useState([]);


  const [refreshing, setRefreshing] = useState(false)


  const onRefresh = useCallback(async() => {
    setRefreshing(true);
    await fetchEvents()
    setRefreshing(false)
  }, []);



  async function fetchEvents() {
    const events = await getUserEvents()
    console.log("Fetched", events.length, "user events. First entry:", events[0])
    setEvents(events)
  }

  useEffect(() => {
    fetchEvents()
  }, []);



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
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
