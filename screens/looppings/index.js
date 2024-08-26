import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, RefreshControl, Image, Text, FlatList, Animated, ActivityIndicator, Pressable, ScrollView } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import { Ping } from '../../components/pings';
import { postComment, getLoopPings, getLoop } from "../../components/handlers";
import styles from "./styles";


export default function LoopPings({ loop, onScroll }) {
  const navigation = useNavigation()
  
  const [pings, setPings] = useState();

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
    await fetchPings()
    setRefreshing(false)
  }, []);




  async function fetchPings() {
    const fetchedPings = await getLoopPings(loop.loop_id)
    console.log("Fetched", fetchedPings.length, "pings. First entry:", fetchedPings[0])
    setPings(fetchedPings)
  }

  useEffect(() => {
    fetchPings()
  }, []);



  if (!pings) {
    return (
      <View style={{flex: 1, backgroundColor: "rgb(22, 23, 24)", justifyContent: "center", alignItems: "center"}}>
          <ActivityIndicator />
      </View>
    )
  }


  return (
    <View style={{flex: 1, backgroundColor: "rgb(22, 23, 24)"}}>
        {pings.length > 0 ? (
            <FlatList
              onScroll={onScroll}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={"white"}/>}
              style={{paddingHorizontal: 5}}
              data={pings}
              renderItem={({item}) => <Ping data={item} showLoop={false} />}
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
              <Text style={{color: "lightgrey", textAlign: "center", maxWidth: 270}}>Looks like nobody has posted any pings... Send one to this loop!</Text>
          </ScrollView>
        )}
        
        <Animated.View style={{opacity: pings.length > 0 ? fadeAnim : 1, width: 40, height: 40, borderRadius: 20, backgroundColor: "rgb(47, 139, 128)", position: "absolute", bottom: 40, right: 40, alignItems: "center", justifyContent: "center"}}>
            <Pressable onPress={() => navigation.navigate("Create", {loop: loop})}>
                <Ionicons size={35} color={"white"} name="add" />
            </Pressable>
        </Animated.View>
 
    </View>
  )
}
