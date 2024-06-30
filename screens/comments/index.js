import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Text, View, Animated, Image, Keyboard, FlatList, Pressable, SafeAreaView, Share, TouchableOpacity, KeyboardAvoidingView, TextInput, Platform } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from "@expo/vector-icons/Feather"

import { getComments, postComment } from '../../components/handlers';
import { SwipeableRow } from '../../components/comments';
import styles from "./styles";
import { RefreshControl } from 'react-native-gesture-handler';
import { addReply } from '../../components/handlers/replies';


export default function Comments({ route }) {
    const [commentText, onChangeCommentText] = useState("")
    const [comments, setComments] = useState([])
    
    const [parentCommentID, setParentCommentID] = useState(null)
    const addCommentRef = useRef()

    const [refreshing, setRefreshing] = useState(false)

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

    async function fetchComments() {
      setRefreshing(true);

      const fetchedComments = await getComments(route.params?.post_id)
      setComments(fetchedComments)

      setRefreshing(false)
    }

    const onRefresh = useCallback(async() => {
      await fetchComments()
    }, []);


    useEffect(() => {
      if (route.params?.post_id) {
        fetchComments()
      }
    }, [route.params]); 


    return (
      <SafeAreaView style={styles.container}>
              <FlatList
                    data={comments}
                    renderItem={({ item }) => <SwipeableRow item={item} setParentCommentID={setParentCommentID} addCommentRef={addCommentRef} />}
                    keyExtractor={(item) => item.comment_id}
                    refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={refreshing} />}
                />


              <KeyboardAvoidingView keyboardVerticalOffset={100} behavior={Platform.OS === 'ios' ? 'position' : 'height'}>
              <View style={{flexDirection: 'row', alignItems: "center", backgroundColor: 'rgb(22, 23, 24)' , paddingVertical: 20}}>
                    <View style={{width: "75%", paddingLeft: 20}}>
                        {parentCommentID && (
                          <View style={{justifyContent: 'space-between', flexDirection: "row", paddingBottom: 10}}>
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
                              style={{ color: "white", borderRadius: 10, borderWidth: 1, borderColor: "gray",  padding: 10, minHeight: 30  }} 
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
        </SafeAreaView>
    )
}





  