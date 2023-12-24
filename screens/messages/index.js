import React, { useState, useRef, useEffect } from "react";
import { View, Image, Text, Animated, Dimensions, Pressable, TextInput, Modal, FlatList, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import styles from "./styles";

export default function Messages() {
    const navigation = useNavigation()
    const [DMs, setDMs] = useState([])
    function getDMs() {
        //handle getting DMs

        const exampleDMData = {
            pfp: "https://cdn.discordapp.com/attachments/803748247402184714/822541056436207657/kobe_b.PNG?ex=658f138d&is=657c9e8d&hm=37b45449720e87fa714d5a991c90f7fac4abb55f6de14f63253cdbf2da0dd7a4&",
            displayName: "StefanMurphy",
            lastMesssage: "you know grant? i hate him",
            messageSent: "30m"
        }        

        return new Array(20).fill(exampleDMData)
    }

    const DirectMessage = ({data}) => (
        <Pressable onPress={() => navigation.navigate("DirectMessage", {username: "@StefanMurphy"})} style={{marginVertical: 20, width: "100%", flexDirection: "row", paddingHorizontal: 20}}>
            <Image style={{width: 50, height: 50, borderRadius: 50,}} source={{uri: data.pfp}}/>
            <View style={{marginLeft: 20, justifyContent: "space-around"}}>
                <Text style={{color: "white", fontWeight: "bold"}}>{data.displayName}</Text>
                <View style={{flexDirection: "row",}}>
                    <Text style={{color: "lightgrey"}}>{data.lastMesssage}</Text>
                    <Text style={{color: "lightgrey", marginLeft: 10}}>•    {data.messageSent} Ago</Text>
                </View>
            </View>
        </Pressable>
      );
        
    useEffect(() => {
        setDMs(getDMs())
      }, []);

    return (
        <View style={styles.container}>
            <FlatList
                data={DMs}
                renderItem={({item}) => <DirectMessage data={item} />}
                ItemSeparatorComponent={() => <View style={styles.item_seperator}/>}
            />
        </View>
    )
}