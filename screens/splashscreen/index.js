import React, { useState, useRef, useEffect } from "react";
import { View, Image, Text, Animated, Dimensions, TouchableOpacity, TextInput, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SplashScreen() {
    return (
        <SafeAreaView style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgb(22, 23, 24)"}}>
            <Image style={{width: 250, height: 250, resizeMode: "cover"}} source={require('../../assets/torus.png')}></Image>
        </SafeAreaView>
    )
        
    
}