import React, { useState, useRef, useEffect } from "react";
import { View, Image, Text, Animated, Dimensions, Pressable, TextInput, Modal, FlatList, Button, InputAccessoryView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons'; 

import styles from "./styles";

export default function NotificationsScreen() {
    const navigation = useNavigation()
    const [notifications, setNotifications] = useState([])
    const [followRequests, setFollowRequests] = useState([])
     //handle getting notifications
    function getNotifications() {
        const exampleNotif1 = {
            pfp: "https://cdn.discordapp.com/attachments/803748247402184714/822541056436207657/kobe_b.PNG?ex=658f138d&is=657c9e8d&hm=37b45449720e87fa714d5a991c90f7fac4abb55f6de14f63253cdbf2da0dd7a4&",
            username: "StefanMurphy",
            content: " mentioned you in a comment: @TanujKS the test is in",
            messageSent: "30m"
        }        

        const exampleNotif2 = {
            pfp: "https://cdn.discordapp.com/attachments/803748247402184714/822541056436207657/kobe_b.PNG?ex=658f138d&is=657c9e8d&hm=37b45449720e87fa714d5a991c90f7fac4abb55f6de14f63253cdbf2da0dd7a4&",
            username: "GrantHough",
            content: " liked your comment: @StefanMurphy haha good one",
            messageSent: "30m"
        }        

        return (new Array(5).fill(exampleNotif1)).concat(new Array(5).fill(exampleNotif2))
    }

    //handle getting follow requests
    function getFollowRequests() {
        return new Array(1).fill("granthough")
    }

    const Notification = ({data}) => (
        <Pressable style={styles.notificationContainer}>
            <Image style={styles.pfp} source={{uri: data.pfp}}/>
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
                    <Image style={styles.pfp} source={{uri: "https://cdn.discordapp.com/attachments/803748247402184714/822541056436207657/kobe_b.PNG?ex=658f138d&is=657c9e8d&hm=37b45449720e87fa714d5a991c90f7fac4abb55f6de14f63253cdbf2da0dd7a4&"}}/>
                    <View style={styles.followRequestText}>
                        <Text style={styles.text}>Follow Requests</Text>
                        <Text style={{color: "lightgrey"}}>{followRequests.join(', ')}</Text>
                    </View>
                    <View style={{flex: 3, alignItems: "flex-end"}}>
                        <Ionicons name="ios-arrow-forward-sharp" size={24} color="white" />
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