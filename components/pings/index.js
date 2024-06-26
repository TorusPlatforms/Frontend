import React, { useState, useEffect, useRef, forwardRef } from "react";
import { Text, View, SafeAreaView, Image, Animated, FlatList, Pressable, Alert, Modal, TouchableOpacity } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { useNavigation } from "@react-navigation/native";

import { handleLike, deletePost } from "../handlers";
import { findTimeAgo } from "../utils";
import styles from "./styles";


export const Ping = ({data, openComment }) => {
    const navigation = useNavigation()
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

    function handleAuthorPress() {
        if (data.loop_id && data.public) {
          navigation.push("Loop", {loop_id: data.loop_id})
        } else {
          navigation.push("UserProfile", {username: data.author})
        }
    }

    async function handleComment() {
      navigation.navigate("Comments", {post_id: data.post_id})
    }

    function handleDeletePress() {
      Alert.alert("Are you sure you want to delete this Ping?", "This is a permanent action that cannot be undone.", [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: async() => await deletePost(data.post_id)},
      ]);
    }

    useEffect(() => {
      if (openComment == data.post_id) {
        handleComment()
      }
    }, [openComment])

    return (
      <View style={{marginVertical: 10, width: "95%", flexDirection: "row", padding: 10, paddingHorizontal: 20}}>
        <View style={{flexDirection: "col", flex: 1}}>
          <Image
            style={styles.tinyLogo}
            source={{uri: data.pfp_url}}
          />
        </View>
    
        <View style={{marginLeft: 20, flex: 6}}>
          <View style={{flex: 1}}>
              <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                  <TouchableOpacity onPress={handleAuthorPress}>
                      <Text style={styles.author}>
                        {(data.loop_id && data.public) ? `[LOOP] ${data.author}` : data.author}
                      </Text>
                  </TouchableOpacity>

                  { data.isAuthor && (
                    <TouchableOpacity onPress={handleDeletePress}>
                      <Feather name="more-horizontal" size={16} color="white" />
                    </TouchableOpacity>
                  )}
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
        
    
          <View style={{flexDirection: "row", flex: 1, marginVertical: 5}}>
            <Pressable onPress={handleLikePress}>
              <Ionicons style={[styles.pingIcon, {color: isLiked ? "red" : "white"}]} name={isLiked ? "heart" : "heart-outline"} size={20}></Ionicons>
            </Pressable>
    
            <Pressable onPress={handleComment}>
              <Ionicons style={styles.pingIcon} name="chatbubble-outline" size={20}></Ionicons>
            </Pressable>
{/*     
            <Pressable onPress={() => handleShare(data.postURL)}>
              <Ionicons style={styles.pingIcon} name="share-social-outline" size={20}></Ionicons>
            </Pressable>
     */}
            {/* <Pressable>
              <Ionicons style={styles.pingIcon} name="paper-plane-outline" size={20}></Ionicons>
            </Pressable> */}
          </View>

          <View style={{flex: 1, marginTop: 5, justifyContent: 'space-between', flexDirection: "row"}}>
            <Text style={styles.stats}>{numOfLikes} Likes • {data.numberof_comments} Comments</Text>
            <Text style={{color: "gray"}}>{findTimeAgo(data.created_at)}</Text>
          </View>
        </View>
{/* 
        <CommentModal
                ping={data}
                modalVisible={commentModalVisible}
                setModalVisible={setCommentModalVisible}
                modalRef={modalRef}
          /> */}
      </View>
  );
}
  
  
  