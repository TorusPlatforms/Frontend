import React, { useState, useRef, useEffect } from "react";
import { View, Image, Text, Animated, Dimensions, Pressable, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAuth, sendEmailVerification, onAuthStateChanged } from "firebase/auth";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import styles from "./styles";

export default function VerifyEmail() {    
    async function verification() {
        const auth = getAuth()
        try {
            await sendEmailVerification(auth.currentUser)
            console.log("Sent Verification")
        } catch(error) {
            alert(error.message)
        }
    }

    
    return (
        <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView contentContainerStyle={styles.container}>
                <View>
                    <Image style={{ height: 250, width: 250, resizeMode: "contain"}} source={require('../../../assets/torus.png')}></Image>
                </View>
                
    
                <View style={{alignItems: "center"}}>
                    <Text style={{color: "white", fontSize: 20}}>Verify Your Email!</Text>
                    <Text style={{ textAlign:'center', fontSize: 16, color: "white", paddingHorizontal: 50, marginVertical: 20}}>To verify you are from your institution, Torus requires you to verify your email. After you have verified your email, return to the login page and welcome to Torus!</Text>
                    
                    <TouchableOpacity onPress={verification} style={[styles.submissionBox, {padding: 20, width: 300}]}>
                        <Text style={{color: 'white', fontSize: 16, textAlign: "center"}}>Send Verification</Text>
                    </TouchableOpacity>
                </View>
        </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}