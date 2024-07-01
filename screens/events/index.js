
import React, { useState, useEffect } from "react";
import { View, Image, Text, Animated, Pressable, FlatList, SafeAreaView, RefreshControl, Platform, ActivityIndicator, TouchableOpacity} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { SearchBar } from "react-native-elements";
import Ionicons from '@expo/vector-icons/Ionicons';

import { Event } from "../../components/events";
import { getEvents } from "../../components/handlers";
import styles from "./styles";


export default function Events() {
  const navigation = useNavigation(); 

  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState(null);


  const [scrollY] = useState(new Animated.Value(0));

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 70],
    outputRange: [70, 0],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 70],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });


  const [refreshing, setRefreshing] = useState(false);

  async function fetchEvents() {
      const fetchedEvents = await getEvents(search)
      console.log("Fetched", fetchedEvents.length, "events. First entry:", fetchedEvents[0])
      setEvents(fetchedEvents);
  };

  useEffect(() => {
    fetchEvents();
  }, [search]);


  async function onRefresh() {
    setRefreshing(true)
    await fetchEvents();
    setRefreshing(false)
  };



  const onScrollEvents = (
      Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: false }
      )
  )





  if (!events) {
    return (
      <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
        <ActivityIndicator />
      </View>
  )}

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={{ height: headerHeight, opacity: headerOpacity }}>
        <View style={{  padding: 10, flexDirection: 'row', flex: 1, justifyContent: "space-between", alignItems: "center" }}>
          <View style={{ flex: 1 }}>
            <SearchBar
              placeholder={"Discover Events"}
              containerStyle={{ backgroundColor: "rgb(22, 23, 24)", borderTopWidth: 0, borderBottomWidth: 0 }}
              onChangeText={setSearch}
              value={search}
            />
          </View> 

          <View style={{ flex: 0.1 }}>
            <TouchableOpacity onPress={() => navigation.navigate("CreateEvent")}>
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      <FlatList
        style={{ paddingHorizontal: 20 }}
        data={events}
        renderItem={({ item }) => <Event data={item} navigation={navigation}/>}
        ItemSeparatorComponent={() => <View style={styles.item_seperator} />}
        onScroll={onScrollEvents}
        scrollEventThrottle={16}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="white" />}
        keyExtractor={(item) => item.event_id}
      />
    </SafeAreaView>
  );
};



/*const exampleLoopData = {
            pfp: "https://cdn.discordapp.com/attachments/803748247402184714/822541056436207657/kobe_b.PNG?ex=658f138d&is=657c9e8d&hm=37b45449720e87fa714d5a991c90f7fac4abb55f6de14f63253cdbf2da0dd7a4&",
            displayName: "Grant's Epic Group",
            members: 120,
            interests: ["Golfing", "Frolicking", "Hijinks"]
        }   */     

