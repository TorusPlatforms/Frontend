import React, { useState, useRef, useEffect, useCallback } from "react";
import { View, Image, Text, Pressable, SectionList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons'; 
import * as Notifications from "expo-notifications"
import { getJoinRequests, getNotifications } from "../../components/handlers/notifications";
import { RefreshControl } from "react-native-gesture-handler";
import moment from "moment";
import { useLinkTo } from '@react-navigation/native';

import styles from "./styles";


const torus_default_url = "https://cdn.torusplatforms.com/torus_w_background.jpg"


export default function NotificationsScreen() {
    const navigation = useNavigation();
    const linkTo = useLinkTo();
    const [notifications, setNotifications] = useState([]);
    const [joinRequests, setJoinRequests] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchNotifications();
        setRefreshing(false);
    }, []);


    function onNotificationsPress(data) {
        linkTo("/" + data.url)
    }
    
    function handleAuthorPress(data) {  
        if (data?.extraData?.public) {
            //takes care of both public events and public pings
            navigation.push("Loop", { loop_id: data.parent_id })
        } else {
            navigation.push("UserProfile", { username: data.author })
        }
    }

    const Notification = ({ data }) => (
        <Pressable onPress={() => onNotificationsPress(data)} style={styles.notificationContainer}>
            <Image style={styles.pfp} source={{ uri: data.pfp_url || torus_default_url }} />
            <View style={{ marginLeft: 20, maxWidth: 250, flex: 1, flexDirection: 'row' }}>
                <Text style={[{ color: "lightgrey", maxWidth: 250, fontWeight: data.unread ? "600" : "400" }]}>
                    <Text style={{ color: 'white' }} onPress={() => handleAuthorPress(data)}>{data.author}</Text>
                    {" " + data.message}
                </Text>
            </View>
        </Pressable>
    );

    function groupNotificationsByDate(raw_notifications) {
        const today = moment().startOf('day');
        const yesterday = moment().subtract(1, 'days').startOf('day');
        const lastWeek = moment().subtract(7, 'days').startOf('day');

        const grouped = {
            'Today': [],
            'Yesterday': [],
            'Last 7 Days': [],
        };

        for (const index in raw_notifications) {
            if (index > 50) {
                break
            }
            
            const notification = raw_notifications[index]
            const notificationDate = moment(notification.created_at);

            if (notificationDate.isSame(today, 'day')) {
                grouped['Today'].push(notification);
            } else if (notificationDate.isSame(yesterday, 'day')) {
                grouped['Yesterday'].push(notification);
            } else if (notificationDate.isAfter(lastWeek)) {
                grouped['Last 7 Days'].push(notification);
            }
        }

        return Object.keys(grouped).map(key => ({
            title: key,
            data: grouped[key]
        }));
    }

    async function fetchNotifications() {
        const fetchedNotifications = (await getNotifications()).notifications;
        console.log("Fetched", fetchedNotifications.length, "notifications. First entry:", fetchedNotifications[0]);

        const groupedNotifications = groupNotificationsByDate(
            fetchedNotifications.filter(obj => obj.type !== 'join')
        )

        setNotifications(groupedNotifications)
    }

    async function fetchRequests() {
        const fetchedRequests = await getJoinRequests();
        console.log("Fetched", fetchedRequests.length, "requests. First entry:", fetchedRequests[0]);

        const usernames = fetchedRequests.map(request => request.username);
        setJoinRequests(usernames);
    }

    useEffect(() => {
        Notifications.setBadgeCountAsync(0);
        fetchNotifications();
        fetchRequests();
    }, []);


    if (!notifications) {
        return (
            <View style={{flex: 1, backgroundColor: 'rgb(22, 23, 24)', justifyContent: "center", alignItems: "center"}}>
                <ActivityIndicator />
            </View>
        )
    }
    return (
        <View style={styles.container}>
            {joinRequests.length > 0 && (
                <TouchableOpacity onPress={() => navigation.navigate("JoinRequests")} style={styles.followRequests}>
                    <View style={styles.followRequestText}>
                        <Text style={styles.text}>Join Requests</Text>
                        <Text style={{ color: "lightgrey" }}>{joinRequests.slice(0, 2).join(', ')}...</Text>
                    </View>
                    <View style={{ flex: 3, alignItems: "flex-end" }}>
                        <Ionicons name="arrow-forward-sharp" size={24} color="white" />
                    </View>
                </TouchableOpacity>
            )}

            <SectionList
                sections={notifications}
                renderItem={({ item }) => <Notification data={item} />}
                renderSectionHeader={({ section: { title } }) => (
                    <View style={{ padding: 10, paddingLeft: 20, backgroundColor: "rgb(22, 23, 24)" }}>
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>{title}</Text>
                    </View>
                )}
                initialNumToRender={50}
                ItemSeparatorComponent={() => <View style={styles.item_seperator} />}
                refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={refreshing} tintColor={"white"} />}
                keyExtractor={item => item.notification_id}
            />
        </View>
    );
}