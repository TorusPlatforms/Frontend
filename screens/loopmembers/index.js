import React, { useState, useCallback, useEffect } from "react";
import { View, Image, Text, SafeAreaView, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl, Alert } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import { getLoop, getLoopMembers, getUser, kickUser } from "../../components/handlers";
import styles from "./styles";


export default function LoopMembers({ route, navigation }) {
    const [members, setMembers] = useState([])
    const [loop, setLoop] = useState()
    const { loop_id } = route.params


    const [refreshing, setRefreshing] = useState(false)

    const onRefresh = useCallback(async() => {
        setRefreshing(true);
        await fetchMembers()
        setRefreshing(false)
      }, []);
    


    async function handleKick(username) {
        Alert.alert(`Are you sure you want kick ${username}`, 'They will be able to rejoin or request to rejoin this loop at any time', [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {text: 'OK', onPress: async() => {
                console.log('OK Pressed')
                await kickUser(loop_id, username)
                await fetchMembers()
            }
        },
          ]);
    }


    const User = ({ data }) => (
        <View style={{flexDirection: "row", justifyContent: "space-between", minHeight: 80, paddingVertical: 10 }}>
            <TouchableOpacity onPress={() => {navigation.goBack(); navigation.push("UserProfile", {username: data.username})}}>
                <View style={styles.userContainer}>
                    <Image style={styles.pfp} source={{uri: data.pfp_url}}/>

                    <View style={{left: 20, maxWidth: 150}}>
                        <Text style={[styles.text, {fontWeight: "bold"}]}>{data.display_name}</Text>
                        <Text style={styles.text}>{data.username}</Text>
                    </View>
                </View>
            </TouchableOpacity>

            { loop?.isOwner && (data.username != loop?.creator_username) && (
                <View style={{justifyContent: "center", marginRight: 30}}>
                    <TouchableOpacity onPress={() => handleKick(data.username)} style={{backgroundColor: "rgb(208, 116, 127)", padding: 10, borderRadius: 50, paddingHorizontal: 20}}>
                        <Text>Remove</Text>
                    </TouchableOpacity>
                </View>
            )}

            {(data.username == loop?.creator_username) && (
                <View style={{justifyContent: "center", marginRight: 30, alignItems: "center" }}>
                    <FontAwesome5 name="crown" size={18} color="white" />                
                </View>
            )}
        </View>
        
        
      );
        
    


    async function fetchMembers() {
        const fetchedMembers = await getLoopMembers(loop_id)
        console.log("Fetched", fetchedMembers.length, "members. First entry:", fetchedMembers[0])

        const fetchedLoop = await getLoop(loop_id)

        const index = fetchedMembers.findIndex(obj => obj.username === fetchedLoop.creator_username);

        if (index !== -1) {
            const [obj] = fetchedMembers.splice(index, 1);

            fetchedMembers.unshift(obj);
        }

        setMembers(fetchedMembers)
        setLoop(fetchedLoop)
    }


    useEffect(() => {
        fetchMembers()
    }, []);


    if (!members || !loop) {
        return (
            <View style={{justifyContent: "center", alignItems: "center", flex: 1, backgroundColor: "rgb(22, 23, 24)"}}>
                <ActivityIndicator />
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>

            {loop.hasPendingRequests && (
                <TouchableOpacity onPress={() => {navigation.goBack(); navigation.navigate("JoinRequests", {loop_id: loop_id})}} style={styles.followRequests}>
                    <View style={styles.followRequestText}>
                        <Text style={{color: "white", fontWeight: "bold"}}>Join Requests</Text>
                    </View>

                    <View style={{flex: 3, alignItems: "flex-end"}}>
                        <Ionicons name="arrow-forward-sharp" size={24} color="white" />
                    </View>
                </TouchableOpacity>
            )}

            <FlatList 
                data={members}
                renderItem={({item}) => <User data={item} />}
                ItemSeparatorComponent={() => <View style={styles.item_seperator}/>}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={"white"}/>}
                keyExtractor={item => item.username}
            />
        </SafeAreaView>
    )
}