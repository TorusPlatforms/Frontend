import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Text, View, TextInput, Pressable, FlatList, Image, Animated, Modal, Keyboard, RefreshControl, Share, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from '@react-navigation/native';
import GestureRecognizer from 'react-native-swipe-gestures';

import { getUser, getPings, handleLike, handleShare, postComment } from "../../components/handlers";
import { CommentModal } from '../../components/comments';
import { Ping } from "../../components/pings";
import styles from "./styles";


// const exampleComment = {isLiked: true, timeAgo: "3h", author: 'GrantHough', content: "Funny ass comment", likes: 20, pfp: "https://cdn.discordapp.com/attachments/803748247402184714/822541056436207657/kobe_b.PNG?ex=658f138d&is=657c9e8d&hm=37b45449720e87fa714d5a991c90f7fac4abb55f6de14f63253cdbf2da0dd7a4&"}
// const commentData = new Array(20).fill(exampleComment);


export default function Feed() {
    const navigation = useNavigation()
    const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
    const [scrollY] = useState(new Animated.Value(0));
    const [feedType, setFeedType] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [commentText, onChangeComment] = useState('');
    const [replyingTo, setReplyingTo] = useState(null) 
    const [user, setUser] = useState(null)
    const [pings, setPings] = useState(null)
    const [dropdownData, setDropdownData] = useState([])
    const [refreshing, setRefreshing] = useState(false);
    const [commentPing, setCommentPing] = useState(null)

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

    function abbreviate(inputString) {
      const phrases = inputString.split(', ');
    
      const abbreviation = phrases
        .map(phrase => {
          const words = phrase.split(' ');
          const abbreviatedWords = words
            .map(word => {
              const capitalizedWord = word.replace(/[^A-Z]/g, ''); // Keep only capital letters
              return capitalizedWord;
            })
            .join('');
          return abbreviatedWords;
        })
        .join('-');
    
      return abbreviation.toUpperCase();
    }

 
    const updateLike = useCallback(() => {
      fetchPings()
    }, []);

    async function fetchPings() {
      const user = await getUser();
      const fetchedPings = await getPings(user);
      setPings(fetchedPings);
  
      setDropdownData([
        { label: 'Friends', value: 'friends' },
        { label: abbreviate(user.college), value: 'college' },
      ]);
    }
  
    function feedChange(type) {
      console.log("Feed was changed to" + type)
      setFeedType(type)
    }

    function handleReply(data) {
      ref_input.current.focus()
      setReplyingTo(data.author)
      onChangeComment("@" + data.author + " ")
    }

    const onRefresh = useCallback(async() => {
      setRefreshing(true);
      await fetchPings()
      setRefreshing(false)
    }, []);


    useEffect(() => {
      fetchPings();
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
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                  style={{paddingHorizontal: 20}}
                  data={pings}
                  renderItem={({item}) => 
                    <Ping 
                      data={item} 
                      setModalVisible={setModalVisible} 
                      handleLike={() => handleLike(item, updateLike)} 
                      handleComment={() => setCommentPing(item)} handleShare={handleShare}
                      navigation={navigation}
                    />
                  }
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
              onChangeComment={onChangeComment}
              commentText={commentText}
              postComment={postComment}
              ref_input={ref_input}
              handleReply={handleReply}
              commentPing={commentPing}
              setCommentPing={setCommentPing}
            />

          {/* </GestureRecognizer> */}
        </SafeAreaView>
    )
}
