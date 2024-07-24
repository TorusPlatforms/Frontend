import React, { useState, useCallback, useEffect } from "react";
import { View, Image, Text, Animated, Dimensions, Pressable, Modal, FlatList, RefreshControl, ActivityIndicator, Touchable } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';

import { useNavigation, useIsFocused, useFocusEffect } from "@react-navigation/native";

import { getThreads } from "../../components/handlers";
import { findTimeAgo } from "../../components/utils";
import styles from "./styles";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function Messages() {
    const navigation = useNavigation()
    const [DMs, setDMs] = useState([])
    const [refreshing, setRefreshing] = useState(false)
    const insets = useSafeAreaInsets()

    const DirectMessage = ({data}) => (
        <Pressable onPress={() => navigation.navigate("DirectMessage", {username: data.username})} style={{marginVertical: 20, flex: 1, width: "100%", flexDirection: "row", paddingHorizontal: 20, alignItems: "center", justifyContent: 'space-between'}}>
            <View style={{flex: 0.4, justifyContent: "center", alignItems: "center"}}>
                <Image style={{width: 50, height: 50, borderRadius: 50}} source={{uri: data.pfp_url}}/>
            </View>

            <View style={{marginLeft: 10, flexDirection: 'col', alignItems: "flex-start", flex: 1}}>
                <Text style={{color: "white", fontWeight: (data.unread ? "bold" : "600")}}>{data.username}</Text>
                <Text style={{color: "white", fontWeight: (data.unread ? "bold" : null)}}>{data.lastMessageObj.lastMessage.substring(0, 35)}...</Text>
            </View>

            <View style={{flex: 1, justifyContent: "flex-end", flexDirection: 'row', alignItems: "center"}}>
                {data.unread && (
                    <View style={{width: 10, height: 10, borderRadius: 5, backgroundColor: "rgb(208, 116, 127)"}}/>
                )}

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

        threads.sort((a, b) => {
            if (a.unread === true && b.unread !== true) {
                return -1;
            }
            if (a.unread !== true && b.unread === true) {
                return 1;
            }
            return 0;
        });
        
        setDMs(threads);
    }

    
    useFocusEffect(
        useCallback(() => {
          fetchThreads()
        }, [])
      );
    
      
    const header = () => (
        <View>
            <View style={{flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, alignItems: "center", paddingBottom: 20, marginTop: 10}}>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>

                        <Text style={{color: "white", fontSize: 18, fontWeight: "bold", marginLeft: 10}}>Direct Messages</Text>
                    </View>

                    <TouchableOpacity onPress={() => navigation.push("Search Users")}>
                        <Entypo name="new-message" size={24} color="white" />
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
        <SafeAreaView style={[styles.container, {paddingLeft: insets.left, paddingRight: insets.right}]}>
            <FlatList
                ListHeaderComponent={header}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={"white"} />}
                data={DMs}
                renderItem={({item}) => <DirectMessage data={item} />}
                ItemSeparatorComponent={() => <View style={styles.item_seperator}/>}
            />
        </SafeAreaView>
    )
}