import React, { useEffect, useState } from 'react';
import { Text, View, SafeAreaView, Image, Keyboard, FlatList, Pressable, Alert, Share, Modal, KeyboardAvoidingView, TextInput } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';

import { getComments } from '../handlers';
import { findTimeAgo } from '../utils';
import styles from "./styles";


const Comment = ({data, handleReply}) => (
    <View style={styles.commentContainer}>
      <View style={{flex: 0.15, justifyContent: 'center', alignItems: 'center'}}>
        <Image
            style={styles.tinyLogo}
            source={{uri: data.pfp_url}}
          />
      </View>
  
      <View style={styles.commentTextContainer}>
        <Text style={styles.commentContent}>{data.author}</Text>
  
        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
          <Text style={styles.text}>{data.content}</Text>

          <Text style={styles.commentTime}>{findTimeAgo(data.created_at)}</Text>
        </View>
  
        <View>
          <Pressable onPress={() => handleReply(data)}>
            <Text style={styles.reply}>Reply</Text>
          </Pressable>
        </View>
      </View>
  
      {/* <View style={styles.likeContainer}>
          <Pressable onPress={() => handleCommentLike(data)}>
            <Ionicons style={[styles.pingIcon, {color: data.isLiked ? "red" : "white"}]} name={data.isLiked ? "heart" : "heart-outline"} size={20}></Ionicons>
          </Pressable>
      </View> */}
    </View>
  )
  
  
  export const CommentModal = ({ modalVisible, setModalVisible, onChangeComment, commentText, postComment, ref_input, handleReply, commentPing, setCommentPing }) => {
    const [comments, setComments] = useState(null)

    async function fetchComments() {
      console.log("FETCHED", commentPing)
      if (commentPing) {
        const fetchedComments = await getComments(commentPing)
        setComments(fetchedComments)
        setModalVisible(true)
      }
    }

    useEffect(() => {
      fetchComments();
    }, [commentPing]); 

    function handleModalClose() {
      console.log("closed");
      setCommentPing(null);
      setModalVisible(!modalVisible);
    }

    async function handlePostClick() {
      await postComment(commentPing, commentText)
      Keyboard.dismiss()
      onChangeComment("")
      await fetchComments()
    }


    return (
    <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
    >
  
        <View style={styles.modalContainer}>
          <Pressable onPress={handleModalClose} style={styles.modalHeader}>
            <View style={styles.modalDismissBar} />
  
            <View style={{marginVertical: 10}}>
              <Text style={{color: "white"}}>Comments</Text>
            </View>
  
            <View style={styles.item_seperator} />
  
          </Pressable>
        
          <View style={{flex: 1}}>
            <FlatList
              data={comments}
              renderItem={({item}) => <Comment data={item} handleReply={handleReply}/>}
            />
          </View>
  
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={80}  style={{flex: 0.1, marginBottom: 30}}>
            <View style={styles.item_seperator} />
  
            <View style={styles.addCommentContainer}>
              <View style={{flexDirection: "row", flex: 2}}>
                <Image
                  style={styles.tinyLogo}
                  source={{uri: "https://cdn.discordapp.com/attachments/803748247402184714/822541056436207657/kobe_b.PNG?ex=658f138d&is=657c9e8d&hm=37b45449720e87fa714d5a991c90f7fac4abb55f6de14f63253cdbf2da0dd7a4  &"}}
                />
  
                <TextInput 
                  placeholderTextColor="white" 
                  style={styles.addCommentInput} 
                  onChangeText={onChangeComment} 
                  value={commentText} 
                  placeholder='Add a comment'
                  ref={ref_input}  
                />
              </View>
            
              <Pressable onPress={handlePostClick} style={styles.addCommentButton}>
                <Ionicons style={styles.text} name="arrow-up" size={20}></Ionicons>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </View>
    </Modal>
    )
  }
  