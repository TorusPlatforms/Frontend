import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, RefreshControl, Image, Text, FlatList, Animated, ActivityIndicator, Pressable } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import { Announcement } from "../../components/announcements";
import { getAnnouncements } from "../../components/handlers";
import styles from "./styles";


export default function LoopAnnouncements({ route }) {
  const navigation = useNavigation()

  const { loop } = route.params;
  
  const [announcements, setAnnouncements] = useState([]);

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
    await fetchAnnouncements()
    setRefreshing(false)
  }, []);



  async function fetchAnnouncements() {
    const announcements = await getAnnouncements(loop.loop_id)
    console.log(announcements)
    setAnnouncements(announcements)
  }

  useEffect(() => {
    fetchAnnouncements()
  }, []);



  if (!announcements) {
    return <ActivityIndicator />
  }


  return (
    <View style={{flex: 1, backgroundColor: "rgb(22, 23, 24)"}}>
        <FlatList
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            style={{paddingHorizontal: 5}}
            data={announcements}
            renderItem={
              ({item}) => 
                <Announcement data={item} />
            }
            ItemSeparatorComponent={() => <View style={styles.item_seperator}/>}
            onMomentumScrollBegin={handleScrollBegin}
            onMomentumScrollEnd={handleScrollEnd}
        />
        
        {loop.isOwner && (
          <Animated.View style={{opacity: fadeAnim, width: 50, height: 50, borderRadius: 25, backgroundColor: "white", position: "absolute", bottom: 50, right: 25, alignItems: "center", justifyContent: "center"}}>
              <Pressable onPress={() => navigation.navigate("CreateAnnouncement", {loop: loop})}>
                  <Ionicons size={50} color={"gray"} name="add" />
              </Pressable>
          </Animated.View>
        )}
      
    </View>
  )
}
