import React, { useState, useRef, useEffect } from "react";
import { View, Image, Text, Animated, Dimensions, Pressable, TextInput, KeyboardAvoidingView, Keyboard } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import styles from "./styles";

export default function AuthScreen() {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const moveLogoAnim = useRef(new Animated.Value(windowHeight / 2)).current
    const fadeAnim = useRef(new Animated.Value(0)).current 
    const navigation = useNavigation()

    const [email, onChangeEmail] = useState()
    const [password, onChangePassword] = useState()

    useEffect(() => {
        Animated.sequence([
            Animated.timing(moveLogoAnim, {
                toValue: 200,
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

    console.log(moveLogoAnim)
    return (
        <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
             <Animated.View style={{
                    flex: 0.2,
                    translateY: moveLogoAnim,
                    justifyContent: "center",
                    alignItems: "center",
                    marginVertical: 40
                }}>
                    <Image style={{width: windowWidth, height: windowHeight / 3, resizeMode: "contain"}} source={require('../../assets/torus.png')}></Image>
                </Animated.View>
                
            
            <Animated.View style={{
                opacity: fadeAnim,
                flex: 1
            }}>

                <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                    <Text style={{color: "white", fontSize: 24, margin: 20}}>Login to Torus</Text>

                    <TextInput 
                        onChangeText={onChangeEmail} 
                        value={email}
                        placeholder="Email"
                        placeholderTextColor={"white"}
                        style={{borderRadius: 10, borderColor: "white", borderWidth: 1, width: windowWidth - 50, marginBottom: 15, color: "white", padding: 10, fontSize: 16}}
                    />
                
                     <TextInput 
                        onChangeText={onChangePassword} 
                        value={password}
                        placeholder="Password"
                        placeholderTextColor={"white"}
                        style={{borderRadius: 10, borderColor: "white", borderWidth: 1, width: windowWidth - 50, marginBottom: 15, color: "white", padding: 10, fontSize: 16}}
                    />
                
                    <Pressable style={{alignSelf: "flex-start", paddingHorizontal: 20}}>
                        {({pressed}) => 
                            <Text style={{color: pressed ? 'gray' : 'white'}}>Forgot your password?</Text>
                        }
                    </Pressable>
                </View>

                    

            
                <View style={{flex: 0.5, justifyContent: "flex-end", padding: 20}}>
                    <Pressable style={{borderRadius: 10, borderWidth: 1, borderColor: "white", width: windowWidth - 50, padding: 20, alignItems: "center", justifyContent: "center"}}>
                        {({pressed}) => 
                            <Text style={[{color: pressed ? 'gray' : 'white'}, {fontSize: 16}]}>Welcome Back</Text>
                        }
                    </Pressable>

                    <View style={{paddingVertical: 10, alignItems: "center", justifyContent: "center", flexDirection: "row"}}>
                        <Text style={{color: "white"}}>Don't have an account?   </Text>
                        <Pressable onPress={() => navigation.navigate("SignUp")}>
                            {({pressed}) => 
                                <Text style={{color: pressed ? 'gray' : 'white'}}>Sign Up</Text>
                            }
                        </Pressable>
                    </View>
                </View>
            </Animated.View>

        </KeyboardAvoidingView>
        </SafeAreaView>
    )
}