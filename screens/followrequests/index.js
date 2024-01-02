import React, { useState, useRef, useEffect } from "react";
import { View, Image, Text, Animated, Dimensions, Pressable, TextInput, Modal, FlatList, Button, InputAccessoryView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons'; 

import styles from "./styles";

export default function FollowRequests() {
    const navigation = useNavigation()
    const [requests, setRequests] = useState([])
    function getRequests() {
        //handle getting follow requests

        const exampleRequest = {
            pfp: "https://cdn.discordapp.com/attachments/803748247402184714/822541056436207657/kobe_b.PNG?ex=658f138d&is=657c9e8d&hm=37b45449720e87fa714d5a991c90f7fac4abb55f6de14f63253cdbf2da0dd7a4&",
            username: "StefanMurphy",
        }          

        return (new Array(1).fill(exampleRequest))
    }

    const Request = ({data}) => (
        <View style={{marginVertical: 20, width: "100%", flexDirection: "row", paddingHorizontal: 20, alignItems: "center", justifyContent: "space-between"}}>
            <View style={{flexDirection: "row", alignItems: "center"}}>
                <Image style={{width: 50, height: 50, borderRadius: 50,}} source={{uri: data.pfp}}/>
                <Text style={{color: "white", fontWeight: "bold", marginLeft: 20}}>{data.username}</Text>
            </View>

            <View style={{flexDirection: 'row'}}>
                <Pressable style={{backgroundColor: "rgb(0, 114, 160)", marginRight: 5, padding: 5, borderRadius: 10, width: 75}}>
                    <Text style={{color: "white", textAlign: "center"}}>Confirm</Text>
                </Pressable>

                <Pressable style={{backgroundColor: "gray", padding: 5, borderRadius: 10, width: 75}}>
                    <Text style={{color: "white", textAlign: "center"}}>Delete</Text>
                </Pressable>
            </View>
           
        </View>
      );
        
    useEffect(() => {
        setRequests(getRequests())
      }, []);

    return (
        <View style={styles.container}>
            <FlatList
                data={requests}
                renderItem={({item}) => <Request data={item} />}
                ItemSeparatorComponent={() => <View style={styles.item_seperator}/>}
            />
        </View>
    )
}