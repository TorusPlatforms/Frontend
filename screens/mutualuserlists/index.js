import React, { useState, useCallback, useEffect } from "react";
import { View, Image, Text, SafeAreaView, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { getFollowings } from "../../components/handlers";
import styles from "./styles";


export default function MutualsScreen({ route, navigation }) {
    const [users, setUsers] = useState([])
    const [refreshing, setRefreshing] = useState(false)

    const onRefresh = useCallback(async() => {
        setRefreshing(true);
        await fetchUsers()
        setRefreshing(false)
      }, []);
    
    const User = ({data}) => (
        <TouchableOpacity onPress={() => navigation.push("UserProfile", {username: data.username})}>
            <View style={styles.userContainer}>
                <Image style={styles.pfp} source={{uri: data.pfp_url}}/>

                <View style={{flex: 3, left: 20}}>
                    <Text style={[styles.text, {fontWeight: "bold"}]}>{data.display_name}</Text>
                    <Text style={styles.text}>{data.username}</Text>
                </View>

            </View>
        </TouchableOpacity>
      );
        
    async function fetchUsers() {
        const users = await getFollowings(route.params.username, route.params.get)
        setUsers(users)
    }

    useEffect(() => {
        fetchUsers()
    }, []);

    if (!users) {
        return <ActivityIndicator />
    }
    
    return (
        <SafeAreaView style={styles.container}>
            <FlatList 
                data={users}
                renderItem={({item}) => <User data={item} />}
                ItemSeparatorComponent={() => <View style={styles.item_seperator}/>}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            />
        </SafeAreaView>
    )
}