import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Image, Text, Pressable, Alert, ActivityIndicator, RefreshControl, FlatList, KeyboardAvoidingView, Platform, TextInput, Keyboard, Share } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import * as Linking from "expo-linking";
import Lightbox from 'react-native-lightbox-v2';

import { findTimeAgo } from '../../components/utils';
import { getPing, deletePost, handleLike, postComment, getComments } from "../../components/handlers";
import { Comments } from '../../components/comments';
import styles from "./styles"


export default function Ping({ route }) {
  const navigation = useNavigation()
  const { post_id, scrollToComment } = route.params

  const [post, setPost] = useState();
  const [isLiked, setIsLiked] = useState()
  const [numOfLikes, setNumOfLikes] = useState()


  async function fetchPost() {
    const fetchedPost = await getPing(post_id)
    console.log("Fetched post: ", fetchedPost)

    if (fetchedPost) {
      setPost(fetchedPost)
      setIsLiked(fetchedPost.isLiked)
      setNumOfLikes(fetchedPost.numberof_likes)
      
    } else {
      navigation.goBack()
    }
  }


  async function handleLikePress() {
      if (isLiked) {
        setNumOfLikes(Math.max(0, numOfLikes - 1))
      } else {
        setNumOfLikes(numOfLikes + 1)
      }

      const newLiked = (!isLiked)
      setIsLiked(previousState => !previousState)
      await handleLike({post_id: post_id, endpoint: newLiked ? "like" : "unlike"})
  }

  function handleAuthorPress() {
      if (post.loop_id && post.public) {
        navigation.push("Loop", {loop_id: post.loop_id})
      } else {
        navigation.push("UserProfile", {username: post.author})
      }
  }

  function handleDeletePress() {
    Alert.alert("Are you sure you want to delete this Ping?", "This is a permanent action that cannot be undone.", [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: async() => await deletePost(post.post_id)},
    ]);
  }

  async function handleShare() {
    const prefix = Linking.createURL('/');

    await Share.share({
      title: 'Shared Ping',
      message: prefix + "ping/" + post.post_id, 
      url: prefix + "ping/" + post.post_id
     });
  }


  useEffect(() => {
    fetchPost()
  }, []);

  if (!post) {
      return (
        <View style={{flex: 1, backgroundColor: "rgb(22, 23, 24)", justifyContent: "center", alignItems: "center"}}>
            <ActivityIndicator />
        </View>
      )
  }

  const header = (
    <View style={{marginBottom: 20}}>
        <View style={{marginVertical: 10, width: "95%", flexDirection: "row", padding: 10, paddingHorizontal: 20, minHeight: 60}}>
              <View>
                <Image
                  style={styles.tinyLogo}
                  source={{uri: post.pfp_url}}
                />
              </View>
        
              <View style={{marginLeft: 20, flex: 6}}>
                    <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                        <TouchableOpacity onPress={handleAuthorPress}>
                            <Text style={styles.author}>
                              {(post.loop_id && post.public) ? `[LOOP] ${post.author}` : post.author}
                            </Text>
                        </TouchableOpacity>

                        
                    </View>
            

                    <TextInput multiline editable={false} style={[styles.text, {padding: 2}]} value={post.content}></TextInput>

                    { post.image_url && (
                      <Lightbox navigator={navigation} activeProps={{style: styles.fullscreenImage}}>

                          <Image
                            style={styles.attatchment}
                            source={{uri: post.image_url}}
                          />
                      </Lightbox>
                    )}
              </View>
        </View>

        <View style={{height: 50, justifyContent: 'space-between', flexDirection: "col", paddingHorizontal: 20, marginBottom: 15}}>
            <View style={{flexDirection: "row", marginLeft: 20}}>
              <Pressable onPress={handleLikePress}>
                <Ionicons style={[styles.pingIcon, {color: isLiked ? "red" : "white"}]} name={isLiked ? "heart" : "heart-outline"} size={20}></Ionicons>
              </Pressable>

              <TouchableOpacity onPress={handleShare}>
                <Ionicons style={[styles.pingIcon, {color: "white"}]} name={"share-social"} size={20}></Ionicons>
              </TouchableOpacity>

              { post.isAuthor && (
                <TouchableOpacity onPress={handleDeletePress} style={styles.pingIcon}>
                  <Feather name="trash" size={20} color="white" />
                </TouchableOpacity>
              )}
        
            </View>
            
            <View style={{flexDirection: 'row', justifyContent: "space-between", paddingVertical: 15}}>
                <Text style={styles.stats}>{numOfLikes} Likes • {post.numberof_comments} Comments</Text>

                <Text style={{color: "gray"}}>{findTimeAgo(post.created_at)}</Text>

            </View>

        </View>

        <View style={styles.item_seperator} />


      </View>
  )
  
  return (
    <View style={styles.container}>      
        <Comments 
          post_id={post_id}
          headerComponent={header}
          scrollToCommentID={scrollToComment}
        />

    </View>
  )
}
