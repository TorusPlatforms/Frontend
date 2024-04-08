import React, { useState, useRef, useEffect } from "react";
import { View, Image, Text, SafeAreaView, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";

import { getLoopMembers } from "../../components/handlers";
import styles from "./styles";

export default function LoopMembers({ route, navigation }) {
    const [users, setUsers] = useState([])


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
        

    async function fetchMembers() {
        const users = await getLoopMembers(route.params.loop_id)
        setUsers(users)
    }


    useEffect(() => {
        fetchMembers()
    }, []);


    if (!users) {
        return <ActivityIndicator />

    } else {

        return (
            <SafeAreaView style={styles.container}>
                <FlatList 
                    data={users}
                    renderItem={({item}) => <User data={item} />}
                    ItemSeparatorComponent={() => <View style={styles.item_seperator}/>}
                />
            </SafeAreaView>
        )
    }
}