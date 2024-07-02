import React, { useState, useRef, useEffect, useCallback } from "react";
import { View, Image, Text, Pressable, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons'; 

import { getJoinRequests, getNotifications } from "../../components/handlers/notifications";
import styles from "./styles";
import { RefreshControl } from "react-native-gesture-handler";

const torus_default_url = "https://cdn.torusplatform.com/5e17834c-989e-49a0-bbb6-0deae02ae5b5.jpg"


export default function NotificationsScreen() {
    const navigation = useNavigation()
    const [notifications, setNotifications] = useState([])
    const [joinRequests, setJoinRequests] = useState([])
    const [refreshing, setRefreshing] = useState(false)


    const onRefresh = useCallback(async() => {
        setRefreshing(true);
        await fetchNotifications()
        setRefreshing(false)
      }, []);
  
  
    function onNotificationsPress(data) {
        switch (data.type) {
            case "follow":
                navigation.navigate("UserProfile", {username: data.author})
                break
            case "message":
                navigation.navigate("Messages")
                break
            case "reply":
            case "like":
            case "comment":
                navigation.navigate("Ping", {post_id: data.parent_id})
                break
            case "announcement":
                navigation.push("Loop", {loop_id: data.parent_id, initialScreen: "Announcements"})
                break
            case "event":
                navigation.push("Loop", {loop_id: data.parent_id, initialScreen: "Events"})
                break
            }
    }

    const Notification = ({data}) => (
        <Pressable onPress={() => onNotificationsPress(data)} style={styles.notificationContainer}>
            <Image style={styles.pfp} source={{uri: data.pfp_url || torus_default_url}}/>
            <View style={{marginLeft: 20, maxWidth: "80%"}}>
                <Text>
                    <Text style={styles.text}>{data.author}</Text>
                    <Text style={{color: "lightgrey"}}>{" " + data.message}</Text>
                </Text>
            </View>
        </Pressable>
      );
    

    async function fetchNotifications() {
        const fetchedNotifications = (await getNotifications()).notifications
        console.log("Fetched", fetchedNotifications.length, "notifications. First entry:", fetchedNotifications[0])
        setNotifications(fetchedNotifications.filter(obj => obj.type !== 'join'))
    }

    async function fetchRequests() {
        const fetchedRequests = await getJoinRequests()
        console.log("Fetched", fetchedRequests.length, "requests. First entry:", fetchedRequests[0])
        const usernames = []

        fetchedRequests.forEach(request => {
            usernames.push(request.username)
        });

        setJoinRequests(usernames)
    }
    
    useEffect(() => {
        fetchNotifications()
        fetchRequests()
      }, []);


    return (
        <View style={styles.container}>
           {joinRequests.length > 0 && (
                <TouchableOpacity onPress={() => navigation.navigate("JoinRequests")} style={styles.followRequests}>
                    <View style={styles.followRequestText}>
                        <Text style={styles.text}>Join Requests</Text>
                        <Text style={{color: "lightgrey"}}>{joinRequests.slice(0, 2).join(', ')}...</Text>
                    </View>
                    <View style={{flex: 3, alignItems: "flex-end"}}>
                        <Ionicons name="arrow-forward-sharp" size={24} color="white" />
                    </View>
                </TouchableOpacity>
            )}
            
            <FlatList
                data={notifications}
                renderItem={({ item }) => (<Notification data={item} />)}
                ItemSeparatorComponent={<View style={styles.item_seperator}/>}
                refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={refreshing} tintColor={"white"} />}
                keyExtractor={item => item.notification_id}
            />
        </View>
    )
}