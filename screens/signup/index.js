import React, { useState, useRef, useEffect } from "react";
import { View, Image, Text, Animated, Dimensions, Pressable, TextInput, KeyboardAvoidingView, Keyboard } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import styles from "./styles";

export default function SignUpScreen() {
    const navigation = useNavigation()
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const [username, onChangeUsername] = useState()
    const [email, onChangeEmail] = useState()
    const [password, onChangePassword] = useState()
    const [confirmPassword, onChangeConfirmPassword] = useState()

    const [keyboardStatus, setKeyboardStatus] = useState(false);

    useEffect(() => {
      const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
        setKeyboardStatus(true);
      });
      const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
        setKeyboardStatus(false);
      });
  
      return () => {
        showSubscription.remove();
        hideSubscription.remove();
      };
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
                {!keyboardStatus && (          
                    <View style={{
                        flex: 0.2,
                        justifyContent: "center",
                        alignItems: "center",
                        marginVertical: 50,
                    }}>
                    <Image style={{width: windowWidth, height: windowHeight / 3, resizeMode: "contain"}} source={require('../../assets/torus.png')}></Image>
                </View>)}
      

                <View style={{flex: 1}}>
                    <Text style={{color: "white", fontSize: 16, textAlign: "center", marginTop: 20}}>Sign up to become connected with the greatest community</Text>

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
                        value={email}
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

                <View style={{flex: 0.2, justifyContent: "center", alignItems: "center"}}>
                    <Pressable style={{borderRadius: 10, borderWidth: 1, borderColor: "white", width: windowWidth - 50, padding: 20, alignItems: "center", justifyContent: "center"}}>
                        {({pressed}) => 
                            <Text style={[{color: pressed ? 'gray' : 'white'}, {fontSize: 16}]}>Welcome Back</Text>
                        }
                    </Pressable>
                    <Text style={{color: "white", textAlign: "center", marginTop: 10, marginHorizontal: 10}}>By signing up, you are agreeing to our Terms, Privacy, and Cookies policies</Text>
                </View>
        </SafeAreaView>
    )
}