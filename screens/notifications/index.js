import React, { useState, useRef, useEffect } from "react";
import { View, Image, Text, Animated, Dimensions, Pressable, TextInput, Modal, FlatList, Button, InputAccessoryView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons'; 

import { getNotifications } from "../../components/handlers/notifications";
import styles from "./styles";

const torus_default_url = "https://cdn.torusplatform.com/5e17834c-989e-49a0-bbb6-0deae02ae5b5.jpg"


export default function NotificationsScreen() {
    const navigation = useNavigation()
    const [notifications, setNotifications] = useState([])
    const [followRequests, setFollowRequests] = useState([])
     //handle getting notifications


    //handle getting follow requests
    function getFollowRequests() {
        return new Array(1).fill("granthough")
    }

    function onNotificationsPress(data) {
        console.log(data.type)
        switch (data.type) {
            case "comment":
                navigation.navigate("Profile", {scrollToPing: data.source_id})
                break
            case "announcement":
            case "event":
                navigation.navigate("Loop", {loop_id: data.source_id})
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
        setNotifications(fetchedNotifications)
    }
    useEffect(() => {
        fetchNotifications()
        setFollowRequests(getFollowRequests())
      }, []);

    return (
        <View style={styles.container}>
           {followRequests.length > 0 && (
                <Pressable onPress={() => navigation.navigate("Follow Requests")} style={styles.followRequests}>
                    <View style={styles.followRequestText}>
                        <Text style={styles.text}>Join Requests</Text>
                        <Text style={{color: "lightgrey"}}>{followRequests.join(', ')}</Text>
                    </View>
                    <View style={{flex: 3, alignItems: "flex-end"}}>
                        <Ionicons name="arrow-forward-sharp" size={24} color="white" />
                    </View>
                </Pressable>
            )}
            
            <View style={styles.item_seperator} />

            <FlatList
                data={notifications}
                renderItem={({item}) => <Notification data={item} />}
                ItemSeparatorComponent={() => <View style={styles.item_seperator}/>}
            />
        </View>
    )
}