import React, { useState, useRef, useEffect } from "react";
import { View, Image, Text, Animated, Dimensions, Pressable, TextInput, KeyboardAvoidingView, Keyboard } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAuth, createUserWithEmailAndPassword  } from "firebase/auth"
import styles from "./styles";

export default function SignUpScreen() {
    const navigation = useNavigation()
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const [username, onChangeUsername] = useState("tanuj")
    const [email, onChangeEmail] = useState("tanujsiripurapu@gmail.com")
    const [password, onChangePassword] = useState("abc123")
    const [confirmPassword, onChangeConfirmPassword] = useState("abc123")

    console.log("email", email)
    async function signUp() {
        const auth = getAuth()
        console.log("AUTH", auth)
        console.log(email, password)
        await createUserWithEmailAndPassword(auth, email, password)
        console.log("Succesfully created user")
        navigation.navigate("Home")
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1, marginTop: 50}}>
                <View style={{alignItems: "center", justifyContent: "center"}}>
                    <Text style={{color: "white", fontSize: 16, textAlign: "center", marginTop: 30}}>Sign up to become connected with the greatest community</Text>

                    <TextInput 
                        onChangeText={onChangeUsername} 
                        value={username}
                        placeholder="Username"
                        placeholderTextColor={"white"}
                        style={{borderRadius: 10, borderColor: "white", borderWidth: 1, width: windowWidth - 50, marginVertical: 10, color: "white", padding: 20, fontSize: 16}}
                    />

                    <TextInput 
                        onChangeText={onChangeEmail} 
                        value={email}
                        placeholder="Email"
                        placeholderTextColor={"white"}
                        style={{borderRadius: 10, borderColor: "white", borderWidth: 1, width: windowWidth - 50, marginVertical: 10, color: "white", padding: 20, fontSize: 16}}
                    />
                    
                    <TextInput 
                        onChangeText={onChangePassword} 
                        value={password}
                        placeholder="Password"
                        placeholderTextColor={"white"}
                        style={{borderRadius: 10, borderColor: "white", borderWidth: 1, width: windowWidth - 50, marginVertical: 10, color: "white", padding: 20, fontSize: 16}}
                    />

                    <TextInput 
                        onChangeText={onChangeConfirmPassword} 
                        value={confirmPassword}
                        placeholder="Confirm Password"
                        placeholderTextColor={"white"}
                        style={{borderRadius: 10, borderColor: "white", borderWidth: 1, width: windowWidth - 50, marginVertical: 10, color: "white", padding: 20, fontSize: 16}}
                    />
                </View>

                </KeyboardAvoidingView>

                <View style={{justifyContent: "center", alignItems: "center", marginBottom: 20}}>
                    <Pressable onPress={signUp} style={{borderRadius: 10, borderWidth: 1, borderColor: "white", width: windowWidth - 50, padding: 20, alignItems: "center", justifyContent: "center"}}>
                        {({pressed}) => 
                            <Text style={[{color: pressed ? 'gray' : 'white'}, {fontSize: 16}]}>Sign Up</Text>
                        }
                    </Pressable>
                    <Text style={{color: "white", textAlign: "center", marginTop: 10, marginHorizontal: 10}}>By signing up, you are agreeing to our Terms, Privacy, and Cookies policies</Text>
                </View>
                
        </SafeAreaView>
    )
}