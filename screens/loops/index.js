import React, { useState, useRef, useEffect } from "react";
import { View, Image, Text, Animated, Dimensions, Pressable, TextInput, KeyboardAvoidingView, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import styles from "./styles";

export default function MutualsScreen({ route, navigation }) {
    function getLoops(type) {
        //handle getting discover/main feed

        const exampleLoopData = {
            pfp: "https://cdn.discordapp.com/avatars/393834794057728000/661f702722649b4aeb5a660c295d1ee3.webp?size=128",
            displayName: "Grant's Epic Group",
            members: 120,
            interests: ["Golfing", "Frolicking", "Hijinks"]
        }        

        return new Array(20).fill(exampleLoopData)
    }

    const loops = getLoops(route.params.get)
    
    const Loop = ({data}) => (
        <View style={{marginVertical: 20, width: "100%", flexDirection: "row", paddingHorizontal: 20}}>
            <Image style={{width: 100, height: 100, borderRadius: 50}} source={{uri: data.pfp}}/>
            <View style={{flex: 3, left: 20}}>
                <Text style={{color: "white", fontWeight: "bold"}}>{data.displayName}</Text>
                <Text style={{color: "white"}}>{data.members} Members</Text>
                <Text style={{color: "white"}}>{data.interests.join(", ")}</Text>
            </View>
        </View>
      );
    
      if (loops) {

        return (
            <SafeAreaView style={styles.container}>
                <FlatList 
                    data={loops}
                    renderItem={({item}) => <Loop data={item} />}
                    ItemSeparatorComponent={() => <View style={styles.item_seperator}/>}
                />
            </SafeAreaView>
        )
      }

}