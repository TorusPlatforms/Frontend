import React from 'react'
import { StyleSheet, Text, View, SafeAreaView, Image } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';

import styles from "./styles";

const exampleData = {
    pfp: "https://cdn.discordapp.com/avatars/393834794057728000/661f702722649b4aeb5a660c295d1ee3.webp?size=128"
}
export default function Profile() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={{flexDirection: "row", alignSelf: "flex-end", marginRight: 30, marginTop: 10}}>
                <Ionicons name="ios-settings-outline" size={24} color="white" />
            </View>
            <Image style={{width: 150, height: 150, borderRadius: 75}} source={{uri: exampleData.pfp}}/>
            <Text style={{color: "white", marginTop: 10, fontSize: 25, fontWeight: "bold"}}>Grant Hough</Text>

            <View style={{alignItems: "flex-end", flexDirection: "col"}}>
                <View style={{width: 1, height: 50, backgroundColor: "gray", transform: [{rotate: '0deg'}]}}></View>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <View style={{width: 1, height: 50, backgroundColor: "gray", transform: [{rotate: '90deg'}]}}></View>
                    <Image
                    style={styles.torusLogo}
                    source={require('../../assets/torus.png')}
                    />
                    <View style={{width: 1, height: 50, backgroundColor: "gray", transform: [{rotate: '90deg'}]}}></View>
                </View>
            </View>
        </SafeAreaView>
    )
}