import React, { useEffect, useState, useCallback } from 'react';
import { Text, View, Animated, Image, Keyboard, FlatList, Pressable, SafeAreaView, Share, Modal, KeyboardAvoidingView, TextInput, Platform } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';

import { getComments, postComment } from '../../components/handlers';
import { SwipeableRow } from '../../components/comments';
import styles from "./styles";
import { RefreshControl } from 'react-native-gesture-handler';


export default function Comments({ route }) {
    const [commentText, onChangeCommentText] = useState("")
    const [comments, setComments] = useState([])

    const [refreshing, setRefreshing] = useState(false)


    async function handlePostClick() {
      await postComment(route.params?.post_id, commentText)
      Keyboard.dismiss()
      onChangeCommentText("")
      await fetchComments()
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
                    renderItem={({ item }) => <SwipeableRow item={item} />}
                    keyExtractor={(item) => item.comment_id}
                    refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={refreshing} />}
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





  