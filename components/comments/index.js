import React, { useEffect, useState, useRef } from 'react';
import { Text, View, Animated, Image, Keyboard, FlatList, Pressable, Alert, Share, Modal, KeyboardAvoidingView, TextInput, Platform, TouchableOpacity } from 'react-native'

import { getComments, postComment } from '../handlers';
import { findTimeAgo } from '../utils';
import styles from "./styles";
import SwipeModal from '@birdwingo/react-native-swipe-modal';
import AppleRow from './AppleRow';
import { getReplies } from '../handlers/replies';
import { useNavigation } from '@react-navigation/native';

export const SwipeableRow = ({ item, setParentCommentID, addCommentRef }) => {
  if (item.isAuthor) {
      return (
        <AppleRow comment_id={item.comment_id} reply_id={item.reply_id}>
          <Comment data={item} setParentCommentID={setParentCommentID} addCommentRef={addCommentRef} />
        </AppleRow>
      );
    } else {
      return <Comment data={item} setParentCommentID={setParentCommentID} addCommentRef={addCommentRef} />
  }
};


const Comment = ({ data, setParentCommentID, addCommentRef }) => {
    const [showReplies, setShowReplies] = useState(false)
    const [replies, setReplies] = useState([])
    const navigation = useNavigation()

    useEffect(() => {
      setShowReplies(false)
    }, [data])

    async function handleReply() {
      if (!showReplies && data.reply_count > 0) {
        await fetchReplies()
      }

      setParentCommentID(data.comment_id)
      addCommentRef.current.focus()
    }

    async function handleUserClick() {
        navigation.goBack(); 
        navigation.navigate("Ping", {post_id: data.post_id}); 
        navigation.push("UserProfile", {username: data.author})
    }

    const fetchReplies = async () => {
      if (!showReplies) {
        const fetchedReplies = await getReplies(data.comment_id)
        setReplies(fetchedReplies);
      }
      setShowReplies(previousState => !previousState);
    };

    return (
        <View style={{ marginVertical: 10, width: "95%", flexDirection: "row", paddingHorizontal: 10, minHeight: 30, flex: 1, alignItems: "flex-start" }}>
          <Pressable onPress={handleUserClick} style={{flex: 0.15, justifyContent: 'center', alignItems: 'center'}}>
            <Image
                style={styles.tinyLogo}
                source={{uri: data.pfp_url}}
              />
          </Pressable>
      
          <View style={{ flexDirection: "column", marginLeft: 10, flex: 1 }}>
              <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                <TouchableOpacity onPress={handleUserClick}>
                  <Text style={{color: 'white', fontSize: 12}}>{data.author}</Text>
                </TouchableOpacity>
                <Text style={styles.commentTime}>{!data.reply_id ? findTimeAgo((data.created_at)) : null}</Text>
              </View>
            
              <Text style={[styles.text, {maxWidth: 200, marginVertical: 4}]}>{data.content}</Text>

              <View style={{flexDirection: 'row', marginBottom: showReplies ? 10 : 0}}>
                { !data.reply_id && (
                  <TouchableOpacity onPress={handleReply}>
                      <Text style={styles.reply}>Reply</Text>
                  </TouchableOpacity>
                )}

                { data.reply_count > 0 && !data.reply_id && (
                  <Text style={{color: "gray", marginLeft: 10}} onPress={fetchReplies}>{showReplies ? "Hide" : "View " + data.reply_count} replies</Text>
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
  
