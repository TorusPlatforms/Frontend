
import React, { useState, useEffect, useRef } from "react";
import { View, Image, Text, Animated, Pressable, FlatList, SafeAreaView, RefreshControl } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { SearchBar } from "react-native-elements";
import Ionicons from '@expo/vector-icons/Ionicons';

import { getJoinedLoops, getUser } from "../../components/handlers";
import { Loop } from "../../components/loops";
import styles from "./styles";


export default function MyLoops({ route }) {
    const [loops, setLoops] = useState([]);
    const [search, setSearch] = useState("");
    const [filteredLoops, setFilteredLoops] = useState([]);
    const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
    const [scrollY] = useState(new Animated.Value(0));
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation(); 
    const loops_ref = useRef()

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


    const goToLoop = (loop_id) => {
        navigation.navigate('Loop', { loop_id: loop_id });
    };

    useEffect(() => {
        // Filter loops based on the search term
        const filtered = loops.filter((loop) => loop.name.toLowerCase().includes(search.toLowerCase()));
        setFilteredLoops(filtered);
    }, [search, loops]);


    
    function findIndexById(arr, id) {
        return arr.findIndex(obj => parseInt(obj.loop_id) === parseInt(id));
    }
  
    async function fetchLoops(loop_id) {
        const loops = await getJoinedLoops(1000); //temporary fix
        setLoops(loops);

        if (loop_id) {
            const index = findIndexById(loops, loop_id)
            console.log("INDEX", index)
            setTimeout(() => {
            if (loops_ref.current) {
                loops_ref.current.scrollToIndex({ index: index, animated: true });
            }
            }, 1000);
        }
    };


    const handleScrollToIndexFailed = (info) => {
        const wait = new Promise(resolve => setTimeout(resolve, 500));
        wait.then(() => {
            if (loops_ref.current) {
                loops_ref.current.scrollToIndex({ index: info.index, animated: true });
            }
        });
    };


    useEffect(() => {
        console.log(route.params)
        fetchLoops(route.params?.scrollToLoop);
    }, [route.params]);

    useFocusEffect(
        React.useCallback(() => {
        fetchLoops(); 
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
            <View style={{ flex: 1 }}>
                <SearchBar
                placeholder={"Search Your Loops"}
                containerStyle={{ backgroundColor: "rgb(22, 23, 24)", borderTopWidth: 0, borderBottomWidth: 0 }}
                onChangeText={setSearch}
                value={search}
                />
            </View> 
            </View>
        </Animated.View>

        <AnimatedFlatList
            style={{ paddingHorizontal: 20 }}
            onScrollToIndexFailed={handleScrollToIndexFailed}
            data={filteredLoops}
            ref={loops_ref}
            renderItem={({ item }) => <Loop data={item} goToLoop={goToLoop} />}
            ItemSeparatorComponent={() => <View style={styles.item_seperator} />}
            onScroll={onScroll}
            scrollEventThrottle={16}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="white"/>
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

