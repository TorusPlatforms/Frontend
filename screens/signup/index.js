import React, { useState, useRef, useEffect } from "react";
import { View, Text, Dimensions, Pressable, TextInput, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAuth, createUserWithEmailAndPassword, deleteUser } from "firebase/auth"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

import { registerUserBackend } from "../../components/handlers";
import styles from "./styles";

export default function SignUpScreen() {
    const navigation = useNavigation()
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const [username, onChangeUsername] = useState("tanujks")
    const [displayName, onChangeDisplayName] = useState("Tanuj Siripurapu")
    const [email, onChangeEmail] = useState("tanujsiripurapu@gmail.com")
    const [password, onChangePassword] = useState("abc123")
    const [confirmPassword, onChangeConfirmPassword] = useState("abc123")


    //must check that pass and confirm pass are equal before sending
    //check that username doesnt exist

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
            setExpoPushToken("")
        }
    }

   
    useEffect(() => {
        registerForPushNotificationsAsync()
          .then(token => setExpoPushToken(token ?? ''))
          .catch((error) => setExpoPushToken(`${error}`));
      }, []);
      
    async function signUp() {
        const auth = getAuth()
        console.log("AUTH", auth)
        console.log(email, password)

        try {
            const user = await createUserWithEmailAndPassword(auth, email, password);
            console.log("Successfully created user in Firebase");
            console.log(user.user.uid)

            try {
                await registerUserBackend({username: username, email: user.user.email, display_name: displayName, expo_notification_id: expoPushToken})
                console.log("Successfully created user in Backend");
                navigation.navigate("Home");
            } catch (error) {
                console.error(error)
                alert("Backend: Username in use")
                deleteUser(auth.currentUser)
                console.log('DEleted user')
            }
          } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;        
            alert(errorMessage);
          }

    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAwareScrollView contentContainerStyle={{flex: 1, marginTop: 50}}>

                <View style={{flex: 1, justifyContent: "space-evenly"}}>
                    <Text style={{color: "white", fontSize: 16, textAlign: "center"}}>Sign up to become connected</Text>

                    <TextInput 
                        onChangeText={onChangeUsername} 
                        value={username}
                        placeholder="Username"
                        placeholderTextColor={"white"}
                        style={styles.input}
                    />

                    <TextInput 
                        onChangeText={onChangeDisplayName} 
                        value={displayName}
                        placeholder="Display Name"
                        placeholderTextColor={"white"}
                        style={styles.input}
                    />


                    <TextInput 
                        onChangeText={onChangeEmail} 
                        value={email}
                        placeholder="Email"
                        placeholderTextColor={"white"}
                        style={styles.input}
                    />
                    
                    <TextInput 
                        onChangeText={onChangePassword} 
                        value={password}
                        placeholder="Password"
                        placeholderTextColor={"white"}
                        secureTextEntry={true}
                        style={styles.input}
                    />

                    <TextInput 
                        onChangeText={onChangeConfirmPassword} 
                        value={confirmPassword}
                        placeholder="Confirm Password"
                        placeholderTextColor={"white"}
                        secureTextEntry={true}
                        style={styles.input}
                    />
                </View>


                <View style={styles.signUpContainer}>
                    <Pressable onPress={signUp} style={styles.input}>
                        {({pressed}) => 
                            <Text style={[{color: pressed ? 'gray' : 'white'}, {fontSize: 16, textAlign: "center"}]}>Sign Up</Text>
                        }
                    </Pressable>
                    <Text style={styles.policy}>By signing up, you are agreeing to our Terms, Privacy, and Cookies policies</Text>
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}