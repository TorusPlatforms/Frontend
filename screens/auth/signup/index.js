import React, { useState, useRef, useEffect } from "react";
import { View, Text, Dimensions, Pressable, TextInput, Platform, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAuth, createUserWithEmailAndPassword, deleteUser, onAuthStateChanged, updateProfile } from "firebase/auth"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { registerUserBackend } from "../../../components/handlers";

import styles from "../styles";



export default function SignUpScreen() {
    const navigation = useNavigation()

    const [username, onChangeUsername] = useState("")
    const [displayName, onChangeDisplayName] = useState("")
    const [email, onChangeEmail] = useState("")
    const [password, onChangePassword] = useState("")
    const [confirmPassword, onChangeConfirmPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState()

    
    class InputError extends Error {
        constructor(message) {
            super(message)
            this.name = "InputError"
        }
    }

    class PasswordsDontMatch extends InputError {
        constructor(message) {
            super("Passwords do not match.")
            this.name = "PasswordsDontMatch"
        }
    }

    async function signUp() {
        setErrorMessage("")
        const auth = getAuth()
    
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
        
        function isValidUsername(username) {
            const usernameRegex = /^[a-zA-Z0-9_]+$/; // Allows only letters, numbers, and underscores
            return usernameRegex.test(username);
        }
    
        try {
            if (password != confirmPassword) {
                throw new PasswordsDontMatch()
            }

            if (username.length < 4 || username.length > 25) {
                throw new InputError("Username must be between 4 and 25 characters")
            }

            if (displayName.length < 4 || displayName.length > 25) {
                throw new InputError("Display name must be between 4 and 25 characters long")
            }

            if ( password.length < 6) {
                throw new InputError("Password must be atleast 6 characters long")
            }

            if (!isValidUsername(username)) {
                throw new InputError("Username cannot contain special characters")
            }

            if (!isValidEmail(email)) {
                throw new InputError("Enter a valid email.")
            }


            await createUserWithEmailAndPassword(auth, email, password);
            console.log("Created in Firebase")
            const result = await registerUserBackend({username: username, email: email, display_name: displayName, expo_notification_id: expoPushToken})
            console.log("RESULT", JSON.stringify(result))
            if (result.success) {
                setErrorMessage(null)
                console.log("Successfully created user in Backend")
                navigation.replace("Verify Email")
            } else {
                throw new Error("Something went wrong! Please contact support.")
            }

        } catch (error) {
            console.warn(error)

            if (error instanceof InputError) {
                setErrorMessage(error.message)
            } else {
                console.log("HEREEe")
                alert(error.message)

                if (auth.currentUser) {
                    deleteUser(auth.currentUser)
                }
            }
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAwareScrollView contentContainerStyle={Platform.OS == "ios" ? {flex: 1} : {flexGrow: 1}} enableOnAndroid={true}>

                <View style={{flex: 1, justifyContent: "space-evenly", alignItems: "center"}}>
                    <Text style={{color: "white", fontSize: 16, textAlign: "center", maxWidth: 250}}>Sign up to become connected. Your campus, your community, & beyond</Text>

                    <TextInput 
                        onChangeText={input => onChangeUsername(input.trim())} 
                        placeholder="Username"
                        maxLength={25}
                        placeholderTextColor={"white"}
                        style={styles.submissionBox}
                    />

                    <TextInput 
                        onChangeText={input => onChangeDisplayName(input.trim())} 
                        placeholder="Display Name"
                        maxLength={25}
                        placeholderTextColor={"white"}
                        style={styles.submissionBox}
                    />


                    <TextInput 
                        onChangeText={input => onChangeEmail(input.trim())} 
                        placeholder="Email"
                        placeholderTextColor={"white"}
                        style={styles.submissionBox}
                    />
                    
                    <TextInput 
                        onChangeText={input => onChangePassword(input.trim())} 
                        placeholder="Password"
                        placeholderTextColor={"white"}
                        secureTextEntry={true}
                        textContentType={'oneTimeCode'}
                        style={styles.submissionBox}
                    />

                    <TextInput 
                        onChangeText={input => onChangeConfirmPassword(input.trim())} 
                        placeholder="Confirm Password"
                        placeholderTextColor={"white"}
                        secureTextEntry={true}
                        textContentType={'oneTimeCode'}
                        style={styles.submissionBox}
                    />

                    <Text style={{color: "red", fontSize: 16, textAlign: "center", maxWidth: 300}}>{errorMessage}</Text>
                </View>


                <View style={{ justifyContent: "center", alignItems: "center", flex: 0.4 }}>
                    <TouchableOpacity onPress={signUp} style={styles.submissionBox}>
                        <Text style={[{color: 'white', fontSize: 16, textAlign: "center"}]}>Sign Up</Text>
                    </TouchableOpacity>
                    {/* <Text>By signing up, you are agreeing to our Terms, Privacy, and Cookies policies</Text> */}
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}