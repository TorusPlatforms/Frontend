import React, { useState, useRef, useEffect } from "react";
import { View, Image, Text, Animated, Dimensions, Pressable, TextInput, KeyboardAvoidingView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAuth, sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";

import styles from "./styles";

export default function ResetPassword() {
    const navigation = useNavigation()

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

 


    const handlePress = (screenName) => {
    navigation.navigate(screenName);
  };

    
    
    
    async function changepassword() {
       
        await ChangePassword(email)
        console.log("Sent Verification")
        navigation.navigate("Home")

    }

    
    return (
        <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'position' : 'height'} style={styles.container}>
            
            
         

                <View style={styles.loginContainer}>
                    <Text style={styles.text}>Reset your password</Text>
                    <Text style={{ textAlign:'center',fontSize: 15, padding: 20, color: "white", marginTop: -25, marginBottom: 15 }}>Strong passwords include numbers, letters, and punctuation marks. Resetting your password will log out of all your active Torus sessions.</Text>

                    <TextInput 
                    
                        
                        placeholder="Enter your new password"
                        placeholderTextColor={"white"}
                        style={[{width: windowWidth - 50}, styles.submissionBox]}

                    />

<TextInput 
                        
                        placeholder="Re-enter your new password"
                        placeholderTextColor={"white"}
                        style={[{width: windowWidth - 50}, styles.submissionBox]}
                    />
                
                 
                    
                    
                


                </View>

                    

            
                <View style={styles.welcomeBackContainer}>
                    <Pressable onPress={changepassword} style={[styles.submissionBox, styles.welcomeBack, {width: windowWidth - 50}]}>
                        {({pressed}) => 
                            <Text style={[{color: pressed ? 'gray' : 'white'}, {fontSize: 16}]}>Reset Password</Text>
                        }
                    </Pressable>

                
                </View>
           

        </KeyboardAvoidingView>
        </SafeAreaView>
    )
}