import React, { useEffect, useState } from 'react';
import { View, Image, Text, TouchableOpacity } from "react-native";
import { findTimeAgo } from '../utils';

import styles from "./styles"

export const Announcement = ({ data }) => {
  function handleAuthorPress() {
      navigation.navigate("UserProfile", {username: data.author});
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
            <View style={{flexDirection: "row", justifyContent: "space-between", marginBottom: 5}}>
                <TouchableOpacity onPress={handleAuthorPress}>
                    <Text style={styles.author}>{data.author}</Text>
                </TouchableOpacity>

                <Text style={{color: "gray"}}>{findTimeAgo(data.created_at)}</Text>

            </View>
  
            <Text style={styles.text}>{data.content}</Text>
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