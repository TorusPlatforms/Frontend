import React, { useState, useCallback, useEffect } from "react";
import { View, Image, Text, Animated, Dimensions, Pressable, Modal, FlatList, RefreshControl, ActivityIndicator, Touchable } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";

import { getThreads } from "../../components/handlers";
import { findTimeAgo } from "../../components/utils";
import styles from "./styles";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function Messages() {
    const navigation = useNavigation()
    const [DMs, setDMs] = useState([])
    const [refreshing, setRefreshing] = useState(false)
    const isFocused = useIsFocused()

    const DirectMessage = ({data}) => (
        <Pressable onPress={() => navigation.navigate("DirectMessage", {username: data.username})} style={{marginVertical: 20, flex: 1, width: "100%", flexDirection: "row", paddingHorizontal: 20, alignItems: "center", justifyContent: 'space-between'}}>
            <View style={{flex: 0.4, justifyContent: "center", alignItems: "center"}}>
                <Image style={{width: 50, height: 50, borderRadius: 50}} source={{uri: data.pfp_url}}/>
            </View>
            <View style={{marginLeft: 10, flexDirection: 'col', alignItems: "flex-start", flex: 1}}>
                <Text style={{color: "white", fontWeight: "bold"}}>{data.username}</Text>
                <Text style={{color: "lightgrey"}}>{data.lastMessageObj.lastMessage}</Text>
            </View>
            <View style={{flex: 1, alignItems: "flex-end"}}>
                <Text style={{color: "lightgrey", marginLeft: 10}}>{findTimeAgo(data.lastMessageObj.created_at)}</Text>
            </View>
        </Pressable>
      );


    const onRefresh = useCallback(async() => {
        setRefreshing(true);
        await fetchThreads()
        setRefreshing(false)
    }, []);
  

    async function fetchThreads() {
        const threads = await getThreads();
        setDMs(threads);
    }


    useEffect(() => {
        console.log("Messages screen refocused...")
        fetchThreads()
      }, [isFocused]);
      
    const header = () => (
        <View>
            <View style={{flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, alignItems: "center", paddingBottom: 20, marginTop: 10}}>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                        <Text style={{color: "white", fontSize: 18, fontWeight: "bold", marginLeft: 10}}>Direct Messages</Text>
                    </View>

                    <TouchableOpacity onPress={() => navigation.push("SearchUsers")}>
                        <Ionicons name="search" size={24} color="white" />
                    </TouchableOpacity>
                </View>

            <View style={styles.item_seperator} />
        </View>
    )

    if (!DMs) {
        return (
            <View style={[styles.container, {justifyContent: "center", alignItems: "center"}]}>
                <ActivityIndicator />
            </View>
    )}
    

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                ListHeaderComponent={header}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                data={DMs}
                renderItem={({item}) => <DirectMessage data={item} />}
                ItemSeparatorComponent={() => <View style={styles.item_seperator}/>}
            />
        </SafeAreaView>
    )
}