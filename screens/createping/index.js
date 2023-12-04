import React, { useState, useRef, useEffect } from "react";
import { View,TouchableOpacity, Image, Text, Animated, Dimensions, Pressable, TextInput, Modal, FlatList, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import styles from "./styles";

export default function CreatePing() {
    const navigation = useNavigation()

    return (
        
        <View style={{ flex: 1, paddingTop: 20, backgroundColor: "rgb(22, 23, 24)" }}>
        
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 10 }}>
          <Text style={{ fontSize: 16, color: "white", paddingLeft:10 }}>Cancel</Text>
        </TouchableOpacity>

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
          <Text style={{ paddingTop:20, fontWeight: "bold", fontSize: 30, color: "white" }}>New Ping</Text>
        </View>

      </View>
    )
}