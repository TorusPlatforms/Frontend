import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Text, View, TextInput, Pressable, FlatList, Image, Animated, Modal, Keyboard, RefreshControl, Share, Alert, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from '@react-navigation/native';
import GestureRecognizer from 'react-native-swipe-gestures';

import { getUser, getPings, handleLike, handleShare, postComment } from "../../components/handlers";
import { abbreviate } from '../../components/utils';
import { CommentModal } from '../../components/comments';
import { Ping } from "../../components/pings";
import styles from "./styles";



export default function Feed() {
    const navigation = useNavigation()

    const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
    const [scrollY] = useState(new Animated.Value(0));
    
    const [dropdownData, setDropdownData] = useState([])
    const [feedType, setFeedType] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [commentText, onChangeComment] = useState('');
    const ref_input = useRef();
    const [replyingTo, setReplyingTo] = useState(null) 
    const [commentPing, setCommentPing] = useState(null)

    const [refreshing, setRefreshing] = useState(false);
    const scrollRef = useRef()

    const [user, setUser] = useState(null)
    const [pings, setPings] = useState(null)



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


    function onScroll() {
      Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: false }
      ) 
      }


 
    const updateLike = useCallback(() => {
      fetchPings()
    }, []);

    async function fetchPings() {
      const user = await getUser();
      setUser(user)

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


    function onContentSizeChange() {
      scrollRef.current?.scrollToOffset({ offset: scrollY.__getValue(), animated: false });
    };


    useEffect(() => {
      fetchPings();
    }, []); 
 

    if (!user || !pings) {
      return (
        <View style={[styles.container, {justifyContent: "center", alignItems: "center"}]}>
            <ActivityIndicator />
        </View>
      )

    } else {
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
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    ref={scrollRef}
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
                    onScroll={onScroll}
                    onContentSizeChange={onContentSizeChange}
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
}
