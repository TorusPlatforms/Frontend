import React, { useState, useRef, useEffect } from "react";
import { View, Image, Text, Animated, Dimensions, Pressable, TextInput, Modal, FlatList, Button, InputAccessoryView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons'; 

import styles from "./styles";
const torus_default_url = "https://cdn.torusplatform.com/5e17834c-989e-49a0-bbb6-0deae02ae5b5.jpg"

export default function NotificationsScreen() {
    const navigation = useNavigation()
    const [notifications, setNotifications] = useState([])
    const [followRequests, setFollowRequests] = useState([])
     //handle getting notifications
    function getNotifications() {
        const exampleNotif1 = {
            pfp_url: torus_default_url,
            username: "StefanMurphy",
            content: " mentioned you in a comment: @TanujKS the test is in",
            messageSent: "30m",
            type: "comment",
            id: 45
        }        

        const exampleNotif2 = {
            pfp_url: torus_default_url,
            username: "Awesome Club",
            content: " sent an announcement: @StefanMurphy haha good one",
            messageSent: "30m",
            type: "loop",
            id: 77

        }        

        return (new Array(5).fill(exampleNotif1)).concat(new Array(5).fill(exampleNotif2))
    }

    //handle getting follow requests
    function getFollowRequests() {
        return new Array(1).fill("granthough")
    }

    function onNotificationsPress(data) {
        console.log(data.type)
        switch (data.type) {
            case "comment":
                console.log("1111111111111")
                navigation.navigate("Profile", {scrollToPing: data.id})
                break
            case "loop":
                console.log("2222222222222")
                navigation.navigate("MyLoops", {scrollToLoop: data.id})
                break
            }
    }

    const Notification = ({data}) => (
        <Pressable onPress={() => onNotificationsPress(data)} style={styles.notificationContainer}>
            <Image style={styles.pfp} source={{uri: data.pfp_url}}/>
            <View style={{marginLeft: 20, maxWidth: "80%"}}>
                <Text>
                    <Text style={styles.text}>{data.username}</Text>
                    <Text style={{color: "lightgrey"}}>{data.content}</Text>
                </Text>
            </View>
        </Pressable>
      );
        
    useEffect(() => {
        setNotifications(getNotifications())
        setFollowRequests(getFollowRequests())
      }, []);

    return (
        <View style={styles.container}>
           {followRequests.length > 0 && (
                <Pressable onPress={() => navigation.navigate("Follow Requests")} style={styles.followRequests}>
                    <View style={styles.followRequestText}>
                        <Text style={styles.text}>Follow Requests</Text>
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