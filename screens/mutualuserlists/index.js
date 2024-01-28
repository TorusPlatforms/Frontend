import React, { useState, useRef, useEffect } from "react";
import { View, Image, Text, Pressable, SafeAreaView, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { getFollowings } from "../../components/handlers";
import styles from "./styles";

export default function MutualsScreen({ route, navigation }) {
    console.log(route.params, "boo")
    const [users, setUsers] = useState([])


    const User = ({data}) => (
        <View style={styles.userContainer}>
            <Image style={styles.pfp} source={{uri: data.pfp_url}}/>

            <View style={{flex: 3, left: 20}}>
                <Text style={[styles.text, {fontWeight: "bold"}]}>{data.display_name}</Text>
                <Text style={styles.text}>{data.username}</Text>
            </View>
{/* 
            <Pressable style={[styles.button, {backgroundColor: data.following ? "gray" : "rgb(65,105,225)"}]}>
                <Text style={[styles.text, {fontWeight: "bold"}]}>{data.following ? "Following" : "Follow"}</Text>
            </Pressable> */}
        </View>
      );
        

    async function fetchUsers() {
        const users = await getFollowings(route.params.username, route.params.get)
        setUsers(users)
    }

    useEffect(() => {
        fetchUsers()
    }, [route.params.get]);


    if (users) {

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