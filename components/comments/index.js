import React, { useEffect, useState, useRef } from 'react';
import { Text, View, Animated, Image, Keyboard, FlatList, Pressable, Alert, Share, Modal, KeyboardAvoidingView, TextInput, Platform } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';

import { getComments, postComment } from '../handlers';
import { findTimeAgo } from '../utils';
import styles from "./styles";
import SwipeModal from '@birdwingo/react-native-swipe-modal';
import AppleRow from './AppleRow';


const SwipeableRow = ({ item, handleReply }) => {
  if (item.isAuthor) {
      return (
        <AppleRow comment_id={item.comment_id}>
          <Comment data={item} handleReply={handleReply} />
        </AppleRow>
      );
    } else {
      return <Comment data={item} handleReply={handleReply} />
  }
};


export const Comment = ({data, handleReply}) => (
    <View style={styles.commentContainer}>
      <View style={{flex: 0.15, justifyContent: 'center', alignItems: 'center'}}>
        <Image
            style={styles.tinyLogo}
            source={{uri: data.pfp_url}}
          />
      </View>
  
      <View style={styles.commentTextContainer}>
          <View style={{flexDirection: "row", justifyContent: "space-between"}}>
            <Text style={styles.commentContent}>{data.author}</Text>
            <Text style={styles.commentTime}>{findTimeAgo((data.created_at))}</Text>
          </View>
        
          <Text style={[styles.text, {maxWidth: 200}]}>{data.content}</Text>

  
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
  )
  

  export const NewCommentModal = ({modalRef, commentPing}) => {
    const [commentText, onChangeCommentText] = useState("")
    const [comments, setComments] = useState([])
    const ref_input = useRef();

    async function fetchComments() {
      const fetchedComments = await getComments(commentPing)
      setComments(fetchedComments)
    }


    async function handlePostClick() {
      await postComment(commentPing, commentText)
      Keyboard.dismiss()
      onChangeCommentText("")
      await fetchComments()
    }

    async function fetchComments() {
      const fetchedComments = await getComments(commentPing)
      setComments(fetchedComments)
    }

    useEffect(() => {
      if (commentPing) {
        fetchComments()
      }
    }, [commentPing]); 
 
    const footer = (
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}  style={{backgroundColor: "rgb(22, 23, 24)", marginBottom: 30}}>
          <View style={styles.item_seperator} />

          <View style={styles.addCommentContainer}>
              <View style={{flexDirection: "row", flex: 2}}>
                <TextInput 
                  placeholderTextColor="white" 
                  style={styles.addCommentInput} 
                  onChangeText={onChangeCommentText} 
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
    )

    const header = (
      <Text style={{ color: "white", fontSize: 18, textAlign: "center" }}>Comments</Text>
    )

    return (
      <SwipeModal headerComponent={header} footerComponent={footer} ref={modalRef} bg='rgb(22, 23, 24)' barContainerStyle={{ backgroundColor: "rgb(22, 23, 24)" }} style={{ marginTop: 200 }}>
              <FlatList
                  data={comments}
                  renderItem={({ item }) => <SwipeableRow item={item} />}
                  keyExtractor={(item) => item.comment_id.toString()}
              />
      </SwipeModal>  
    )
  }





  // export const CommentModal = ({ping, modalVisible, setModalVisible}) => {
  //   const [comments, setComments] = useState(null)
  //   const [commentText, onChangeCommentText] = useState("")
  //   const [commentPing, setCommentPing] = useState(ping)
  //   const ref_input = useRef();

  //   async function fetchComments() {
  //       const fetchedComments = await getComments(ping)
  //       setComments(fetchedComments)
  //   }

  //   useEffect(() => {
  //     if (modalVisible) {
  //       console.log("LOADED")
  //       fetchComments();
  //     }
  //   }, [modalVisible]); 

  //   function handleModalClose() {
  //     setModalVisible(false);
  //   }

  //   async function handlePostClick() {
  //     console.log("posting comment")
  //     await postComment(ping, commentText)
  //     Keyboard.dismiss()
  //     onChangeCommentText("")
  //     await fetchComments()
  //   }


  //   function handleReply(data) {
  //     ref_input.current.focus()
  //     onChangeCommentText("@" + data.author + " ")
  //   }


  //   return (
  //     <Modal animationType="slide" transparent={true} visible={modalVisible}>
  //       <View style={styles.modalContainer}>
  //         <Pressable onPress={handleModalClose} style={styles.modalHeader}>
  //           <View style={styles.modalDismissBar} />
  
  //           <View style={{marginVertical: 10}}>
  //             <Text style={{color: "white"}}>Comments</Text>
  //           </View>
  
  //           <View style={styles.item_seperator} />
  
  //         </Pressable>
        
  //         <View style={{flex: 1}}>
  //           <FlatList
  //             data={comments}
  //             // renderItem={({item}) => <Comment data={item} handleReply={handleReply}/>}
  //             renderItem={({ item, index }) => (
  //               <SwipeableRow item={item} />
  //             )}
  //           />
  //         </View>
  
  //         <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={80}  style={{flex: 0.1, marginBottom: 30}}>
  //           <View style={styles.item_seperator} />
  
  //           <View style={styles.addCommentContainer}>
  //             <View style={{flexDirection: "row", flex: 2}}>
  //               {/* <Image
  //                 style={styles.tinyLogo}
  //                 source={{uri: data.pfp_url}}
  //               /> */}
  
  //               <TextInput 
  //                 placeholderTextColor="white" 
  //                 style={styles.addCommentInput} 
  //                 onChangeText={onChangeCommentText} 
  //                 value={commentText} 
  //                 placeholder='Add a comment'
  //                 ref={ref_input}  
  //               />
  //             </View>
            
  //             <Pressable onPress={handlePostClick} style={styles.addCommentButton}>
  //               <Ionicons style={styles.text} name="arrow-up" size={20}></Ionicons>
  //             </Pressable>
  //           </View>
  //         </KeyboardAvoidingView>
  //       </View>
  //   </Modal>
  //   )
  // }
  