import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Text, View, RefreshControl, Image, Keyboard, FlatList, Pressable, Alert, Share, Modal, KeyboardAvoidingView, TextInput, Platform, TouchableOpacity } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from "@expo/vector-icons/Feather"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { useNavigation } from '@react-navigation/native';
import { MentionInput, onSuggestionPress } from 'react-native-controlled-mentions'
import Lightbox from 'react-native-lightbox-v2';

import { getComments, handleCommentLike, postComment, uploadToCDN } from '../handlers';
import { findTimeAgo, findTimeAgoShort } from '../utils';
import styles from "./styles";
import AppleRow from './AppleRow';
import { getReplies, addReply } from '../handlers/replies';
import { searchUsers } from '../handlers/search';
import { pickImage } from '../imagepicker';


export const SwipeableRow = ({ item, setParentCommentID, addCommentRef, showRepliesID, setReplyingToUsername, setCommentText }) => {
  if (item.isAuthor) {
      return (
        <AppleRow comment_id={item.comment_id} reply_id={item.reply_id}>
          <Comment 
            data={item} 
            setParentCommentID={setParentCommentID} //for setting replyingTo
            addCommentRef={addCommentRef} //for focusing the keyboard
            showRepliesID={showRepliesID} //when redirected from notifications we want to auto open the replies
            setReplyingToUsername={setReplyingToUsername} //for setting replyingToUsername
            setCommentText={setCommentText} //for auto tagging users when reply is clicked
          />
        </AppleRow>
      );
    } else {
      return (
        <Comment 
          data={item} 
          setParentCommentID={setParentCommentID} 
          addCommentRef={addCommentRef}
          showRepliesID={showRepliesID} 
          setReplyingToUsername={setReplyingToUsername}
          setCommentText={setCommentText}
        />
      )
  }
};




const Comment = ({ data, setParentCommentID, addCommentRef, showRepliesID, setReplyingToUsername, setCommentText }) => {
    const [showReplies, setShowReplies] = useState(data.comment_id && (showRepliesID == data.comment_id))
    const [replies, setReplies] = useState([])
    const [isLiked, setIsLiked] = useState()
    const [numOfLikes, setNumOfLikes] = useState()
    const navigation = useNavigation()

    useEffect(() => {
      if (showReplies) {
        fetchReplies()
      }

      setIsLiked(data.isLiked)
      setNumOfLikes(data.numberof_likes)
    }, [data])



    async function handleReply() {
      if (!showReplies && data.reply_count > 0) {
        await fetchReplies()
        setShowReplies(previousState => !previousState);
      }

      setParentCommentID(data.comment_id || data.parent_comment_id)
      setReplyingToUsername(data.author)
      setCommentText(`@[${data.author}](!) `)
      addCommentRef.current.focus()
    }

    async function handleUserClick(username) {
        navigation.replace("Ping", {post_id: data.post_id}); 
        navigation.push("UserProfile", {username: username})
    }
    
    async function handleLikePress() {
      if (isLiked) {
        setNumOfLikes(Math.max(0, numOfLikes - 1))
      } else {
        setNumOfLikes(numOfLikes + 1)
      }
      
      const newLiked = (!isLiked)
      setIsLiked(newLiked)
      await handleCommentLike({comment_id: data.comment_id || data.parent_comment_id, endpoint: newLiked ? "like" : "unlike", reply_id: data.reply_id})
    }

    async function fetchReplies() {
        const fetchedReplies = await getReplies(data.comment_id)
        console.log("Fetched", fetchedReplies.length, "replies. First entry:", fetchedReplies)
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
        <View style={{ marginVertical: 10, width: "100%", flexDirection: "row", paddingLeft: data.reply_id ? 0 : 10, paddingRight: data.reply_id ? 0 : 20, minHeight: 30, flex: 1, alignItems: "flex-start" }}>
          <Pressable onPress={() => handleUserClick(data.author)} style={{flex: 0.15, justifyContent: 'center', alignItems: 'center'}}>
            
            <Image
                style={styles.tinyLogo}
                source={{uri: data.pfp_url}}
              />
          </Pressable>
      
          <View style={{ flexDirection: "column", marginLeft: 10, flex: 1 }}>
              <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                <View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity onPress={() => handleUserClick(data.author)}>
                      <Text style={{color: 'white', fontSize: 12}}>{data.author}</Text>
                    </TouchableOpacity>

                    <Text style={styles.commentTime}>{findTimeAgoShort((data.created_at))}</Text>

                  </View>
          

                  <Text style={[styles.text, {maxWidth: 200, marginVertical: 4, alignItems: "center"}]}>
                        {parseText(data.content)}
                  </Text>

                  { data.image_url && (
                      <Lightbox navigator={navigation} activeProps={{style: styles.fullscreenImage}}>

                        <Image
                          style={styles.attatchment}
                          source={{ uri: data.image_url }}
                        />

                      </Lightbox>
                  )}
                </View>

                <Pressable style={{marginTop: 10, alignItems: 'center'}} onPress={handleLikePress}>
                  <Ionicons style={[{color: isLiked ? "red" : "white"}]} name={isLiked ? "heart" : "heart-outline"} size={18}></Ionicons>
                  <Text style={{color: "white", marginTop: 2}}>{numOfLikes}</Text>
                </Pressable>
      
              </View>

               
           
            
              <View style={{flexDirection: 'row', marginBottom: showReplies ? 10 : 0}}>
                  <TouchableOpacity onPress={handleReply}>
                      <Text style={styles.reply}>Reply</Text>
                  </TouchableOpacity>

                  { data.reply_count > 0 && !data.reply_id && (
                    <Text style={{color: "gray", marginLeft: 10}} onPress={() => {setShowReplies(previousState => !previousState); fetchReplies()}}>{showReplies ? "Hide" : "View " + data.reply_count} replies</Text>
                  )}
              </View>
              

              {showReplies && replies.map(reply => (
                    <View key={reply.reply_id}>
                        <SwipeableRow 
                          item={reply} 
                          setParentCommentID={setParentCommentID} 
                          addCommentRef={addCommentRef} 
                          setReplyingToUsername={setReplyingToUsername}
                          setCommentText={setCommentText}
                        />
                    </View>
              ))}
          </View>
 
        </View>
      )}
  

export const Comments = ({ headerComponent, post_id, scrollToCommentID, showReplies }) => {
    const [comments, setComments] = useState([])
    const [commentText, setCommentText] = useState("")
    const [parentCommentID, setParentCommentID] = useState()
    const [replyingToUsername, setReplyingToUsername] = useState()
    const addCommentRef = useRef()
    const flatlist_ref = useRef()
    const navigation = useNavigation()


    const [refreshing, setRefreshing] = useState()

    const onRefresh = useCallback(async() => {
      await fetchComments()
    }, []);


    function scrollToComment(comment_id) {
      const index = comments.findIndex(comment => parseInt(comment.comment_id) === parseInt(comment_id));
      console.log(index)
      if (index !== -1) {
        flatlist_ref.current?.scrollToIndex({ index, animated: true });
      }
      
    }

    async function fetchComments() {
      setRefreshing(true);

      const fetchedComments = await getComments(post_id)
      setComments(fetchedComments)

      console.log("Fetched", fetchedComments?.length, "comments. First entry: ", fetchedComments[0])

      setRefreshing(false)
    }

    useEffect(() => {
      fetchComments()
    }, []);

    useEffect(() => {
      if (scrollToCommentID) {
        scrollToComment(scrollToCommentID)
      }
    }, [comments])




    function clearInput() {
        setImage(null)
        setCommentText("")
    }

    async function handlePostClick() {
        if (commentText.trim()) {
          setRefreshing(true)
          clearInput()

          let uploadedImage;

          if (image) {
            uploadedImage = await uploadToCDN(image)
          }

          Keyboard.dismiss()
          
          if (parentCommentID) { //this means it is a Reply
            await addReply({ post_id: post_id, content: commentText.trim(), comment_id: parentCommentID, image_url: uploadedImage?.url})
          } else {
            await postComment({post_id: post_id, content: commentText.trim(), image_url: uploadedImage?.url})
          }
    
          await fetchComments()

          if (parentCommentID) {
            scrollToComment(parentCommentID)
            setParentCommentID(null)
          }

          setRefreshing(false)
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
                      <View style={{marginLeft: 5,}}>
                          <Text style={{ color: "white", fontWeight: "600", fontSize: 14 }}>{suggestion.display_name}</Text>
                          <Text style={{ color: "white", fontSize: 12 }}>{suggestion.name}</Text>
                      </View>
                  </View>
                  
                  {index < suggestions.length - 1 && <View style={styles.item_seperator} />}
  
              </Pressable>
            ))
          }
        </View>
      );
    };
  


    const [image, setImage] = useState()

    const handleImageSelect = (fetchedImage) => {
      if (!fetchedImage.canceled) {
        setImage(fetchedImage)
      }
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
                    setImage={setImage}
                    showRepliesID={showReplies ? scrollToCommentID : null}
                    setReplyingToUsername={setReplyingToUsername}
                    setCommentText={setCommentText}
                  />}
                  keyExtractor={(item) => item.comment_id}
                  refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={refreshing} tintColor={"white"} />}
                  ListHeaderComponent={headerComponent}
                  contentContainerStyle={{paddingBottom: 250}}
                  onScrollToIndexFailed={(error) => {
                    flatlist_ref.current?.scrollToOffset({ offset: error.averageItemLength * error.index, animated: true });
                    setTimeout(() => {
                      if (comments.length !== 0 && flatlist_ref !== null) {
                        flatlist_ref.current?.scrollToIndex({ index: error.index, animated: true });
                      }
                    }, 100);
                  }}
            />



            <KeyboardAvoidingView keyboardVerticalOffset={100} behavior={Platform.OS === 'ios' ? 'position' : 'height'}>
              <View style={{flexDirection: 'row', alignItems: "flex-end", backgroundColor: 'rgb(22, 23, 24)' , paddingVertical: 20}}>
                    <View style={{width: "75%", paddingLeft: 20}}>

                    {parentCommentID && (
                          <View style={{justifyContent: 'space-between', flexDirection: "row", paddingBottom: 10}}>
                            <Text style={{color: "gray", marginLeft: 5}}>Replying to {replyingToUsername}</Text>
      
                            <TouchableOpacity onPress={() => setParentCommentID(null)}>
                                <Feather name="x" size={12} color="gray" />
                            </TouchableOpacity>
                          </View>
                        )}
                        
                      {image && (
                          <View style={[styles.attatchment, {marginBottom: 20}]}>
                              <Lightbox navigator={navigation} activeProps={{style: styles.fullscreenImage}}>
                                  <Image source={{ uri: image.uri || image.assets[0].uri }} style={styles.attatchment} />
                              </Lightbox>
                              
                              <Pressable onPress={() => setImage(null)} style={{position: "absolute", right: -10, top: -5}} >
                                <MaterialIcons name="cancel" size={32} color="gray" />
                              </Pressable>

                          </View>
                        )}
      
                        <MentionInput
                            inputRef={addCommentRef}
                            value={commentText}
                            onChange={text => setCommentText(text.trim())}
                            placeholder='Add a comment'
                            placeholderTextColor="lightgray" 
                            style={{ color: "white", borderRadius: 10, borderWidth: 1, borderColor: "gray",  padding: 10, minHeight: 30, width: "95%" }} 
                            partTypes={[
                              {
                                trigger: '@',
                                renderSuggestions,
                                textStyle: {fontWeight: 'bold', color: 'rgb(125, 175, 255)'},
                              },
                            ]}
                        />
                    </View>
                    
                    <TouchableOpacity style={{marginBottom: 6}} onPress={() => {pickImage(handleImageSelect)}}>
                        <Ionicons name="image-outline" size={28} color={"white"} />
                    </TouchableOpacity>

                    <Pressable onPress={handlePostClick} style={{ marginBottom: 5, alignItems: 'center', backgroundColor:  commentText.length > 0 ? "rgb(47, 139, 128)" : "gray", borderRadius: 30, width: 40, height: 30, justifyContent: "center", marginLeft: 10 }}>
                      <Ionicons style={styles.text} name="arrow-up" size={20}></Ionicons>
                    </Pressable>
                </View>
                  
            </KeyboardAvoidingView>
      </View>
      
    )
}