import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, RefreshControl, Image, Text, FlatList, Animated, ActivityIndicator, Pressable } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import { Announcement } from "../../components/announcements";
import { getAnnouncements } from "../../components/handlers";
import styles from "./styles";


export default function LoopAnnouncements({ route }) {
  const navigation = useNavigation()

  const { loop_id, isOwner } = route.params;
  
  const [announcements, setAnnouncements] = useState();

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
    const fetchedAnnouncements = await getAnnouncements(loop_id)
    console.log("Fetched", fetchedAnnouncements.length, "announcements. First entry:", fetchedAnnouncements[0])
    setAnnouncements(fetchedAnnouncements)
  }

  useEffect(() => {
    fetchAnnouncements()
  }, []);



  if (!announcements) {
    return (
      <View style={{flex: 1, backgroundColor: "rgb(22, 23, 24)", justifyContent: "center", alignItems: "center"}}>
          <ActivityIndicator />
      </View>
    )
  }


  return (
    <View style={{flex: 1, backgroundColor: "rgb(22, 23, 24)"}}>
        <FlatList
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={"white"} />}
            style={{paddingHorizontal: 5}}
            data={announcements}
            renderItem={
              ({item}) => 
                <Announcement data={item} isOwner={isOwner}/>
            }
            ItemSeparatorComponent={() => <View style={styles.item_seperator}/>}
            onMomentumScrollBegin={handleScrollBegin}
            onMomentumScrollEnd={handleScrollEnd}
        />
        
        {isOwner && (
          <Animated.View style={{opacity: announcements.length > 0 ? fadeAnim : 1, width: 40, height: 40, borderRadius: 20, backgroundColor: "rgb(47, 139, 128)", position: "absolute", bottom: 60, right: 40, alignItems: "center", justifyContent: "center"}}>
              <Pressable onPress={() => navigation.navigate("CreateAnnouncement", {loop_id: loop_id})}>
                  <Ionicons size={30} color={"white"} name="add" />
              </Pressable>
          </Animated.View>
        )}
      
    </View>
  )
}
