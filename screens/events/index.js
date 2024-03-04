
import React, { useState, useEffect } from "react";
import { View, Image, Text, Animated, Pressable, FlatList, SafeAreaView, RefreshControl, Platform} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { SearchBar } from "react-native-elements";
import Ionicons from '@expo/vector-icons/Ionicons';

import { strfEventTime } from "../../components/utils";
import { getUser } from "../../components/handlers";
import styles from "./styles";

import * as Linking from 'expo-linking';

export default function Events({ route }) {
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
    console.log("craete event")
  };

  useEffect(() => {
    const filtered = events.filter((event) => event.name.toLowerCase().includes(search.toLowerCase()));
    setFilteredEvents(filtered);
  }, [search, events]);

  const fetchEvents = async () => {
    try {
      const user = await getUser();

      const exampleEvent = {
          image_url: "https://media.licdn.com/dms/image/D5603AQEMhty2VnnhvQ/profile-displayphoto-shrink_800_800/0/1696823082087?e=2147483647&v=beta&t=zupqVi5PIfDbl1Z3NXQ7YBPoFrRcWs5SmwcCnotuqf0",
          name: "National Grant Hate Convention",
          time: 1709546380,
          address: "14803 Granite Way, Saratoga CA, 95070",
          message: "This is the annual meeting of the people who hate grant. wow he really is a fat lazy piece of shit!",
          createdAt: 1709287180,
          pfp_url: "https://zerotoai.org/images/tanujpic.png",
          attendees_url: ["https://zerotoai.org/images/stefanpic.png", "https://zerotoai.org/images/weaselpic.png", "https://zerotoai.org/images/justinpic.png"]
        }
        
      const fetchedEvents = new Array(6).fill(exampleEvent)

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
    



  const Event = ({ data }) => {
    const [isJoined, setIsJoined] = useState(false)

    function openMaps() {
      Linking.openURL(`http://maps.google.com/?q=${data.address}`);
    }

    return (
        <View style={{ marginVertical: 20, width: "100%", flexDirection: "row", flex: 1 }}>
            <View style={{flex: 0.2, alignItems: "center"}}>
              <Image style={{ width: 50, height: 50, borderRadius: 25 }} source={{ uri: data.pfp_url || data?.pfp_url }} />
              <View style={{marginVertical: 12, width: 1, height: "70%", backgroundColor: "gray"}} />
              <View style={{alignItems: 'center'}}>
                <Image style={{ left: -8, width: 30, height: 30, borderRadius: 15, position: "absolute" }} source={{ uri: data.attendees_url[0] || data?.attendees_url[0] }} />
                <Image style={{ right: -8, width: 30, height: 30, borderRadius: 15, position: "absolute" }} source={{ uri: data.attendees_url[1] || data?.attendees_url[1] }} />
              </View>
            </View>

            <View style={{flex: 0.8, flexDirection: 'column'}}>
                <View style={{ justifyContent: "space-between", borderWidth: 2, borderColor: "gray", borderTopLeftRadius: 20, borderTopRightRadius: 20, borderBottomWidth: 0, padding: 20, height: 150}}>
                    <View>
                      <Text style={{ color: "white", fontWeight: "bold" }}>{data.name || data?.name}</Text>
                      <Text style={{ color: "white", fontSize: 12 }}>{strfEventTime(data.time) || data?.time}</Text>
                      <Pressable onPress={(openMaps)}>
                        <Text style={{ color: "white", textDecorationLine: "underline", fontSize: 12 }}>{data.address || data?.address}</Text>
                      </Pressable>
                    </View>

                    <View style={{marginTop: 15}}>
                      <Text style={{ color: "white" }}>{data.message || data?.message}</Text>
                    </View>
                </View>

                <Image style={{borderBottomLeftRadius: 20, borderBottomRightRadius: 20, width: "100%", height: 150, resizeMode: "cover"}} source={{ uri: data.image_url || data?.image_url }} />

                <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10}}>
                  <Text style={{color: "white", fontSize: 12}}> Stefan & 2 others are attending</Text>
                  <Pressable onPress={() => setIsJoined(!isJoined)} style={{borderRadius: 5, borderColor: "gray", borderWidth: 1, padding: 4, paddingHorizontal: 20, backgroundColor: isJoined ? "blue" : "rgb(22, 23, 24)"}}>
                    <Text style={{ color: "white" }}>{isJoined ? "Joined" : "Join"}</Text>
                  </Pressable>
                </View>
                {/* <View style={{marginBottom: 30, marginTop: 20}}>
                    {data.attendees_url.map((url, index) => (
                    <Image
                      key={index}
                      style={{ position: "absolute", left: index * 10 + 10, width: 30, height: 30, borderRadius: 15 }}
                      source={{ uri: url }}
                    />
                  ))} */}
            </View>

        </View>
    );
  }


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
            <Pressable onPress={() => createEvent()}>
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
};



/*const exampleLoopData = {
            pfp: "https://cdn.discordapp.com/attachments/803748247402184714/822541056436207657/kobe_b.PNG?ex=658f138d&is=657c9e8d&hm=37b45449720e87fa714d5a991c90f7fac4abb55f6de14f63253cdbf2da0dd7a4&",
            displayName: "Grant's Epic Group",
            members: 120,
            interests: ["Golfing", "Frolicking", "Hijinks"]
        }   */     

