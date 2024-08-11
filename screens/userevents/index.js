import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, RefreshControl, Image, Text, FlatList, Animated, ActivityIndicator, Pressable, TouchableOpacity, ScrollView } from "react-native";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';

import { Event } from "../../components/events";
import { getUserEvents } from "../../components/handlers";
import styles from "./styles";


export default function UserEvents() {
  const navigation = useNavigation()
  const [refreshing, setRefreshing] = useState()
  const [events, setEvents] = useState();

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
  }, [])


  if (!events) {
    return (
      <View style={{backgroundColor: "rgb(22, 23, 24)", flex: 1, justifyContent: "center", alignItems: "center"}}>
          <ActivityIndicator />
      </View>
    )
  }


  return (
    <View style={{flex: 1, backgroundColor: "rgb(22, 23, 24)"}}>
        {events.length > 0 ? 
          (
          <FlatList
            style={{paddingHorizontal: 20}}
            data={events}
            renderItem={
              ({item}) => <Event data={item} />}
            ItemSeparatorComponent={() => <View style={styles.item_seperator}/>}
            keyExtractor={(item) => item.event_id}
            refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={refreshing} tintColor={"white"} />}
        />
        ) : (
          <ScrollView refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={refreshing} tintColor={"white"} />}>
            <TouchableOpacity onPress={() => navigation.navigate("Discover")} style={{justifyContent: 'center', alignItems: 'center', marginTop: 50}}>
              <Text style={{color: "lightgrey", textAlign: "center", maxWidth: 270}}>Looks like you haven't joined any events... Discover some near you!</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        
    </View>
  )
}
