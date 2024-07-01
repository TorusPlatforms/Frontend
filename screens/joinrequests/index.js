import React, { useState, useCallback, useEffect } from "react";
import { View, Image, Text, SafeAreaView, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl, Pressable } from "react-native";
import { Ionicons } from '@expo/vector-icons'; 

import { getJoinRequests, approveRequest, rejectRequest } from "../../components/handlers/notifications";
import styles from "./styles";


export default function JoinRequests({ navigation, route }) {
    const [requests, setRequests] = useState([])
    const [refreshing, setRefreshing] = useState(false)

    const onRefresh = useCallback(async() => {
        setRefreshing(true);
        await fetchRequests()
        setRefreshing(false)
      }, []);
    
    async function handleApprove(data) {
        await approveRequest(data)
        await onRefresh()
    }

    async function handleReject(data) {
        await rejectRequest(data)
        await onRefresh()
    }

    const Request = ({data}) => (
        <TouchableOpacity onPress={() => navigation.push("UserProfile", {username: data.username})}>
            <View style={styles.userContainer}>
                <Image style={styles.pfp} source={{uri: data.pfp_url}}/>

                <View style={{paddingLeft: 20, height: 50, flex: 1}}>
                    <Text>
                        <Text style={[styles.text, {fontWeight: "bold"}]}>{data.username}</Text>
                        <Text style={[styles.text]}> has requested to join </Text>
                        <Text style={[styles.text, {fontWeight: "bold"}]}>{data.loop_name}</Text>
                    </Text>
                </View>
                
                <View style={{flex: 0.4, flexDirection: "row", justifyContent: "space-evenly"}}>
                    <TouchableOpacity onPress={() => handleApprove(data)}>
                        <Ionicons name={"checkmark-circle"} size={32} color={"rgb(47, 139, 128)"}/>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleReject(data)}>
                        <Ionicons name={"close-circle"} size={32} color={"rgb(208, 116, 127)"}/>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
      );
        
    async function fetchRequests() {
        const requests = await getJoinRequests(route.params?.loop_id)
        setRequests(requests)
    }

    useEffect(() => {
        fetchRequests()
    }, []);

    if (!requests) {
        return (
            <View style={{flex: 1, backgroundColor: "rgb(22, 23, 24)", justifyContent: "center", alignItems: "center"}}>
                <ActivityIndicator />
            </View>
        )
    }
    
    return (
        <SafeAreaView style={styles.container}>
            <FlatList 
                data={requests}
                renderItem={({item}) => <Request data={item} />}
                ItemSeparatorComponent={() => <View style={styles.item_seperator}/>}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            />
        </SafeAreaView>
    )
}