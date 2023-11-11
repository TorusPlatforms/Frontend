import React, { useState, useRef, useEffect } from "react";
import { View, Image, Text, Animated, Dimensions, Pressable, TextInput, KeyboardAvoidingView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

import styles from "./styles";

export default function ForgotPasswordScreen() {
    const navigation = useNavigation()

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const [email, onChangeEmail] = useState("tanujsiripurapu@gmail.com")
    const [password, onChangePassword] = useState("abc123")
    
    
    async function resetPassword() {
        const auth = getAuth();
        sendPasswordResetEmail(auth, email)
        .then(() => {
            console.log("Email sent!")
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
    }

    
    return (
        <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'position' : 'height'} style={styles.container}>
             <View style={styles.animation}>
                <Image style={{width: windowWidth, height: windowHeight / 3, resizeMode: "contain"}} source={require('../../assets/torus.png')}></Image>
            </View>
                
            
            <View style={{flex: 1}}>

                <View style={styles.loginContainer}>
                    <Text style={styles.text}>Forgot your password?</Text>
                    <Text style={{color: 'white', padding: 20, textAlign: 'center'}}>Enter your email and we'll send you a link to reset your password if you have an account with us</Text>
                    <TextInput 
                        onChangeText={onChangeEmail} 
                        value={email}
                        placeholder="Email"
                        placeholderTextColor={"white"}
                        style={[{width: windowWidth - 50}, styles.submissionBox]}
                    />
                </View>

                    

            
                <View style={styles.verificationContainer}>
                    <Pressable onPress={resetPassword} style={[styles.submissionBox, styles.verification, {width: windowWidth - 50}]}>
                        {({pressed}) => 
                            <Text style={[{color: pressed ? 'gray' : 'white'}, {fontSize: 16}]}>Send Email Verification</Text>
                        }
                    </Pressable>
                </View>
            </View>

        </KeyboardAvoidingView>
        </SafeAreaView>
    )
}