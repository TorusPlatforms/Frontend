import React, { useState, useRef, useEffect } from "react";
import { View, Text, Dimensions, Pressable, TextInput, KeyboardAvoidingView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAuth, createUserWithEmailAndPassword, deleteUser } from "firebase/auth"
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

 
      
    async function signUp() {
        const auth = getAuth()
        console.log("AUTH", auth)
        console.log(email, password)

        try {
            const user = await createUserWithEmailAndPassword(auth, email, password);
            console.log("Successfully created user in Firebase");
            console.log(user.user.uid)

            try {
                await registerUserBackend(username, user.user.email, displayName)
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
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1, marginTop: 50}}>

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
            </KeyboardAvoidingView>


                <View style={styles.signUpContainer}>
                    <Pressable onPress={signUp} style={styles.input}>
                        {({pressed}) => 
                            <Text style={[{color: pressed ? 'gray' : 'white'}, {fontSize: 16, textAlign: "center"}]}>Sign Up</Text>
                        }
                    </Pressable>
                    <Text style={styles.policy}>By signing up, you are agreeing to our Terms, Privacy, and Cookies policies</Text>
                </View>

        </SafeAreaView>
    )
}