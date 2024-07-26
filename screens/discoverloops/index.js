
import React, { useState, useEffect, useCallback } from "react";
import { View, Image, Text, Animated, Pressable, FlatList, SafeAreaView, RefreshControl, Keyboard, ActivityIndicator, TouchableOpacity, SectionList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SearchBar } from "react-native-elements";

import { getLoops, getEvents } from "../../components/handlers";
import { searchUsers } from "../../components/handlers/search";
import { Loop } from "../../components/loops";
import { Event } from "../../components/events";
import styles from "./styles";


 
export default function Loops() {
  const navigation = useNavigation(); 

  const [sections, setSections] = useState()
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


  const onScrollLoops = (
    Animated.event(
      [{ nativeEvent: { contentOffset: { y: scrollY } } }],
      { useNativeDriver: false }
    ));
  


  const User = ({data}) => (
    <TouchableOpacity onPress={() => {navigation.push("UserProfile", {username: data.username})}}>
        <View style={{ marginVertical: 10, width: "100%", flexDirection: "row", paddingHorizontal: 20, flex: 1, alignItems: "center"}}>
            <Image style={{ width: 50, height: 50, borderRadius: 25}} source={{uri: data.pfp_url}}/>

            <View style={{flex: 3, left: 20}}>
                <Text style={{fontWeight: "bold", color: "white"}}>{data.display_name}</Text>
                <Text style={{color: "white"}}>{data.username}</Text>
            </View>

        </View>
    </TouchableOpacity>
  );
    
  

  async function fetchLoops() {
      const fetchedLoops = await getLoops(search);
      console.log("Fetched", fetchedLoops.length, "loops. First entry: ", fetchedLoops[0])
      return fetchedLoops
  };

  async function fetchEvents() {
      const fetchedEvents = await getEvents(search)
      console.log("Fetched", fetchedEvents.length, "events. First entry:", fetchedEvents[0])
      return fetchedEvents
  };

  function combineArrays(arr1, arr2) {
      let result = [];
      let i = 0, j = 0;

      while (i < arr1.length || j < arr2.length) {
          if (Math.random() < 0.5) {
              if (i < arr1.length) {
                  result.push(arr1[i]);
                  i++;
              } else {
                  result.push(arr2[j]);
                  j++;
              }
          } else {
              if (j < arr2.length) {
                  result.push(arr2[j]);
                  j++;
              } else {
                  result.push(arr1[i]);
                  i++;
              }
          }
      }

      return result;
  }

  async function fetchEventsAndLoops() {
      const loops = await fetchLoops()
      const events = await fetchEvents()

      const combined = combineArrays(loops, events)

      const newSections = [];

      if (search) {
        const users = await searchUsers(search, 6)
        newSections.push({ title: "Users", data: users });
      } 

      newSections.push({ title: "Loops & Events", data: combined });

      setSections(newSections);
  }


  useEffect(() => {
    fetchEventsAndLoops();
  }, [search]);



  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async() => {
    setRefreshing(true)
    await fetchEventsAndLoops();
    setRefreshing(false)
  }, [search]);
  

  if (!sections) {
    return (
      <View style={{flex: 1, backgroundColor: "rgb(22, 23, 24)", justifyContent: "center", alignItems: "center"}}>
        <ActivityIndicator />
      </View>
    )
  }



  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={{ height: headerHeight, opacity: headerOpacity }}>
        <View style={{  padding: 10, flexDirection: 'row', flex: 1, justifyContent: "space-between", alignItems: "center" }}>
            <SearchBar
              placeholder={"Search users, loops, & events..."}
              inputContainerStyle={{borderRadius: 40}}
              containerStyle={{ backgroundColor: "rgb(22, 23, 24)", borderTopWidth: 0, borderBottomWidth: 0, flex: 1 }}
              onChangeText={setSearch}
              value={search}
            />
        </View>
      </Animated.View>

      <SectionList
        sections={sections}
        renderItem={({ item, section }) => {
          if (section.title === "Users") {
            return <User data={item} />;
          } else {
            if (item.event_id) {
              return <Event data={item}/>
            } else if (item.loop_id) {
              return <Loop data={item}/>
            } else {
              throw new Error("Found item that is not a loop, event, or user")
            }
          }
        }}
        renderSectionHeader={({ section: { title } }) => (
          <View style={{padding: 10, paddingLeft: 20, backgroundColor: "rgb(22, 23, 24)"}}>
            <Text style={{color: 'white', fontWeight: "bold", fontSize: 18}}>{title}</Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.item_seperator} />}
        onScroll={onScrollLoops}
        scrollEventThrottle={16}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="white" />}
        keyExtractor={(item) => item.event_id ?? item.loop_id ?? item.username}
        />
    </SafeAreaView>
  );
};

