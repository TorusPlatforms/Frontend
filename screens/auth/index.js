import React, { useState, useRef, useEffect } from "react";
import { View, Image, Text, Animated, Dimensions, Pressable, TextInput, KeyboardAvoidingView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAuth, signInWithEmailAndPassword, sendEmailVerification, onAuthStateChanged } from "firebase/auth";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


import styles from "./styles";


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
            Animated.timing(moveLogoAnim, {
                toValue: (windowHeight / 16),
                duration: 1000,
                useNativeDriver: true,
            }).start(() => {
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    fadeAnim.current = 0
                    console.log("Logged in with user UID:", user.uid);

                    if (user.emailVerified) {
                        navigation.replace("Home");
                    } else {
                        navigation.navigate("Verify Email");
                    }
                } else {
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }).start()
                }
            });
        });
    }, [moveLogoAnim, fadeAnim]);


    async function login() {
        try {
            await signInWithEmailAndPassword(auth, email, password)
        } catch(error) {
            alert(error.message)
        } 
    }

    return (
        <SafeAreaView style={styles.container}>

        <KeyboardAwareScrollView contentContainerStyle={styles.container}>
                <Animated.View style={[{transform: [{translateY: moveLogoAnim}]}, styles.animation]}>
                    <Image style={{width: windowWidth, height: windowHeight / 3, resizeMode: "contain"}} source={require('../../assets/torus.png')}></Image>
                </Animated.View>
                
            
                <Animated.View style={{opacity: fadeAnim, flex: 1}}>
                    <View style={styles.loginContainer}>
                        <Text style={styles.text}>Login to Torus</Text>

                        <TextInput 
                            onChangeText={onChangeEmail} 
                            value={email}
                            placeholder="Email"
                            placeholderTextColor={"white"}
                            autoCapitalize="none"
                            style={styles.submissionBox}
                        />
                    
                        <TextInput 
                            onChangeText={onChangePassword} 
                            value={password}
                            secureTextEntry={true}
                            placeholder="Password"
                            placeholderTextColor={"white"}
                            style={styles.submissionBox}
                        />
                    </View>

                    <View style={{flex: 0.1, marginTop: 10}}>
                        <Pressable onPress={() => navigation.navigate('Forgot Password')}>
                            {({pressed}) => 
                                <Text style={{color: pressed ? 'gray' : 'white', marginLeft: 0}}>Forgot your password?</Text>    
                            }
                        </Pressable>
                    </View>

                
                    <View style={styles.welcomeBackContainer}>
                        <Pressable onPress={login} style={[styles.submissionBox, styles.welcomeBack, {width: windowWidth - 50}]}>
                            {({pressed}) => 
                                <Text style={[{color: pressed ? 'gray' : 'white'}, {fontSize: 16}]}>Welcome Back</Text>
                            }
                        </Pressable>

                        <View style={styles.signUpButton}>
                            <Text style={{color: "white"}}>Don't have an account?   </Text>
                            <Pressable onPress={() => navigation.navigate("SignUp")}>
                                {({pressed}) => 
                                    <Text style={{color: pressed ? 'gray' : 'white'}}>Sign Up</Text>
                                }
                            </Pressable>
                        </View>
                    </View>
                </Animated.View>


        </KeyboardAwareScrollView>
        </SafeAreaView>
    )
    
}