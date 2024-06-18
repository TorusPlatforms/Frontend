import React, { useState, useCallback, useEffect } from "react";
import { View, Image, Text, SafeAreaView, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl, Pressable } from "react-native";
import { Ionicons } from '@expo/vector-icons'; 

import { getJoinRequests, approveRequest, rejectRequest } from "../../components/handlers/notifications";
import styles from "./styles";


export default function JoinRequests({ navigation }) {
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
                    <Pressable onPress={() => handleApprove(data)}>
                        {({pressed}) => (
                            <Ionicons name={"checkmark-circle"} size={32} color={pressed ? "gray" : "white"}/>
                        )}
                    </Pressable>

                    <Pressable onPress={() => handleReject(data)}>
                        {({pressed}) => (
                            <Ionicons name={"close-circle"} size={32} color={pressed ? "gray" : "white"}/>
                        )}
                    </Pressable>
                </View>
            </View>
        </TouchableOpacity>
      );
        
    async function fetchRequests() {
        const requests = await getJoinRequests()
        setRequests(requests)
    }

    useEffect(() => {
        fetchRequests()
    }, []);

    if (!requests) {
        return <ActivityIndicator />
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