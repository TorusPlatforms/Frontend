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

    const moveLogoAnim = useRef(new Animated.Value(windowHeight / 2)).current
    const fadeAnim = useRef(new Animated.Value(0)).current 

    const [email, onChangeEmail] = useState("tanujsiripurapu@gmail.com")
    const handlePress = (screenName) => {
    navigation.navigate(screenName);
  };

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
    
    
    async function verification() {
       
        await sendEmailVerification(email)
        console.log("Sent Verification")
        navigation.navigate("Home")

    }

    
    return (
        <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'position' : 'height'} style={styles.container}>
             <Animated.View style={[{transform: [{translateY: moveLogoAnim}]}, styles.animation]}>
                    <Image style={{width: windowWidth, height: windowHeight / 3, resizeMode: "contain"}} source={require('../../assets/torus.png')}></Image>
                </Animated.View>
                
            
            <Animated.View style={{
                opacity: fadeAnim,
                flex: 1
            }}>

                <View style={styles.loginContainer}>
                    <Text style={styles.text}>Forgot your Password?</Text>
                    <Text style={{ textAlign:'center',fontSize: 15, padding: 20, color: "white", marginTop: -25, marginBottom: 15 }}>Please enter the email address you would like a confirmation email to be sent to:</Text>

                    <TextInput 
                        onChangeText={onChangeEmail} 
                        value={email}
                        placeholder="Email"
                        placeholderTextColor={"white"}
                        style={[{width: windowWidth - 50}, styles.submissionBox]}
                    />
                
                 
                    
                    
                


                </View>

                    

            
                <View style={styles.welcomeBackContainer}>
                    <Pressable onPress={verification} style={[styles.submissionBox, styles.welcomeBack, {width: windowWidth - 50}]}>
                        {({pressed}) => 
                            <Text style={[{color: pressed ? 'gray' : 'white'}, {fontSize: 16}]}>Send Verification</Text>
                        }
                    </Pressable>

                
                </View>
            </Animated.View>

        </KeyboardAvoidingView>
        </SafeAreaView>
    )
}