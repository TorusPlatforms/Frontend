import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, RefreshControl, ScrollView, Text, FlatList, Animated, ActivityIndicator, Pressable } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import { Event } from "../../components/events";
import { getLoopEvents } from "../../components/handlers";
import styles from "./styles";


export default function LoopEvents({ route }) {
  const navigation = useNavigation()

  const { loop } = route.params;
  const [events, setEvents] = useState();

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
    const fetchedEvents = await getLoopEvents(loop.loop_id)
    console.log("Fetched", fetchedEvents.length, "events. First entry:", fetchedEvents[0])
    setEvents(fetchedEvents)
  }

  useEffect(() => {
    fetchEvents()
  }, [route.params]);



  if (!events) {
    return (
      <View style={{flex: 1, backgroundColor: "rgb(22, 23, 24)", justifyContent: "center", alignItems: "center"}}>
          <ActivityIndicator />
      </View>
    )
  }


  return (
    <View style={{flex: 1, backgroundColor: "rgb(22, 23, 24)"}}>
        {events.length > 0 ? (
          <FlatList
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={"white"}/>}
              style={{paddingHorizontal: 5}}
              data={events}
              renderItem={
                ({item}) => 
                  <Event data={item} showLoop={false}/>
              }
              ItemSeparatorComponent={() => <View style={styles.item_seperator}/>}
              onMomentumScrollBegin={handleScrollBegin}
              onMomentumScrollEnd={handleScrollEnd}
          />
        ) : (
          <ScrollView 
            contentContainerStyle={{justifyContent: 'center', alignItems: 'center', marginTop: 50}}   
            onMomentumScrollBegin={handleScrollBegin}
            onMomentumScrollEnd={handleScrollEnd}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={"white"}/>}
            >
              <Text style={{color: "lightgrey", textAlign: "center", maxWidth: 270}}>Looks like nobody has scheduled any events... Make one in this loop!</Text>
          </ScrollView>
        )}
      
        
        
        {(loop.isAdmin || loop.isOwner || loop.allowMembersToCreateEvents) && (
          <Animated.View style={{opacity: events.length > 0 ? fadeAnim : 1, width: 40, height: 40, borderRadius: 20, backgroundColor: "rgb(47, 139, 128)", position: "absolute", bottom: 40, right: 40, alignItems: "center", justifyContent: "center"}}>
            <Pressable onPress={() => navigation.navigate("CreateEvent", {loop: loop})}>
                <Ionicons size={35} color={"white"} name="add" />
            </Pressable>
          </Animated.View>
        )}
        
    </View>
  )
}
