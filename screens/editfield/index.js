import React, { useState, useEffect } from 'react';
import { View, Text, Image, ActivityIndicator, Pressable, TextInput} from 'react-native';
import { getAuth } from "firebase/auth";
import { Ionicons } from '@expo/vector-icons';

import { pickImage } from '../../components/imagepicker';
import styles from './styles'
import { Background } from '@react-navigation/elements';

export default function EditField({ route, navigation }) {
    const [text, setText] = useState(null)
    const auth = getAuth()
    console.log(route.params)
    async function handleDone() {
        const serverUrl = `https://backend-26ufgpn3sq-uc.a.run.app/api/user/update/${route.params.endpoint}`;
        
        const requestBody = {
            token: auth.currentUser.uid,
          };
        requestBody[route.params.varName] = text

        try {
          const response = await fetch(serverUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          });
      
          if (!response.ok) {
            throw new Error(`Failed to update. Status: ${response.status}`);
          }
      
          console.log('Update successful.');

          navigation.goBack()
        } catch (error) {
          console.error('Error updating:', error.message);
        }
      }

    return (
        <View style={styles.container}>
            <View style={{alignItems: 'center', flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, flex: 0.1}}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </Pressable>

                <Text style={{color: "white"}}>{route.params.field}</Text>

                <Pressable onPress={handleDone}>
                    <Text style={{ color: text ? 'blue' : 'grey' }}>Done</Text>
                </Pressable>
            </View>

            <View style={{flex: 1}}>
                <TextInput 
                    value={text}
                    onChangeText={setText}
                    placeholder={route.params.field}
                    placeholderTextColor={"white"}
                    style={{borderTopWidth: 1, borderBottomWidth: 1, padding: 10, borderColor: "gray", color: "white"}}
                />
            </View>
           
        </View>
    )
}

