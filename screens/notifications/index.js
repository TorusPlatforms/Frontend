import React, { useState, useRef, useEffect } from "react";
import { View, Image, Text, Animated, Dimensions, Pressable, TextInput, Modal, FlatList, Button, InputAccessoryView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons'; 

import styles from "./styles";

export default function NotificationsScreen() {
    const navigation = useNavigation()
    const [notifications, setNotifications] = useState([])
    function getNotifications() {
        //handle getting DMs

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

    const Notification = ({data}) => (
        <Pressable style={{marginVertical: 20, width: "100%", flexDirection: "row", paddingHorizontal: 20}}>
            <Image style={{width: 50, height: 50, borderRadius: 50,}} source={{uri: data.pfp}}/>
            <View style={{marginLeft: 20, maxWidth: "80%"}}>
                <Text>
                    <Text style={{color: "white", fontWeight: "bold"}}>{data.username}</Text>
                    <Text style={{color: "lightgrey"}}>{data.content}</Text>
                </Text>
            </View>
        </Pressable>
      );
        
    useEffect(() => {
        setNotifications(getNotifications())
      }, []);

    return (
        <View style={styles.container}>
            <Pressable onPress={() => navigation.navigate("FollowRequests")} style={{flexDirection: "row", paddingHorizontal: 20, marginVertical: 10, alignItems: 'center'}}>
                <Image style={{width: 50, height: 50, borderRadius: 50, flex: 1}} source={{uri: "https://cdn.discordapp.com/attachments/803748247402184714/822541056436207657/kobe_b.PNG?ex=658f138d&is=657c9e8d&hm=37b45449720e87fa714d5a991c90f7fac4abb55f6de14f63253cdbf2da0dd7a4&"}}/>
                <View style={{marginLeft: 20, maxWidth: "80%", flex: 2}}>
                    <Text style={{color: "white", fontWeight: "bold"}}>Follow Requests</Text>
                    <Text style={{color: "lightgrey"}}>granthough...</Text>
                </View>
                <View style={{flex: 3, alignItems: "flex-end"}}>
                    <Ionicons name="ios-arrow-forward-sharp" size={24} color="white" />
                </View>
            </Pressable>
        
            <View style={styles.item_seperator} />

            <FlatList
                data={notifications}
                renderItem={({item}) => <Notification data={item} />}
                ItemSeparatorComponent={() => <View style={styles.item_seperator}/>}
            />
        </View>
    )
}