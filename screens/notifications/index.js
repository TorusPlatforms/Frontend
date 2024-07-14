import React, { useState, useRef, useEffect, useCallback } from "react";
import { View, Image, Text, Pressable, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons'; 
import * as Notifications from "expo-notifications"
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
            case "post":
                navigation.push("Ping", {post_id: data.source_id})
                break
            case "follow":
                navigation.push("UserProfile", {username: data.author})
                break
            case "message":
                navigation.navigate("Messages")
                break
            case "reply":
            case "mention":
            case "like":
            case "comment":
                navigation.push("Ping", {post_id: data.parent_id})
                break
            case "announcement":
            case "join_request":
                navigation.push("Loop", {loop_id: data.parent_id, initialScreen: "Announcements"})
                break
            case "event_join":
            case "event":
                navigation.push("Loop", {loop_id: data.parent_id, initialScreen: "Events"})
                break
            }
    }

  
      const Notification = ({ data }) => (
        <Pressable onPress={() => onNotificationsPress(data)} style={styles.notificationContainer}>
            <Pressable onPress={() => navigation.navigate("UserProfile", {username: data.author})}>
                <Image style={styles.pfp} source={{ uri: data.pfp_url || torus_default_url }} />
            </Pressable>

            <View style={{ marginLeft: 20, maxWidth: 250, flex: 1, flexDirection: 'row'}}>
                <Text style={[{color: "lightgrey", maxWidth: 250, fontWeight: data.unread ? "600" : "400"}]}>
                    <Text style={{color: 'white'}} onPress={() => navigation.navigate("UserProfile", {username: data.author})}>{data.author}</Text>
                    {" " + data.message}
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

        const usernames = fetchedRequests.map(request => request.username)
        setJoinRequests(usernames)
    }
    
    useEffect(() => {
        Notifications.setBadgeCountAsync(0)
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