import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Text, View, TextInput, Pressable, FlatList, Image, Animated, Modal, Keyboard, RefreshControl, Share, Alert, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from '@react-navigation/native';

import { getUser, getPings, getFollowingPings, handleLike, postComment } from "../../components/handlers";
import { abbreviate } from '../../components/utils';
import { CommentModal } from '../../components/comments';
import { Ping } from "../../components/pings";
import styles from "./styles";



export default function Feed() {
    const navigation = useNavigation()

    const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
    const scrollY = useRef(new Animated.Value(0)).current;
    
    const [dropdownData, setDropdownData] = useState([])
    const [feedType, setFeedType] = useState("college");
    const [isFocus, setIsFocus] = useState(false)

    const [refreshing, setRefreshing] = useState(false);

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


    const onScroll = Animated.event(
      [{ nativeEvent: { contentOffset: { y: scrollY } } }],
      { useNativeDriver: false }
    );
  

    async function fetchPings(type) {
      const user = await getUser();
      setUser(user)

      let fetchedPings = []
      if (type == "college") {
        console.log("fetching College")
        fetchedPings = await getPings(user);
      } else if (type == "friends") {
        fetchedPings = await getFollowingPings();
      } else {
        throw new Error("Type not defined in Feed")
      }

      setPings(fetchedPings);
  
      setDropdownData([
        { label: 'Friends', value: 'friends' },
        { label: abbreviate(user.college), value: 'college' },
      ]);

    }
  
    async function feedChange(type) {
      console.log("Feed was changed to" + type)
      setFeedType(type)

      setRefreshing(true);
      await fetchPings(type)
      setRefreshing(false)    }


    const onRefresh = useCallback(async() => {
      setRefreshing(true);
      await fetchPings(feedType)
      setRefreshing(false)
    }, []);


    useEffect(() => {
      fetchPings(feedType);
    }, []); 
 
  



    if (!user || !pings) {
      return (
        <View style={[styles.container, {justifyContent: "center", alignItems: "center"}]}>
            <ActivityIndicator />
        </View>
      )

    }
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
                        placeholderStyle={[styles.text, {fontWeight: "bold", fontSize: 24}]}
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
                        <Ionicons name="notifications-outline" size={24} color="white" />
                    </Pressable>
                  </View>

                </View>
              </Animated.View>
            


              <AnimatedFlatList
                    style={{paddingHorizontal: 20}}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    data={pings}
                    renderItem={({item}) => 
                      <Ping 
                        data={item} 
                        navigation={navigation}
                      />
                    }
                    ItemSeparatorComponent={() => <View style={styles.item_seperator}/>}
                    onScroll={onScroll}
                />
            {/* <GestureRecognizer
              style={{flex: 1}}
              onSwipeDown={ () => setModalVisible(false) }
            > */}
              {/* <CommentModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                onChangeComment={onChangeComment}
                commentText={commentText}
                postComment={postComment}
                ref_input={ref_input}
                handleReply={handleReply}
                commentPing={commentPing}
                setCommentPing={setCommentPing}
              /> */}

            {/* </GestureRecognizer> */}
          </SafeAreaView>
        )
    }
