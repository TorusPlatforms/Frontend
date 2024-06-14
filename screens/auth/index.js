import React, { useState, useRef, useEffect } from "react";
import { View, Image, Text, Animated, Dimensions, Pressable, TextInput, KeyboardAvoidingView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

import styles from "./styles";

export default function AuthScreen() {
    const navigation = useNavigation()

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const moveLogoAnim = useRef(new Animated.Value(windowHeight / 2)).current
    const fadeAnim = useRef(new Animated.Value(0)).current 

    const [email, onChangeEmail] = useState("torustestuser@calpoly.edu")
    const [password, onChangePassword] = useState("abc123")

  
    const [expoPushToken, setExpoPushToken] = useState('');

    function handleRegistrationError(errorMessage) {
        alert(errorMessage);
        throw new Error(errorMessage);
    }
      
    async function registerForPushNotificationsAsync() {
        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
            });
        }
        
        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
            }
            if (finalStatus !== 'granted') {
            handleRegistrationError('Permission not granted to get push token for push notification!');
            return;
            }
            const projectId =
            Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
            if (!projectId) {
            handleRegistrationError('Project ID not found');
            }
            try {
                const pushTokenString = (
                    await Notifications.getExpoPushTokenAsync({
                    projectId,
                    })
                ).data;
                console.log(pushTokenString);
                return pushTokenString;
            } catch (e) {
                handleRegistrationError(`${e}`);
            }
        } else {
            handleRegistrationError('Must use physical device for push notifications');
        }
    }

   
    useEffect(() => {
        registerForPushNotificationsAsync()
          .then(token => setExpoPushToken(token ?? ''))
          .catch((error) => setExpoPushToken(`${error}`));
      }, []);

    useEffect(() => {
        Animated.sequence([
            Animated.timing(moveLogoAnim, {
                toValue: (windowHeight / 16) - 20,
                duration: 1000,
                useNativeDriver: true,
              }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true
            }),
        ])
       .start();
      }, [moveLogoAnim, fadeAnim]);
    
    

    const handlePress = (screenName) => {
        navigation.navigate(screenName);
    };

    async function login() {
        const auth = getAuth();
        await signInWithEmailAndPassword(auth, email, password)
        console.log("Logged in with user UID:", auth.currentUser.uid)
        navigation.navigate("Home")
    }

   
    return (
        <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView contentContainerStyle={styles.container}>
             <Animated.View style={[{transform: [{translateY: moveLogoAnim}]}, styles.animation]}>
                    <Image style={{width: windowWidth, height: windowHeight / 3, resizeMode: "contain"}} source={require('../../assets/torus.png')}></Image>
                </Animated.View>
                
            
            <Animated.View style={{
                opacity: fadeAnim,
                flex: 1
            }}>

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
                    <Pressable onPress={() => handlePress('Forgot Password')}>
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