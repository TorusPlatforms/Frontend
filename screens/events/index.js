
import React, { useState, useEffect } from "react";
import { View, Image, Text, Animated, Pressable, FlatList, SafeAreaView, RefreshControl, Platform, ActivityIndicator} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { SearchBar } from "react-native-elements";
import Ionicons from '@expo/vector-icons/Ionicons';

import { Event } from "../../components/events";
import { getEvents } from "../../components/handlers";
import styles from "./styles";


export default function Events() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
  const [scrollY] = useState(new Animated.Value(0));
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation(); 

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

  const createEvent = () => {
    navigation.navigate("CreateEvent");
  };

  useEffect(() => {
    if (events) {
      const filtered = events.filter((event) => event.name.toLowerCase().includes(search.toLowerCase()));
      setFilteredEvents(filtered);
    }
  }, [search, events]);

  const fetchEvents = async () => {
    try {
        const fetchedEvents = await getEvents()
        console.log("WOOF WOOF", fetchedEvents)
        setEvents(fetchedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);


  const onRefresh = async () => {
    await fetchEvents();
  };

  useFocusEffect(
    React.useCallback(() => {
      console.log("search focused");
      fetchEvents(); 
    }, [])
  );
    

  if (!events) {
    return <ActivityIndicator />
  } else {
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
            <Pressable onPress={createEvent}>
              <Ionicons name="add" size={24} color="white" />
            </Pressable>
          </View>
        </View>
      </Animated.View>

      <AnimatedFlatList
        style={{ paddingHorizontal: 20 }}
        data={filteredEvents}
        renderItem={({ item }) => <Event data={item}/>}
        ItemSeparatorComponent={() => <View style={styles.item_seperator} />}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await onRefresh();
              setRefreshing(false);
            }}
            tintColor="white"
          />
        }
      />
    </SafeAreaView>
  );
  }
};



/*const exampleLoopData = {
            pfp: "https://cdn.discordapp.com/attachments/803748247402184714/822541056436207657/kobe_b.PNG?ex=658f138d&is=657c9e8d&hm=37b45449720e87fa714d5a991c90f7fac4abb55f6de14f63253cdbf2da0dd7a4&",
            displayName: "Grant's Epic Group",
            members: 120,
            interests: ["Golfing", "Frolicking", "Hijinks"]
        }   */     

