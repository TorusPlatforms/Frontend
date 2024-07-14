import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Pressable, TextInput, ActivityIndicator} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { updateUser, updateLoop } from "../../components/handlers";
import styles from './styles'

export default function EditField({ route, navigation }) {
    const { type, field, endpoint, user, loop, maxLength } = route.params
    const [defaultValue, setDefaultValue] = useState()
    const [text, setText] = useState();

    async function handleUpdate() {
        if (type == "user") {
            await updateUser(endpoint, text);
        } else if (type == "loop") {
            await updateLoop({loop_id: loop.loop_id, endpoint: endpoint, value: text})
        } else {
            throw new Error("Type Not Defined")
        }

        navigation.goBack()
    }

    
    useEffect(() => {
        let defaultValue
        if (type == "user") {
            defaultValue = (user[endpoint])
        } else if (type == "loop") {
            defaultValue = (loop[endpoint])
        } else {
            throw new Error("Type Not Defined")
        }

        setDefaultValue(defaultValue)
        setText(defaultValue)
      }, []);
  
    if (!defaultValue) {
        return (
            <View style={{flex: 1, backgroundColor: "rgb(22, 23, 24)", justifyContent: "center", alignItems: 'center'}}>
                <ActivityIndicator />
            </View>
        )
    }
    return (
        <View style={styles.container}>
            <View style={{alignItems: 'center', flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, flex: 0.1}}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </Pressable>

                <Text style={{color: "white"}}>{field}</Text>

                <TouchableOpacity onPress={handleUpdate}>
                    <Text style={{ color: text ? 'rgb(47, 139, 128)' : 'grey' }}>Done</Text>
                </TouchableOpacity>
            </View>

            <View style={{flex: 1}}>
                <TextInput 
                    defaultValue={defaultValue}
                    onChangeText={setText}
                    maxLength={maxLength ? maxLength : 200}
                    style={{borderTopWidth: 1, borderBottomWidth: 1, padding: 10, borderColor: "gray", color: "white"}}
                />
            </View>
           
        </View>
    )
}

