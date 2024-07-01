import React, { useEffect, useState } from 'react';
import { View, Image, Text, TouchableOpacity } from "react-native";
import { findTimeAgo } from '../utils';
import Ionicons from '@expo/vector-icons/Ionicons';

import styles from "./styles"
import { deleteAnnouncement } from '../handlers';
import { useNavigation } from '@react-navigation/native';

export const Announcement = ({ data }) => {
  const navigation = useNavigation()
  
  function handleAuthorPress() {
      navigation.navigate("UserProfile", {username: data.author});
  }

  async function handleDeletePress() {
    await deleteAnnouncement({ loop_id: data.loop_id, announcement_id: data.announcement_id })
  }

  return (
    <View style={{marginVertical: 10, width: "95%", flexDirection: "row", padding: 10}}>
        <View style={{flexDirection: "col", flex: 1}}>
          <Image
            style={styles.tinyLogo}
            source={{uri: data.pfp_url}}
          />
        </View>
    
        <View style={{marginLeft: 20, flex: 6}}>
          <View style={{flex: 1}}>
            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                <TouchableOpacity onPress={handleAuthorPress}>
                    <Text style={styles.author}>{data.author}</Text>
                </TouchableOpacity>

                <Text style={{color: "gray"}}>{findTimeAgo(data.created_at)}</Text>

            </View>

            <View style={{flexDirection: "row", justifyContent: 'space-between' }}>
                <Text style={styles.text}>{data.content}</Text>

                <TouchableOpacity onPress={handleDeletePress}>
                  <Ionicons style={styles.pingIcon} name="trash-outline" size={20}></Ionicons>
                </TouchableOpacity>
            </View>
            
          </View>
        
          <View style={{flex: 2}}>
            { data.image_url && (
              <Image
                style={styles.attatchment}
                source={{uri: data.image_url}}
                resizeMode='cover'
              />
            )}
          </View>


        </View>
    </View>
  );
};