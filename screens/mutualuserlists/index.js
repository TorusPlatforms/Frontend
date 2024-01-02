import React, { useState, useRef, useEffect } from "react";
import { View, Image, Text, Pressable, SafeAreaView, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";

import styles from "./styles";

export default function MutualsScreen({ route, navigation }) {
    const [users, setUsers] = useState([])


    function getUsers(type) {
        //handle getting following/followers
        const exampleUserData = {
            pfp: "https://cdn.discordapp.com/avatars/393834794057728000/661f702722649b4aeb5a660c295d1ee3.webp?size=128",
            displayName: "Grant Hough",
            username: "@granthough",
        }        

        switch(type) {
            case "following":
                exampleUserData["following"] = true;
                break;
            case "followers":
                exampleUserData["following"] = false;
                break;
        }

        console.log(exampleUserData)
        return new Array(20).fill(exampleUserData)
    }


    const User = ({data}) => (
        <View style={styles.userContainer}>
            <Image style={styles.pfp} source={{uri: data.pfp}}/>

            <View style={{flex: 3, left: 20}}>
                <Text style={[styles.text, {fontWeight: "bold"}]}>{data.displayName}</Text>
                <Text style={styles.text}>{data.username}</Text>
            </View>

            <Pressable style={[styles.button, {backgroundColor: data.following ? "gray" : "rgb(65,105,225)"}]}>
                <Text style={[styles.text, {fontWeight: "bold"}]}>{data.following ? "Following" : "Follow"}</Text>
            </Pressable>
        </View>
      );
        



    useEffect(() => {
        setUsers(getUsers(route.params.get))
    }, []);


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