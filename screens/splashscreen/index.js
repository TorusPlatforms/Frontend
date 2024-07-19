import React, { useState, useRef, useEffect } from "react";
import { View, Image, Text, Animated, Dimensions, TouchableOpacity, TextInput, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SplashScreen() {
    return (
        <SafeAreaView style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0d111a"}}>
            <Image style={{width: 425, height: 425, resizeMode: "cover"}} source={require('../../assets/torus_w_background.png')}></Image>
        </SafeAreaView>
    )
        
    
}