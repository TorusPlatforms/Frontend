import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, ActivityIndicator, Pressable, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { pickImage } from '../../components/imagepicker';
import { getLoop, uploadToCDN, updateLoop } from "../../components/handlers";
import styles from './styles'
import { renderNode } from 'react-native-elements/dist/helpers';

export default function EditLoop({ navigation, route }) {
    const { loop_id } = route.params
    const [loop, setLoop] = useState(null)
    const [image_url, setImageURL] = useState(null)
    const [refreshing, setRefreshing] = useState(false)


    async function handleImageSelect(image) {
        console.log("Selected Image in EditLoop:", image);

        try {
            res = await uploadToCDN(image)
            console.log(res.url)
            await updateLoop(loop_id, "pfp_url", res.url)
        } catch (error) {   
            console.error('Error uploading image:', error.message);
        }

        
      };

    const onRefresh = useCallback(async() => {
        setRefreshing(true);
        await fetchLoop()
        setRefreshing(false)
      }, []);
    

    async function fetchLoop() {
      const loop = await getLoop(loop_id)
      setLoop(loop)
      setImageURL(loop.pfp_url)
    }
    

    useEffect(() => {
      fetchLoop()
    }, []);

    
    if (!loop) {
      return <ActivityIndicator />
    }

    return (
        <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <View style={{alignItems: "center", justifyContent: "center", flex: 0.2}}>

            <TouchableOpacity onPress={() => pickImage(handleImageSelect)} style={{width: 100, height: 100, borderRadius: 50, borderWidth: 2, justifyContent: 'center', alignItems: "center", borderStyle: 'dashed', borderColor: "gray"}}>
                {!image_url && (
                    <View style={{justifyContent: "center", alignItems: "center"}}>
                      <Ionicons name="camera" size={24} color="gray" />
                      <Text style={{color: "gray"}}>Upload</Text>
                    </View>
                )}

                {image_url && (
                    <View style={{justifyContent: "center", alignItems: "center"}}>
                      <Image style={styles.pfp} source={{uri: loop.pfp_url}}/>
                    </View>
                )}

                <Ionicons name="add-circle" size={32} color="blue" style={{position: "absolute", top: 0, right: 0}}/>
              </TouchableOpacity>
          </View>
            
          <View style={{alignContent: "flex-start", flex: 1, marginTop: 20}}>
            <Pressable onPress={() => navigation.navigate("EditField", {field: "Name", endpoint: "name", varName: "name", loop: loop, type: "loop"})} style={styles.updateField}>
              <Text style={{color: "white", flex: 0.5}}>Name</Text>
              <Text style={{color: "white", flex: 1}}>{loop.name}</Text>
            </Pressable>

            <Pressable onPress={() => navigation.navigate("EditField", {field: "Description", endpoint: "description", varName: "description", loop: loop, type: "loop"})} style={styles.updateField}>
              <Text style={{color: "white", flex: 0.5}}>Description</Text>
              <Text style={{color: "white", flex: 1}}>{loop.description}</Text>
            </Pressable>
          </View>
        </ScrollView>
    )
}

