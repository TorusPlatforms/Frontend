import React, { useState, useRef, useEffect } from "react";
import { View, Image, Text, Animated, Dimensions, Pressable, TextInput, KeyboardAvoidingView, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import styles from "../styles";

const exampleUserData = {
    pfp: "https://cdn.discordapp.com/avatars/393834794057728000/661f702722649b4aeb5a660c295d1ee3.webp?size=128",
    displayName: "Grant Hough",
    username: "@granthough",
    following: true
}

const exampleUserDataArray = new Array(20).fill(exampleUserData)

export default function FollowingScreen() {
    const navigation = useNavigation()
    
    const User = ({data}) => (
        <View style={{marginVertical: 10, width: "100%", flexDirection: "row", paddingHorizontal: 20, flex: 1}}>
            <Image style={{width: 50, height: 50, borderRadius: 25}} source={{uri: data.pfp}}/>

            <View style={{flex: 3, left: 20}}>
                <Text style={{color: "white", fontWeight: "bold"}}>{data.displayName}</Text>
                <Text style={{color: "white"}}>{data.username}</Text>
            </View>

            <Pressable style={{backgroundColor: data.following ? "rgb(65,105,225)" : "gray", padding: 15, borderRadius: 20, flex: 1, justifyContent: "center", alignItems: "center"}}>
                <Text style={{color: 'white', fontWeight: "bold"}}>{data.following ? "Following" : "Follow"}</Text>
            </Pressable>
        </View>
      );
    

    return (
        <SafeAreaView style={styles.container}>

            <FlatList 
                data={exampleUserDataArray}
                renderItem={({item}) => <User data={item} />}
                ItemSeparatorComponent={() => <View style={styles.item_seperator}/>}
            />
        </SafeAreaView>
    )
}