import React, { useState, useRef, useEffect } from "react";
import { View, Image, Text, Animated, Dimensions, TouchableOpacity, TextInput, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAuth, signInWithEmailAndPassword, sendEmailVerification, onAuthStateChanged } from "firebase/auth";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import styles from "../styles";


export default function AuthScreen() {
    const navigation = useNavigation()

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const moveLogoAnim = useRef(new Animated.Value(windowHeight / 2)).current
    const fadeAnim = useRef(new Animated.Value(0)).current 

    const [email, onChangeEmail] = useState("")
    const [password, onChangePassword] = useState("")
    
    const auth = getAuth();

    useEffect(() => {
        const animation = Animated.timing(moveLogoAnim, {
            toValue: windowHeight / 16,
            duration: 1000,
            useNativeDriver: true,
        });

        animation.start(() => {
            onAuthStateChanged(auth, async (user) => {
                if (user && user.emailVerified) {
                    navigation.navigate('Home')
                } else {
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }).start();
                }
            })

        });

    }, []);


    async function login() {
        try {
            const user = await signInWithEmailAndPassword(auth, email, password)
            console.log(JSON.stringify(user))
            if (user.user.emailVerified) {
                navigation.replace("Home");
            } else {
                navigation.navigate("Verify Email");
            }

        } catch(error) {
            alert(error.message)
        } 
    }

    return (
        <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView contentContainerStyle={Platform.OS == "ios" ? (styles.container) : {flexGrow: 1}}>
                <Animated.View style={{transform: [{translateY: moveLogoAnim}], flex: 0.8, alignItems: "center"}}>
                    <Image style={{width: 250, height: 250, resizeMode: "cover"}} source={require('../../../assets/torus.png')}></Image>
                </Animated.View>
                
                <Animated.View style={{opacity: fadeAnim, flex: 1, justifyContent: "space-between"}}>
                    <View style={{flex: 0.5, alignItems: "center"}}>
                        <Text style={{color: "white", fontSize: 24 }}>Login to Torus</Text>

                        <TextInput 
                            onChangeText={text => onChangeEmail(text.trim())} 
                            placeholder="Email"
                            placeholderTextColor={"white"}
                            autoCapitalize="none"
                            style={styles.submissionBox}
                        />
                    
                        <TextInput 
                            onChangeText={text => onChangePassword(text.trim())} 
                            secureTextEntry={true}
                            placeholder="Password"
                            placeholderTextColor={"white"}
                            style={styles.submissionBox}
                        />

                        <TouchableOpacity style={{marginTop: 10, marginLeft: 45, alignSelf: "flex-start"}} onPress={() => navigation.navigate('Forgot Password')}>
                            <Text style={{color:'white'}}>Forgot your password?</Text>    
                        </TouchableOpacity>
                    </View>
                
                    <View style={{alignItems: "center", flex: 0.4}}>
                        <TouchableOpacity onPress={login} style={[styles.submissionBox, {alignItems: "center", width: 300, height: 60, justifyContent: "center"}]}>
                            <Text style={{color: 'white', fontSize: 16}}>Welcome Back</Text>
                        </TouchableOpacity>

                        <View style={{paddingVertical: 10, alignItems: "center", justifyContent: "center", flexDirection: "row"}}>
                            <Text style={{color: "white"}}>Don't have an account?   </Text>
                            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                                 <Text style={{color: 'white'}}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
                
        </KeyboardAwareScrollView>
        </SafeAreaView>
    )
    
}