import React, { useState, useEffect } from 'react';
import { View, Text, Image, ActivityIndicator, Pressable, TextInput} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { updateUser, updateLoop } from "../../components/handlers";
import styles from './styles'

export default function EditField({ route, navigation }) {
    const { type, field, endpoint, user, loop} = route.params
    const [text, setText] = useState("")

    console.log(route.params)

    async function handleUpdate() {
        if (type == "user") {
            await updateUser(endpoint, text);
        } else if (type == "loop") {
            await updateLoop(loop.loop_id, endpoint, text)
        } else {
            throw new Error("Type Not Defined")
        }

        navigation.goBack()
    }

    
    useEffect(() => {
        if (type == "user") {
            setText(user[endpoint])
        } else if (type == "loop") {
            setText(loop[endpoint])
        } else {
            throw new Error("Type Not Defined")
        }
      }, []);
  
    return (
        <View style={styles.container}>
            <View style={{alignItems: 'center', flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, flex: 0.1}}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </Pressable>

                <Text style={{color: "white"}}>{field}</Text>

                <Pressable onPress={handleUpdate}>
                    <Text style={{ color: text ? 'blue' : 'grey' }}>Done</Text>
                </Pressable>
            </View>

            <View style={{flex: 1}}>
                <TextInput 
                    onChangeText={setText}
                    value={text}
                    style={{borderTopWidth: 1, borderBottomWidth: 1, padding: 10, borderColor: "gray", color: "white"}}
                />
            </View>
           
        </View>
    )
}

