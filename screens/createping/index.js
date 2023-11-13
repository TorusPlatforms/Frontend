import React, { useState, useRef, useEffect } from "react";
import { View, Image, Text, Animated, Dimensions, Pressable, TextInput, Modal, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import styles from "./styles";

export default function CreatePing() {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={{color: "white", fontSize: 90}}>Hello World</Text>
        </SafeAreaView>
    )
}