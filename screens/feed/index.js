import React, { useState, useRef } from 'react'
import { Text, View, TextInput, Pressable, FlatList, Image, Animated, Modal, Keyboard, KeyboardAvoidingView, Share, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from '@react-navigation/native';
import GestureRecognizer from 'react-native-swipe-gestures';

import styles from "./styles";


const examplePing = {postURL: "posturl", isLiked: true, attatchment: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Glazed-Donut.jpg/1200px-Glazed-Donut.jpg", author: 'GrantHough', likes: 20, comments: 30, caption: 'Funny Caption. Hilarious even. My name is Grant Hough and I love dogs!', pfp: 'https://cdn.discordapp.com/attachments/803748247402184714/822541056436207657/kobe_b.PNG?ex=658f138d&is=657c9e8d&hm=37b45449720e87fa714d5a991c90f7fac4abb55f6de14f63253cdbf2da0dd7a4&'}
const exampleComment = {isLiked: true, timeAgo: "3h", author: 'GrantHough', content: "Funny ass comment", likes: 20, pfp: "https://cdn.discordapp.com/attachments/803748247402184714/822541056436207657/kobe_b.PNG?ex=658f138d&is=657c9e8d&hm=37b45449720e87fa714d5a991c90f7fac4abb55f6de14f63253cdbf2da0dd7a4&"}
const data = new Array(6).fill(examplePing);
const commentData = new Array(20).fill(exampleComment);



export default function Feed({ route, navigation }) {
    const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
    const [scrollY] = useState(new Animated.Value(0));
    const [feedType, setFeedType] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [comment, onChangeComment] = useState('');
    const [replyingTo, setReplyingTo] = useState(null) 
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



    const Ping = ({data}) => (
      <View style={{marginVertical: 10, width: "95%", flexDirection: "row", padding: 10}}>
        <View style={{flexDirection: "col"}}>
          <Image
            style={styles.tinyLogo}
            source={{uri: data.pfp}}
          />

          <View style={styles.verticalLine} />
        </View>

        <View style={{marginLeft: 10}}>
          <Text style={styles.author}>{data.author}</Text>
          <Text style={styles.text}>{data.caption}</Text>

          <Image
            style={[styles.attatchment, {display: data.attatchment ? "flex" : "none"}]}
            source={{uri: data.attatchment}}
            resizeMode='contain'
          />

          <View style={{flexDirection: "row", marginVertical: 5}}>
            <Pressable onPress={() => handleLike(data)}>
              <Ionicons style={[styles.pingIcon, {color: data.isLiked ? "red" : "white"}]} name={data.isLiked ? "heart" : "heart-outline"} size={20}></Ionicons>
            </Pressable>

            <Pressable onPress={() => setModalVisible(true)}>
              <Ionicons style={styles.pingIcon} name="chatbubble-outline" size={20}></Ionicons>
            </Pressable>

            <Pressable onPress={() => handleShare(data.postURL)}>
              <Ionicons style={styles.pingIcon} name="share-social-outline" size={20}></Ionicons>
            </Pressable>

            <Pressable>
              <Ionicons style={styles.pingIcon} name="paper-plane-outline" size={20}></Ionicons>
            </Pressable>
          </View>

          <Text style={styles.stats}>{data.likes} Likes • {data.comments} Replies</Text>
        </View>
      </View>
    );
    

    const Comment = ({data}) => (
      <View style={styles.commentContainer}>
        <View style={{flex: 0.3}}>
          <Image
              style={styles.tinyLogo}
              source={{uri: data.pfp}}
            />
        </View>

        <View style={styles.commentTextContainer}>
          <View style={{flexDirection: "row"}}>
            <Text style={styles.commentContent}>{data.author}</Text>
            <Text style={styles.commentTime}>3h</Text>
          </View>

          <View>
            <Text style={styles.text}>{data.content}</Text>
          </View>

          <View>
            <Pressable onPress={() => handleReply(data)}>
              <Text style={styles.reply}>Reply</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.likeContainer}>
            <Pressable onPress={() => handleCommentLike(data)}>
              <Ionicons style={[styles.pingIcon, {color: data.isLiked ? "red" : "white"}]} name={data.isLiked ? "heart" : "heart-outline"} size={20}></Ionicons>
            </Pressable>
        </View>
      </View>
    )
  
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
                  data={data}
                  renderItem={({item}) => <Ping data={item} />}
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
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}>

            <View style={styles.modalContainer}>
              <Pressable onPress={() => setModalVisible(false)} style={styles.modalHeader}>
                <View style={styles.modalDismissBar} />

                <View style={{marginVertical: 10}}>
                  <Text style={{color: "white"}}>Comments</Text>
                </View>

                <View style={styles.item_seperator} />

              </Pressable>
             
              <View style={{flex: 1}}>
                <FlatList
                  data={commentData}
                  renderItem={({item}) => <Comment data={item} />}
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
                      value={comment} 
                      placeholder='Add a comment'
                      ref={ref_input}  
                    />
                  </View>
                 
                  <View style={styles.addCommentButton}>
                    <Pressable onPress={postComment}>
                      <Ionicons style={styles.text} name="arrow-up" size={20}></Ionicons>
                    </Pressable>
                  </View>
                </View>
              </KeyboardAvoidingView>
            </View>
          </Modal>

          {/* </GestureRecognizer> */}
        </SafeAreaView>
    )
}