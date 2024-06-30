import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Image, Text, Pressable, Alert, ActivityIndicator, RefreshControl, FlatList, KeyboardAvoidingView, Platform, TextInput, Keyboard } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

import { findTimeAgo } from '../../components/utils';
import { getPing, deletePost, handleLike, postComment, getComments } from "../../components/handlers";
import { addReply } from '../../components/handlers/replies';
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

  const [parentCommentID, setParentCommentID] = useState(null)
  const addCommentRef = useRef()


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

    console.log("Fetched", fetchedComments.length, "comments. First entry:", fetchedComments[0])

    setRefreshing(false)
  }
  


  async function handlePostClick() {
    if (commentText.trim()) {
      if (parentCommentID) { //this means it is a Reply
        await addReply({ post_id: route.params?.post_id, content: commentText.trim(), comment_id: parentCommentID})
      } else {
        await postComment(route.params?.post_id, commentText.trim())
      }

      Keyboard.dismiss()
      onChangeCommentText("")
      setParentCommentID(null)
      await fetchComments()
      
    }
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
    <View style={styles.container}>      
        <FlatList 
                data={comments}
                renderItem={({ item }) => <SwipeableRow item={item} setParentCommentID={setParentCommentID} addCommentRef={addCommentRef} />}
                keyExtractor={(item) => item.comment_id}
                refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={refreshing} />}
                ListHeaderComponent={header}
            />


          <KeyboardAvoidingView keyboardVerticalOffset={80} behavior={Platform.OS === 'ios' ? 'position' : 'height'}>
            <View style={{flexDirection: 'row', alignItems: "center", paddingVertical: 20, backgroundColor: 'rgb(22, 23, 24)', marginBottom: 10}}>

              <View style={{width: "75%", paddingLeft: 20}}>
                {parentCommentID && (
                  <View style={{justifyContent: 'space-between', flexDirection: "row"}}>
                    <Text style={{color: "gray", marginLeft: 5}}>Replying</Text>

                    <TouchableOpacity onPress={() => setParentCommentID(null)}>
                        <Feather name="x" size={12} color="gray" />
                    </TouchableOpacity>
                  </View>
                )}
                

                <TextInput 
                      ref={addCommentRef}
                      value={commentText}
                      multiline
                      placeholderTextColor="white" 
                      style={{ color: "white", borderRadius: 10, borderWidth: 1, borderColor: "gray",  padding: 10, minHeight: 30, marginTop: 10 }} 
                      onChangeText={onChangeCommentText} 
                      placeholder='Add a comment'
                      maxLength={255}
                    />
              
              </View>
              
              <Pressable onPress={handlePostClick} style={{ alignItems: 'center', backgroundColor:  commentText.length > 0 ? "rgb(47, 139, 128)" : "gray", borderRadius: 30, width: 50, height: 30, justifyContent: "center", marginLeft: 20 }}>
                <Ionicons style={styles.text} name="arrow-up" size={20}></Ionicons>
              </Pressable>
            </View>
                
          </KeyboardAvoidingView>
    </View>
  )
}
