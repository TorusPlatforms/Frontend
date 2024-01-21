import React, { useState, useEffect, useRef} from 'react'
import { Text, View, SafeAreaView, Image, Animated, FlatList, Pressable, Alert, Share, ActivityIndicator } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Clipboard from 'expo-clipboard';
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";

import { CommentModal } from '../../components/comments';
import { Ping } from "../../components/pings";
import styles from "./styles";

const exampleComment = {isLiked: true, timeAgo: "3h", author: 'GrantHough', content: "Funny ass comment", likes: 20, pfp: "https://cdn.discordapp.com/attachments/803748247402184714/822541056436207657/kobe_b.PNG?ex=658f138d&is=657c9e8d&hm=37b45449720e87fa714d5a991c90f7fac4abb55f6de14f63253cdbf2da0dd7a4&"}
const commentData = new Array(20).fill(exampleComment);

export default function Profile() {
    const navigation = useNavigation()
    const movingLine = useRef(new Animated.Value(0)).current;
    const [loops, setLoops] = useState([])
    const [pings, setPings] = useState([])
    const [user, setUser] = useState(null)
    const [isFocus, setIsFocus] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [comment, onChangeComment] = useState('');
    const [replyingTo, setReplyingTo] = useState(null) 
    const ref_input = useRef();

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

    function getLoops() {
        const exampleLoopsData = {name: "Dorm", pfp: "https://icons.iconarchive.com/icons/graphicloads/100-flat/256/home-icon.png"}
        return new Array(6).fill(exampleLoopsData)
    }
    
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

    //handle getting user data
    async function getUser() {
        const exampleUserData = {
            profile_picture: "https://cdn.discordapp.com/attachments/803748247402184714/822541056436207657/kobe_b.PNG?ex=658f138d&is=657c9e8d&hm=37b45449720e87fa714d5a991c90f7fac4abb55f6de14f63253cdbf2da0dd7a4&",
            display_name: "Grant Hough",
            username: "@granthough",
            following_count: 128,
            follower_count: 259,
            bio: "A pretty funny guy. Has a strong affinity for dogs. \n Stefan Murphy: 'The test is in'"
        }


        const auth = getAuth()
        console.log(auth.currentUser.uid)
        const url = `https://backend-26ufgpn3sq-uc.a.run.app/api/user/id/${auth.currentUser.uid}`;
        console.log(url)
        const response = await fetch(url);
    
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const userData = await response.json();
        console.log('User Data:', userData);
     
        setUser(userData)
    }
   
    //handle getting loop notification
    function renderNotification(item, index) {
        //figure out if loop has a notification
        const unread = false

        if (unread) {
            return <View style={{width: 15, height: 15, borderRadius: 7.5, backgroundColor: 'red', bottom: 30, position: 'absolute', alignSelf: 'flex-end', zIndex: 1}}/>
        }
    };



    async function copyUsernameToClipboard() {
        await Clipboard.setStringAsync(user.username);
      };

    
    
    //ANIMATION 
    const symbolSize = 50;
    const radius = 125 
    const center = 125

    function degToRad(deg) {
        return deg * Math.PI / 180
    }

    const iconStyles = [
        {left: radius * Math.cos(degToRad(60)) + center - symbolSize / 2, bottom: radius * Math.sin(degToRad(60)) + center - symbolSize / 2}, 
        {left: radius * Math.cos(degToRad(120)) + center - symbolSize / 2, bottom: radius * Math.sin(degToRad(120)) + center - symbolSize / 2},
        {left: radius * Math.cos(degToRad(180)) + center - symbolSize / 2, bottom: radius * Math.sin(degToRad(180)) + center - symbolSize / 2},
        {left: radius * Math.cos(degToRad(240)) + center - symbolSize / 2, bottom: radius * Math.sin(degToRad(240)) + center - symbolSize / 2},
        {left: radius * Math.cos(degToRad(300)) + center - symbolSize / 2, bottom: radius * Math.sin(degToRad(300)) + center - symbolSize / 2},
        {left: radius * Math.cos(degToRad(360)) + center - symbolSize / 2, bottom: radius * Math.sin(degToRad(360)) + center - symbolSize / 2}
    ]
    
    const x = movingLine.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 60],
        });

    const y = movingLine.interpolate({
        inputRange: [0, 1],
        outputRange: [30, 50],
        });

 
    const lineStyles = [{top: 50, right: y, transform: [{rotate: "30deg"}]},  {top: 50, left: y, transform: [{rotate: "-30deg"}]},  {left: 85, transform: [{rotate: "90deg"}]},  {bottom: 50, left: y, transform: [{rotate: "30deg"}]}, {bottom: 50, right: y, transform: [{rotate: "-30deg"}]},   {right: 85, transform: [{rotate: "90deg"}]}]

    function renderLoops() {
        return loops.map((item, index) => {
        
          return (
            <View key={index} style={ [iconStyles[index], {justifyContent: "center", alignItems: "center", position: "absolute"}] }>
                  <Image
                      style={{
                            width: symbolSize,
                            height: symbolSize,
                            borderRadius: symbolSize / 2,
                            zIndex: 1
                      }}
                      source={{ uri: 'https://icons.iconarchive.com/icons/graphicloads/100-flat/256/home-icon.png' }} />

                  {renderNotification()}

                  <Animated.View style={[lineStyles[index], { backgroundColor: "gray", width: 2, height: x, position: "absolute"}]} />

              </View>
          );
        });
      }
     
    




    useEffect(() => {
        setLoops(getLoops())
        setPings(getPings())
        getUser()

        Animated.sequence([
        Animated.delay(300),
        Animated.timing(movingLine, {
            toValue: 1, // 1 represents the final angle
            duration: 1000,
            useNativeDriver: false
          })
        ]).start();
    
      }, [movingLine]);
    
    if (!user) {
        return <ActivityIndicator/>
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => navigation.navigate("Edit Profile")}>
                    <Ionicons name="ios-person-outline" size={24} color="white" />
                </Pressable>

                <Pressable onPress={() => navigation.navigate("Settings")}>
                    <Ionicons name="ios-settings-outline" size={24} color="white" />
                </Pressable>
            </View>

            <View style={styles.userInfoContainer}>
                <View style={styles.pfpContainer}>
                    <Image style={styles.pfp} source={{uri: user.profile_picture}}/>
                    <Text style={styles.displayName}>{user.display_name}</Text>
                    <Pressable onPress={copyUsernameToClipboard}>
                        {({pressed}) => (
                            <Text style={{color: pressed ? "gray": "white"}}>@{user.username}</Text>
                        )}
                    </Pressable>
                </View>

                <View style={styles.userRelationsContainer}>
                    <View style={styles.followCounts}>
                        <Pressable onPress={() => navigation.navigate("MutualUserLists", {name: user.username})}>
                            <Text style={[styles.text, {fontWeight: "bold", textAlign: "center"}]}>{user.follower_count}</Text>
                            <Text style={styles.text}>Followers</Text>
                        </Pressable>

                        <Pressable onPress={() => navigation.navigate("MutualUserLists", {name: user.username})}>
                            <Text style={[styles.text, {fontWeight: "bold", textAlign: "center"}]}>{user.following_count}</Text>
                            <Text style={styles.text}>Following</Text>
                        </Pressable>
                    </View>

                    <View style={styles.item_seperator}/>

                    <View style={styles.userDescription}>
                        <Text style={[styles.text, {textAlign: "center"}]}>{user.bio}</Text>
                    </View>
                </View>
            
            </View>
            

            <View style={styles.torusContainer}>
                <View style={styles.centerLoop}>
                    <Pressable onPress={() => navigation.navigate("MyLoops")} style={styles.centerLoopIcon}>
                        <MaterialCommunityIcons name="google-circles-communities" color={"gray"} size={60}/>
                    </Pressable>
                    {renderLoops()}
                </View>
            </View>

            <View style={styles.loopsListContainer}>
                <View style={styles.item_seperator} />
                <FlatList
                        data={pings}
                        renderItem={({item}) => <Ping data={item} setModalVisible={setModalVisible} handleLike={handleLike} handleShare={handleShare} />}
                        ItemSeparatorComponent={() => <View style={styles.item_seperator}/>}
                    />
            </View>       

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
    </SafeAreaView>
    )
}