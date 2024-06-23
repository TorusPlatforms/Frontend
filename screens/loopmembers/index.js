import React, { useState, useCallback, useEffect } from "react";
import { View, Image, Text, SafeAreaView, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl, Alert } from "react-native";

import { getLoopMembers, kickUser } from "../../components/handlers";
import styles from "./styles";

export default function LoopMembers({ route, navigation }) {
    const [members, setMembers] = useState([])
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
        <View style={{flexDirection: "row", justifyContent: "space-between", minHeight: 80, paddingVertical: 10}}>
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
        const members = await getLoopMembers(loop_id)
        setMembers(members)
    }


    useEffect(() => {
        fetchMembers()
    }, []);


    if (!members) {
        return <ActivityIndicator />
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList 
                data={members}
                renderItem={({item}) => <User data={item} />}
                ItemSeparatorComponent={() => <View style={styles.item_seperator}/>}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            />
        </SafeAreaView>
    )
}