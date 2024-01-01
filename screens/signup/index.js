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

    const [username, onChangeUsername] = useState("tanujks")
    const [displayName, onChangeDisplayName] = useState("Tanuj Siripurapu")
    const [email, onChangeEmail] = useState("tanujsiripurapu@gmail.com")
    const [password, onChangePassword] = useState("abc123")
    const [confirmPassword, onChangeConfirmPassword] = useState("abc123")


    //must check that pass and confirm pass are equal before sending
    //check that username doesnt exist


    async function signUp() {
        const auth = getAuth()
        console.log("AUTH", auth)
        console.log(email, password)

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            console.log("Successfully created user");
            navigation.navigate("Home");
          } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;        
            // Display an alert with the error message
            alert(errorMessage + errorCode);
          }
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1, marginTop: 50}}>

                <View style={{flex: 1, justifyContent: "space-evenly"}}>
                    <Text style={{color: "white", fontSize: 16, textAlign: "center"}}>Sign up to become connected</Text>

                    <TextInput 
                        onChangeText={onChangeUsername} 
                        value={username}
                        placeholder="Username"
                        placeholderTextColor={"white"}
                        style={{borderRadius: 10, borderColor: "white", borderWidth: 1, minWidth: "80%", marginVertical: 10, color: "white", padding: 20, fontSize: 16}}
                    />

                    <TextInput 
                        onChangeText={onChangeDisplayName} 
                        value={displayName}
                        placeholder="Display Name"
                        placeholderTextColor={"white"}
                        style={{borderRadius: 10, borderColor: "white", borderWidth: 1, minWidth: "80%", marginVertical: 10, color: "white", padding: 20, fontSize: 16}}
                    />


                    <TextInput 
                        onChangeText={onChangeEmail} 
                        value={email}
                        placeholder="Email"
                        placeholderTextColor={"white"}
                        style={{borderRadius: 10, borderColor: "white", borderWidth: 1, minWidth: "80%", marginVertical: 10, color: "white", padding: 20, fontSize: 16}}
                    />
                    
                    <TextInput 
                        onChangeText={onChangePassword} 
                        value={password}
                        placeholder="Password"
                        placeholderTextColor={"white"}
                        secureTextEntry={true}
                        style={{borderRadius: 10, borderColor: "white", borderWidth: 1, minWidth: "80%", marginVertical: 10, color: "white", padding: 20, fontSize: 16}}
                    />

                    <TextInput 
                        onChangeText={onChangeConfirmPassword} 
                        value={confirmPassword}
                        placeholder="Confirm Password"
                        placeholderTextColor={"white"}
                        secureTextEntry={true}
                        style={{borderRadius: 10, borderColor: "white", borderWidth: 1, minWidth: "80%", marginVertical: 10, color: "white", padding: 20, fontSize: 16}}
                    />
                </View>
            </KeyboardAvoidingView>


                <View style={{justifyContent: "center", alignItems: "center", marginTop: 50, flex: 0.2}}>
                    <Pressable onPress={signUp} style={{borderRadius: 10, borderWidth: 1, borderColor: "white", minWidth: "80%", padding: 20, alignItems: "center", justifyContent: "center"}}>
                        {({pressed}) => 
                            <Text style={[{color: pressed ? 'gray' : 'white'}, {fontSize: 16}]}>Sign Up</Text>
                        }
                    </Pressable>
                    <Text style={{color: "white", textAlign: "center", marginTop: 10, marginHorizontal: 10}}>By signing up, you are agreeing to our Terms, Privacy, and Cookies policies</Text>
                </View>

        </SafeAreaView>
    )
}