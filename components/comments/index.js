import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Text, View, RefreshControl, Image, Keyboard, FlatList, Pressable, Alert, Share, Modal, KeyboardAvoidingView, TextInput, Platform, TouchableOpacity } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from "@expo/vector-icons/Feather"
import { useNavigation } from '@react-navigation/native';
import { MentionInput, onSuggestionPress } from 'react-native-controlled-mentions'

import { getComments, postComment } from '../handlers';
import { findTimeAgo } from '../utils';
import styles from "./styles";
import AppleRow from './AppleRow';
import { getReplies, addReply } from '../handlers/replies';
import { searchUsers } from '../handlers/search';


export const SwipeableRow = ({ item, setParentCommentID, addCommentRef }) => {
  if (item.isAuthor) {
      return (
        <AppleRow comment_id={item.comment_id} reply_id={item.reply_id}>
          <Comment data={item} setParentCommentID={setParentCommentID} addCommentRef={addCommentRef}  />
        </AppleRow>
      );
    } else {
      return <Comment data={item} setParentCommentID={setParentCommentID} addCommentRef={addCommentRef} />
  }
};




const Comment = ({ data, setParentCommentID, addCommentRef }) => {
    const [showReplies, setShowReplies] = useState()
    const [replies, setReplies] = useState([])
    const navigation = useNavigation()

    useEffect(() => {
      if (showReplies) {
        fetchReplies()
      }
    }, [data])

    async function handleReply() {
      if (!showReplies && data.reply_count > 0) {
        await fetchReplies()
        setShowReplies(previousState => !previousState);
      }

      setParentCommentID(data.comment_id)
      addCommentRef.current.focus()
    }

    async function handleUserClick(username) {
        navigation.goBack(); 
        navigation.navigate("Ping", {post_id: data.post_id}); 
        navigation.push("UserProfile", {username: username})
    }

    async function fetchReplies() {
        const fetchedReplies = await getReplies(data.comment_id)
        setReplies(fetchedReplies);
    };

    const parseText = (text) => {
      const regex = /@\[([^\]]+)\]\(!\)/g;
      const parts = [];
      let lastIndex = 0;
    
      let match;
      while ((match = regex.exec(text)) !== null) {
        const username = match[1];
        parts.push(text.slice(lastIndex, match.index));
        parts.push(
          <Text style={{color: "rgb(125, 175, 255)"}} key={match.index} onPress={() => handleUserClick(username)}>
            @{username}
          </Text>
        );
        lastIndex = regex.lastIndex;
      }
      parts.push(text.slice(lastIndex));
      
      return parts;
    };

    return (
        <View style={{ marginVertical: 10, width: "95%", flexDirection: "row", paddingHorizontal: 10, minHeight: 30, flex: 1, alignItems: "flex-start" }}>
          <Pressable onPress={() => handleUserClick(data.author)} style={{flex: 0.15, justifyContent: 'center', alignItems: 'center'}}>
            <Image
                style={styles.tinyLogo}
                source={{uri: data.pfp_url}}
              />
          </Pressable>
      
          <View style={{ flexDirection: "column", marginLeft: 10, flex: 1 }}>
              <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                <TouchableOpacity onPress={() => handleUserClick(data.author)}>
                  <Text style={{color: 'white', fontSize: 12}}>{data.author}</Text>
                </TouchableOpacity>
                <Text style={styles.commentTime}>{!data.reply_id ? findTimeAgo((data.created_at)) : null}</Text>
              </View>
            
              <Text style={[styles.text, {maxWidth: 200, marginVertical: 4, alignItems: "center"}]}>
                  {parseText(data.content)}
              </Text>

              <View style={{flexDirection: 'row', marginBottom: showReplies ? 10 : 0}}>
                { !data.reply_id && (
                  <TouchableOpacity onPress={handleReply}>
                      <Text style={styles.reply}>Reply</Text>
                  </TouchableOpacity>
                )}

                { data.reply_count > 0 && !data.reply_id && (
                  <Text style={{color: "gray", marginLeft: 10}} onPress={() => {setShowReplies(previousState => !previousState); fetchReplies()}}>{showReplies ? "Hide" : "View " + data.reply_count} replies</Text>
                )}
              </View>
              

              {showReplies && replies.map(reply => (
                    <View key={reply.reply_id}>
                        <SwipeableRow item={reply} />
                    </View>
              ))}
            {/* <View>
              <Pressable onPress={() => handleReply(data)}>
                <Text style={styles.reply}>Reply</Text>
              </Pressable>
            </View> */}
          </View>
      
          {/* <View style={styles.likeContainer}>
              <Pressable onPress={() => handleCommentLike(data)}>
                <Ionicons style={[styles.pingIcon, {color: data.isLiked ? "red" : "white"}]} name={data.isLiked ? "heart" : "heart-outline"} size={20}></Ionicons>
              </Pressable>
          </View> */}
        </View>
      )}
  

export const Comments = ({ headerComponent, post_id }) => {
    const [comments, setComments] = useState([])
    const [parentCommentID, setParentCommentID] = useState()
    const addCommentRef = useRef()
    const flatlist_ref = useRef()

    const [refreshing, setRefreshing] = useState()

    const onRefresh = useCallback(async() => {
      await fetchComments()
    }, []);


    async function fetchComments() {
      setRefreshing(true);

      const fetchedComments = await getComments(post_id)
      setComments(fetchedComments)

      console.log("Fetched", fetchedComments?.length, "comments.")

      setRefreshing(false)
    }

    useEffect(() => {
      fetchComments()
    }, []);

    const [commentText, setCommentText] = useState("")

    async function handlePostClick() {
      if (commentText.trim()) {
        if (parentCommentID) { //this means it is a Reply
          await addReply({ post_id: post_id, content: commentText.trim(), comment_id: parentCommentID})
        } else {
          await postComment(post_id, commentText.trim())
        }
  
        Keyboard.dismiss()
        setCommentText("")
        await fetchComments()

        if (parentCommentID) {
          const index = comments.findIndex(comment => comment.comment_id === parentCommentID);
          if (index !== -1) {
            flatlist_ref.current.scrollToIndex({ index, animated: true });
          }
          
          setParentCommentID(null)
        }
      }
    }
  
    async function renderSuggestions({keyword, onSuggestionPress}) {
      if (keyword == null) {
        return null;
      }
      
      const fetchedUsers = await searchUsers(keyword, 5)
  
      const suggestions = fetchedUsers.slice(0, 5).map(user => {
        const { username, ...rest } = user;
        return { id: "!", name: username, ...rest };
      });
  
      return (
        <View style={{backgroundColor: "rgb(35, 35, 35)", borderTopLeftRadius: 20, borderTopRightRadius: 20}}>
          {suggestions.map((suggestion, index) => (
              <Pressable key={index} onPress={() => onSuggestionPress(suggestion)}> 
  
                  <View style={{flexDirection: "row", alignItems: "center", padding: 12}}>
                      <Image style={{ width: 40, height: 40, borderRadius: 25}} source={{uri: suggestion.pfp_url}}/>
                      <Text style={{color: "white", marginLeft: 5}}>{suggestion.name}</Text>
                  </View>
                  
                  {index < suggestions.length - 1 && <View style={styles.item_seperator} />}
  
              </Pressable>
            ))
          }
        </View>
      );
    };
  
  
  
    return (
      <View style={{flex: 1, paddingBottom: 10}}>
            <FlatList 
                  ref={flatlist_ref}
                  data={comments}
                  renderItem={({ item }) => 
                  <SwipeableRow 
                    item={item} 
                    setParentCommentID={setParentCommentID} 
                    addCommentRef={addCommentRef} 
                  />}
                  keyExtractor={(item) => item.comment_id}
                  refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={refreshing} tintColor={"white"} />}
                  ListHeaderComponent={headerComponent}
                  contentContainerStyle={{paddingBottom: 250}}
            />



            <KeyboardAvoidingView keyboardVerticalOffset={100} behavior={Platform.OS === 'ios' ? 'position' : 'height'}>
              <View style={{flexDirection: 'row', alignItems: "flex-end", backgroundColor: 'rgb(22, 23, 24)' , paddingVertical: 20}}>
                    <View style={{width: "75%", paddingLeft: 20}}>
                        {parentCommentID && (
                          <View style={{justifyContent: 'space-between', flexDirection: "row", paddingBottom: 10}}>
                            <Text style={{color: "gray", marginLeft: 5}}>Replying</Text>
      
                            <TouchableOpacity onPress={() => setParentCommentID(null)}>
                                <Feather name="x" size={12} color="gray" />
                            </TouchableOpacity>
                          </View>
                        )}
                        
      
                        <MentionInput
                            inputRef={addCommentRef}
                            value={commentText}
                            onChange={text => setCommentText(text.trim())}
                            placeholder='Add a comment'
                            placeholderTextColor="white" 
                            style={{ color: "white", borderRadius: 10, borderWidth: 1, borderColor: "gray",  padding: 10, minHeight: 30  }} 
                            partTypes={[
                              {
                                trigger: '@',
                                renderSuggestions,
                                textStyle: {fontWeight: 'bold', color: 'rgb(125, 175, 255)'},
                              },
                            ]}
                            textInputProps={{color: "white"}}
                        />
                    </View>
      
                    <Pressable onPress={handlePostClick} style={{ alignItems: 'center', backgroundColor:  commentText.length > 0 ? "rgb(47, 139, 128)" : "gray", borderRadius: 30, width: 50, height: 30, justifyContent: "center", marginLeft: 20, marginBottom: 5 }}>
                      <Ionicons style={styles.text} name="arrow-up" size={20}></Ionicons>
                    </Pressable>
                </View>
                  
            </KeyboardAvoidingView>
      </View>
      
    )
}