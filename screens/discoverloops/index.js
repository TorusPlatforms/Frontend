
import React, { useState, useEffect, useCallback } from "react";
import { View, Image, Text, Animated, Pressable, FlatList, SafeAreaView, RefreshControl, Keyboard, ActivityIndicator, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SearchBar } from "react-native-elements";
import Ionicons from '@expo/vector-icons/Ionicons';

import { getLoops } from "../../components/handlers";
import { Loop } from "../../components/loops";
import styles from "./styles";


export default function Loops() {
  const navigation = useNavigation(); 

  const [loops, setLoops] = useState([]);

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

  const goToLoop = (loop_id) => {
    navigation.push('Loop', { loop_id: loop_id });
  };



  const [search, setSearch] = useState(null);

  async function fetchLoops() {
      const fetchedLoops = await getLoops(search);
      setLoops(fetchedLoops);
      console.log("Fetched", fetchedLoops.length, "loops. First entry: ", fetchedLoops[0])
  };

  useEffect(() => {
    fetchLoops();
  }, [search]);




  const [refreshing, setRefreshing] = useState(false);

  async function onRefresh() {
    setRefreshing(true)
    await fetchLoops();
    setRefreshing(false)
  };
        
  

  if (!loops) {
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
          <View style={{ flex: 1 }}>
            <SearchBar
              placeholder={"Discover Loops"}
              containerStyle={{ backgroundColor: "rgb(22, 23, 24)", borderTopWidth: 0, borderBottomWidth: 0 }}
              onChangeText={setSearch}
              value={search}
            />
          </View> 

          <View style={{ flex: 0.1 }}>
            <TouchableOpacity onPress={() => navigation.navigate("CreateLoop")}>
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      <FlatList
        data={loops}
        renderItem={({ item }) => <Loop data={item} goToLoop={goToLoop} />}
        ItemSeparatorComponent={() => <View style={styles.item_seperator} />}
        onScroll={onScrollLoops}
        scrollEventThrottle={16}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="white" />}
        keyExtractor={(item) => item.loop_id}
        />
    </SafeAreaView>
  );
};

