import React, { useState, useCallback, useEffect } from "react";
import { View, Image, Text, SafeAreaView, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl, Alert } from "react-native";

import { getLoopMembers, kickUser } from "../../components/handlers";
import styles from "./styles";

export default function LoopMembers({ route, navigation }) {
    const [users, setUsers] = useState([])
    const { loop_id, isOwner } = route.params

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
        <View style={{flexDirection: "row", justifyContent: "space-between", height: 80}}>
            <TouchableOpacity onPress={() => navigation.push("UserProfile", {username: data.username})}>
                <View style={styles.userContainer}>
                    <Image style={styles.pfp} source={{uri: data.pfp_url}}/>

                    <View style={{left: 20}}>
                        <Text style={[styles.text, {fontWeight: "bold"}]}>{data.display_name}</Text>
                        <Text style={styles.text}>{data.username}</Text>
                    </View>
                </View>
            </TouchableOpacity>

            { isOwner && (
                <View style={{justifyContent: "center", marginRight: 30}}>
                    <TouchableOpacity onPress={async() => handleKick(data.username)} style={{backgroundColor: "red", padding: 10, borderRadius: 50, paddingHorizontal: 20}}>
                        <Text>Remove</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
        
        
      );
        

    async function fetchMembers() {
        const users = await getLoopMembers(loop_id)
        setUsers(users)
    }


    useEffect(() => {
        fetchMembers()
    }, []);


    if (!users) {
        return <ActivityIndicator />
    }

    const temp = new Array(3).fill({"bio": null, "birthdate": null, "college": "California Polytechnic State University, San Luis Obispo", "college_email": "torustestuser2@calpoly.edu", "created_at": "1712549821565", "display_name": "Tanuj Siripurapu", "email": null, "first_name": null, "follower_count": 1, "following_count": 1, "last_name": null, "location": null, "pfp_url": "https://cdn.torusplatform.com/beffa7ec-7c97-4028-a6bd-8282986a7aa1.jpg", "updated_at": "1712549821565", "username": "tanujks7"})
    return (
        <SafeAreaView style={styles.container}>
            <FlatList 
                data={temp}
                renderItem={({item}) => <User data={item} />}
                ItemSeparatorComponent={() => <View style={styles.item_seperator}/>}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            />
        </SafeAreaView>
    )
}