import React, { useState, useCallback, useEffect } from 'react';
import { View, TouchableOpacity, Image, Text, Pressable, Alert, ActivityIndicator, RefreshControl, FlatList, KeyboardAvoidingView, Platform, TextInput, Keyboard } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

import { findTimeAgo } from '../../components/utils';
import { getPing, deletePost, handleLike, postComment, getComments } from "../../components/handlers";
import { SwipeableRow } from '../../components/comments';

import styles from "./styles"


export default function Ping({ route }) {
  const navigation = useNavigation()

  const [refreshing, setRefreshing] = useState(false)
  const { post_id } = route.params

  const [post, setPost] = useState();
  const [isLiked, setIsLiked] = useState()
  const [numOfLikes, setNumOfLikes] = useState()

  const [comments, setComments] = useState([])
  const [commentText, onChangeCommentText] = useState("")


  async function fetchPost() {
    setRefreshing(true);

    const fetchedPost = await getPing(post_id)
    console.log("Fetched post: ", fetchedPost)

    if (fetchedPost) {
      setPost(fetchedPost)
      setIsLiked(fetchedPost.isLiked)
      setNumOfLikes(fetchedPost.numberof_likes)
    } else {
      navigation.goBack()
    }

    setRefreshing(false)

  }

  async function fetchComments() {
    setRefreshing(true);

    const fetchedComments = await getComments(route.params?.post_id)
    setComments(fetchedComments)

    setRefreshing(false)
  }
  


  async function handlePostClick() {
    await postComment(post.post_id, commentText)
    Keyboard.dismiss()
    onChangeCommentText("")
    await fetchComments()
  }

  async function handleLikePress() {
      if (isLiked) {
        setNumOfLikes(Math.max(0, numOfLikes - 1))
      } else {
        setNumOfLikes(numOfLikes + 1)
      }

      setIsLiked(!isLiked)
      await handleLike(post)
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


  const onRefresh = useCallback(async() => {
      await fetchPost()
      await fetchComments()
  }, []);


  useEffect(() => {
    fetchPost()
    fetchComments()
  }, [route.params]);

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
              <View style={{flexDirection: "col", flex: 1}}>
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

                        { post.isAuthor && (
                          <TouchableOpacity onPress={handleDeletePress}>
                            <Feather name="more-horizontal" size={16} color="white" />
                          </TouchableOpacity>
                        )}
                    </View>
            

                  <Text style={styles.text}>{post.content}</Text>
              </View>
        </View>

        { post.image_url && (
          <View style={{justifyContent: "center", flexDirection: "row"}}>

            <Image
              style={styles.attatchment}
              source={{uri: post.image_url}}
              resizeMode='cover'
            />

          </View>

        )}

        <View style={{height: 20, justifyContent: 'space-between', flexDirection: "row", paddingHorizontal: 20, marginBottom: 15}}>
          <View style={{flexDirection: "row"}}>
            <Pressable onPress={handleLikePress}>
              <Ionicons style={[styles.pingIcon, {color: isLiked ? "red" : "white"}]} name={isLiked ? "heart" : "heart-outline"} size={20}></Ionicons>
            </Pressable>
            <Text style={styles.stats}>{numOfLikes} Likes • {post.numberof_comments} Comments</Text>
          </View>
          
          <Text style={{color: "gray"}}>{findTimeAgo(post.created_at)}</Text>
        </View>

        <View style={styles.item_seperator} />
      </View>
  )
  return (
    <SafeAreaView style={styles.container}>      
            <FlatList 
                    data={comments}
                    renderItem={({ item }) => <SwipeableRow item={item} />}
                    keyExtractor={(item) => item.comment_id}
                    refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={refreshing} />}
                    ListHeaderComponent={header}
                />


              <KeyboardAvoidingView keyboardVerticalOffset={150} behavior={Platform.OS === 'ios' ? 'position' : 'height'}>
                <View style={{flexDirection: 'row', alignItems: "center", paddingBottom: 20}}>
                  <TextInput 
                        multiline
                        placeholderTextColor="white" 
                        style={{ marginLeft: 20, color: "white", borderRadius: 10, borderWidth: 1, borderColor: "gray", width: "70%", padding: 10, minHeight: 30 }} 
                        onChangeText={text => onChangeCommentText(text.trim())} 
                        placeholder='Add a comment'
                        maxLength={255}
                      />
                  
                    <Pressable onPress={handlePostClick} style={{ alignItems: 'center', backgroundColor:  commentText.length > 0 ? "rgb(47, 139, 128)" : "gray", borderRadius: 30, width: 50, height: 30, justifyContent: "center", marginLeft: 20 }}>
                      <Ionicons style={styles.text} name="arrow-up" size={20}></Ionicons>
                    </Pressable>
                </View>
                    
              </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
