import React, { useState } from "react";
import { Text, View, SafeAreaView, Image, Animated, FlatList, Pressable, Alert, Share } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';

import { handleLike } from "../handlers";
import { findTimeAgo } from "../utils";
import styles from "./styles";


export const Ping = ({navigation, data, handleComment, handleShare }) => {
    const [isLiked, setIsLiked] = useState(data.isLiked)
    const [numOfLikes, setNumOfLikes] = useState(data.numberof_likes)

    async function handleLikePress() {
      if (isLiked) {
        setNumOfLikes(Math.max(0, numOfLikes - 1))
      } else {
        setNumOfLikes(numOfLikes + 1)
      }

      setIsLiked(!isLiked)
      await handleLike(data)
    }

    return (
      <View style={{marginVertical: 10, width: "95%", flexDirection: "row", padding: 10}}>
        <View style={{flexDirection: "col", flex: 1}}>
          <Image
            style={styles.tinyLogo}
            source={{uri: data.pfp_url}}
          />
    
          <View style={styles.verticalLine} />
        </View>
    
        <View style={{marginLeft: 10, flex: 6}}>
          <View style={{flex: 1}}>
            <Pressable onPress={() => navigation.navigate("UserProfile", {username: data.author})}>
              {({pressed}) => (
                <Text style={[styles.author, {color: pressed ? "grey": "white"}]}>{data.author}</Text>
              )}
            </Pressable>
            <Text style={styles.text}>{data.content}</Text>
          </View>
        
          <View style={{flex: 2}}>
            <Image
              style={[styles.attatchment, {display: data.image_url ? "flex" : "none"}]}
              source={{uri: data.image_url}}
              resizeMode='contain'
            />
          </View>
        
    
          <View style={{flexDirection: "row", flex: 1}}>
            <Pressable onPress={handleLikePress}>
              <Ionicons style={[styles.pingIcon, {color: isLiked ? "red" : "white"}]} name={isLiked ? "heart" : "heart-outline"} size={20}></Ionicons>
            </Pressable>
    
            <Pressable onPress={handleComment}>
              <Ionicons style={styles.pingIcon} name="chatbubble-outline" size={20}></Ionicons>
            </Pressable>
    
            <Pressable onPress={() => handleShare(data.postURL)}>
              <Ionicons style={styles.pingIcon} name="share-social-outline" size={20}></Ionicons>
            </Pressable>
    
            <Pressable>
              <Ionicons style={styles.pingIcon} name="paper-plane-outline" size={20}></Ionicons>
            </Pressable>
          </View>

          <View style={{flex: 1, marginTop: 5}}>
            <Text style={styles.stats}>{numOfLikes} Likes • {data.numberof_comments} Comments</Text>
          </View>
        </View>

        <View>
          <Text style={{color: "gray"}}>{findTimeAgo(data.created_at)}</Text>
        </View>
      </View>
  );
}
  
  
  