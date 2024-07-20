
import React, { useState, useEffect, useCallback } from "react";
import { View, Animated, SafeAreaView, RefreshControl, FlatList, TouchableOpacity } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { SearchBar } from "react-native-elements";

import { getJoinedLoops } from "../../components/handlers";
import { Loop } from "../../components/loops";
import styles from "./styles";


export default function MyLoops() {
    const [loops, setLoops] = useState();
    const [search, setSearch] = useState("");
    const [filteredLoops, setFilteredLoops] = useState();

    const [refreshing, setRefreshing] = useState(false);


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


    useEffect(() => {
        if (search) {
            const filtered = loops.filter((loop) => loop.name.toLowerCase().includes(search.toLowerCase()));
            setFilteredLoops(filtered);
        }
    }, [search]);


    async function fetchLoops() {
        const fetchedLoops = await getJoinedLoops(); 
        console.log("Fetched", fetchedLoops.length, "loops. First entry: ", fetchedLoops[0])
        fetchedLoops.sort((a, b) => {
            if (a.isStarred === true && b.isStarred !== true) {
                return -1;
            }
            if (a.isStarred !== true && b.isStarred === true) {
                return 1;
            }

            if (a.hasUnreadAnnouncements === true && b.hasUnreadAnnouncements !== true) {
                return -1;
            }
            if (a.hasUnreadAnnouncements !== true && b.hasUnreadAnnouncements === true) {
                return 1;
            }

            if (a.hasUnreadMessages === true && b.hasUnreadMessages !== true) {
                return -1;
            }
            if (a.hasUnreadMessages !== true && b.hasUnreadMessages === true) {
                return 1;
            }
            return 0;
        })
        setLoops(fetchedLoops);
        setFilteredLoops(fetchedLoops)
    };

    useFocusEffect(
        useCallback(() => {
          fetchLoops()
        }, [])
      );

    
    const onScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: false }
    );
    
  
    async function onRefresh() {
        setRefreshing(true)
        await fetchLoops();
        setRefreshing(false)
    };

  
            
    return (
        <SafeAreaView style={styles.container}>
            <Animated.View style={{ height: headerHeight, opacity: headerOpacity }}>
                <View style={{  padding: 10, flexDirection: 'row', flex: 1, justifyContent: "space-between", alignItems: "center" }}>
                    <SearchBar
                    placeholder={"Search Your Loops"}
                    inputContainerStyle={{borderRadius: 40}}
                    containerStyle={{ backgroundColor: "rgb(22, 23, 24)", borderTopWidth: 0, borderBottomWidth: 0, flex: 1 }}
                    onChangeText={setSearch}
                    value={search}
                    />
                </View>

            </Animated.View>

            <FlatList
                data={filteredLoops}
                renderItem={({ item }) => <Loop data={item}/>}
                ItemSeparatorComponent={() => <View style={styles.item_seperator} />}
                onScroll={onScroll}
                scrollEventThrottle={16}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="white"/>}
            />
        </SafeAreaView>
    );
};
