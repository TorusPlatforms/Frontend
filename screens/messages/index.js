import React, { useState, useCallback, useEffect } from "react";
import { View, Image, Text, Animated, Dimensions, Pressable, TextInput, Modal, FlatList, RefreshControl, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";

import { getThreads } from "../../components/handlers";
import { findTimeAgo } from "../../components/utils";
import styles from "./styles";

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
        console.log("Refocused...")
        fetchThreads()
      }, [isFocused]);
      

    if (!DMs) {
        return (
            <View style={[styles.container, {justifyContent: "center", alignItems: "center"}]}>
                <ActivityIndicator />
            </View>
        )
    
    } else {

        return (
            <View style={styles.container}>
                <FlatList
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    data={DMs}
                    renderItem={({item}) => <DirectMessage data={item} />}
                    ItemSeparatorComponent={() => <View style={styles.item_seperator}/>}
                />
            </View>
        )
    }
}