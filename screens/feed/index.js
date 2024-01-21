import React, { useState, useRef, useEffect } from 'react'
import { Text, View, TextInput, Pressable, FlatList, Image, Animated, Modal, Keyboard, KeyboardAvoidingView, Share, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from '@react-navigation/native';
import GestureRecognizer from 'react-native-swipe-gestures';

import { CommentModal } from '../../components/comments';
import { Ping } from "../../components/pings";
import styles from "./styles";


const exampleComment = {isLiked: true, timeAgo: "3h", author: 'GrantHough', content: "Funny ass comment", likes: 20, pfp: "https://cdn.discordapp.com/attachments/803748247402184714/822541056436207657/kobe_b.PNG?ex=658f138d&is=657c9e8d&hm=37b45449720e87fa714d5a991c90f7fac4abb55f6de14f63253cdbf2da0dd7a4&"}
const commentData = new Array(20).fill(exampleComment);


export default function Feed({ route, navigation }) {
    const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
    const [scrollY] = useState(new Animated.Value(0));
    const [feedType, setFeedType] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [comment, onChangeComment] = useState('');
    const [replyingTo, setReplyingTo] = useState(null) 
    const [pings, setPings] = useState([])
    const ref_input = useRef();

    const headerHeight = scrollY.interpolate({
      inputRange: [0, 70],
      outputRange: [70, 0],
      extrapolate: 'clamp',
    })

    const headerOpacity = scrollY.interpolate({
      inputRange: [0, 70],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });


    function getPings() {
      const examplePingData = {
          postURL: "posturl",
          isLiked: true, 
          attatchment: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Glazed-Donut.jpg/1200px-Glazed-Donut.jpg", 
          author: 'GrantHough', 
          likes: 20, 
          comments: 30, 
          caption: 'Funny Caption. Hilarious even. My name is Grant Hough and I love dogs!', 
          pfp: 'https://cdn.discordapp.com/attachments/803748247402184714/822541056436207657/kobe_b.PNG?ex=658f138d&is=657c9e8d&hm=37b45449720e87fa714d5a991c90f7fac4abb55f6de14f63253cdbf2da0dd7a4&'
      }
      return new Array(6).fill(examplePingData)
    }


    function handleLike(data) {
      console.log("Liked a post!", data)
    }

    function handleCommentLike(data) {
      console.log("Liked a comment!", data)
    }

    function feedChange(type) {
      console.log("Feed was changed to" + type)
      setFeedType(type)
    }

    function postComment() {
      console.log("Posting comment", comment)
      onChangeComment("")
      Keyboard.dismiss()
    }

    function handleReply(data) {
      ref_input.current.focus()
      setReplyingTo(data.author)
      onChangeComment("@" + data.author + " ")
    }

    async function handleShare(postURL) {
        try {
          const result = await Share.share({
            url:postURL
          });

          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // shared with activity type of result.activityType
            } else {
              // shared
            }
          } else if (result.action === Share.dismissedAction) {
            // dismissed
          }
        } catch (error) {
          Alert.alert(error.message);
        }
    }



    const dropdownData = [
      { label: 'Friends', value: 'friends' },
      { label: 'College', value: 'college' },
    ];


    useEffect(() => {
      setPings(getPings())
    }, []);
    
  
    return (
      
        <SafeAreaView style={styles.container}>
          <Animated.View style={{height: headerHeight, opacity: headerOpacity}}>
              <View style={styles.header}>
                  <View style={{flex: 0.3}}>
                    <Dropdown
                      containerStyle={styles.dropdownContainer}
                      itemTextStyle={styles.text}
                      selectedTextStyle={[styles.text, {fontWeight: "bold"}]}
                      activeColor='rgb(22, 23, 24)'
                      data={dropdownData}
                      placeholder='Torus'
                      placeholderStyle={[styles.text, {fontWeight: "bold"}]}
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      value={feedType}
                      onFocus={() => setIsFocus(true)}
                      onBlur={() => setIsFocus(false)}
                      onChange={item => {
                        feedChange(item.value);
                        setIsFocus(false);
                      }}
                    />
                  </View>

                <View>
                  <Pressable onPress={() => navigation.navigate("Notifications")}>
                      <Ionicons name="ios-notifications-outline" size={24} color="white" />
                  </Pressable>
                </View>

              </View>
            </Animated.View>
          


            <AnimatedFlatList
                  style={{paddingHorizontal: 20}}
                  data={pings}
                  renderItem={({item}) => <Ping data={item} setModalVisible={setModalVisible} handleLike={handleLike} handleShare={handleShare} />}
                  ItemSeparatorComponent={() => <View style={styles.item_seperator}/>}
                  onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                  )}
                  scrollEventThrottle={16}
              />
          {/* <GestureRecognizer
            style={{flex: 1}}
            onSwipeDown={ () => setModalVisible(false) }
          > */}
            <CommentModal
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              commentData={commentData}
              onChangeComment={onChangeComment}
              comment={comment}
              postComment={postComment}
              ref_input={ref_input}
              handleCommentLike={handleCommentLike}
              handleReply={handleReply}
            />

          {/* </GestureRecognizer> */}
        </SafeAreaView>
    )
}
