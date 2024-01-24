import React, { useState, useEffect } from 'react';
import { View, Text, Image, ActivityIndicator, Pressable, TextInput} from 'react-native';
import { getAuth } from "firebase/auth";
import { Ionicons } from '@expo/vector-icons';

import { updateUser } from "../../components/handlers";
import { pickImage } from '../../components/imagepicker';
import styles from './styles'

export default function EditField({ route, navigation }) {
    const [text, setText] = useState(route.params.user[route.params.varName])
    const auth = getAuth()

    console.log(route.params)
    

    console.log("USER", route.params.user)
    return (
        <View style={styles.container}>
            <View style={{alignItems: 'center', flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, flex: 0.1}}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </Pressable>

                <Text style={{color: "white"}}>{route.params.field}</Text>

                <Pressable onPress={async() => { await updateUser(route.params.endpoint, route.params.varName, text); navigation.goBack()}}>
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

