import React, { useState, useEffect, useRef, useCallback} from 'react'
import { Text, View, SafeAreaView, Image, Animated, FlatList, Pressable, RefreshControl, ActivityIndicator, ScrollView } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Clipboard from 'expo-clipboard';
import { useNavigation } from "@react-navigation/native";

import { getUser, getUserPings, handleShare, handleLike, postComment, getRecentLoops } from "../../components/handlers";
import { CommentModal } from '../../components/comments';
import { Ping } from "../../components/pings";
import styles from "./styles";


export default function Profile() {
    const navigation = useNavigation()

    const movingLine = useRef(new Animated.Value(0)).current;

    const [loops, setLoops] = useState([])
    const [pings, setPings] = useState([])
    const [user, setUser] = useState(null)

    const [modalVisible, setModalVisible] = useState(false);
    const [commentText, onChangeComment] = useState('');
    const [commentPing, setCommentPing] = useState(null)
    const [replyingTo, setReplyingTo] = useState(null) 
    const ref_input = useRef();

    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    const updateLike = useCallback(() => {
        fetchUser()
      }, []);

    async function fetchUser() {
        const user = await getUser();
        setUser(user)

        const pings = await getUserPings(user.username)
        setPings(pings)

        setLoading(false)
    }   
  
      function handleReply(data) {
        ref_input.current.focus()
        setReplyingTo(data.author)
        onChangeComment("@" + data.author + " ")
      }
  

    async function fetchLoops() {

        const user = await getUser();
        const username = await user.username;

        const loopData = getRecentLoops(await username, 6);

        const exampleLoopsData = {name: "Dorm", pfp: "https://icons.iconarchive.com/icons/graphicloads/100-flat/256/home-icon.png"}
        const loops = Array(6).fill(loopData);
        
        for (let i = 0; i < loops.length; i++) {
            if (loops[i].profile_picture == null) {
                loops[i].profile_picture = "https://icons.iconarchive.com/icons/graphicloads/100-flat/256/home-icon.png";
            }
            console.log("fake loop" + loops[i])
        }
        setLoops(loops);
        // return new Array(6).fill(loopData);
    } 
    

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
        console.log("LOOPS ARE HERELOOPS ARE HERELOOPS ARE HERELOOPS ARE HERELOOPS ARE HERELOOPS ARE HERELOOPS ARE HERELOOPS ARE HERE");
        for (let i = 0; i < loops.length; i++) {
            console.log(loops[i]);
        }
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
                      source={{ url: item.profile_picture }} />

                  {renderNotification()}

                  <Animated.View style={[lineStyles[index], { backgroundColor: "gray", width: 2, height: x, position: "absolute"}]} />

              </View>
          );
        });
      }
     
    function renderPings() {
        return pings.map((item) =>
            <View key={item.post_id}>
                <Ping 
                    data={item} 
                    setModalVisible={setModalVisible} 
                    handleLike={() => handleLike(item, updateLike)} 
                    handleComment={() => setCommentPing(item)} handleShare={handleShare}
                    navigation={navigation}
                />
                <View style={styles.item_seperator} />
            </View>
        )
    }

    function renderNotification(item, index) {
        //figure out if loop has a notification
        const unread = false

        if (unread) {
            return <View style={{width: 15, height: 15, borderRadius: 7.5, backgroundColor: 'red', bottom: 30, position: 'absolute', alignSelf: 'flex-end', zIndex: 1}}/>
        }
    };


    const onRefresh = useCallback(async() => {
      setRefreshing(true);
      await fetchUser()
      setRefreshing(false)
    }, []);


    useEffect(() => {
        setLoading(true)
        // console.log(getLoops());
        fetchLoops();
        fetchUser();
      }, []);
    

    useEffect(() => {
        if (!loading) {
            Animated.sequence([
                Animated.delay(300),
                Animated.timing(movingLine, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: false
                  })
                ]).start();
        }
 
    }, [movingLine, loading])


    if (loading) {
        return (
            <View style={[styles.container, {justifyContent: "center", alignItems: "center"}]}>
                <ActivityIndicator/>
            </View>
        )

    } else {

        return (
            <SafeAreaView style={styles.container}>
              <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
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
                        <Image style={styles.pfp} source={{uri: user.pfp_url}}/>
                        <Text style={styles.displayName}>{user.display_name}</Text>
                        <Pressable onPress={copyUsernameToClipboard}>
                            {({pressed}) => (
                                <Text style={{color: pressed ? "gray": "white"}}>@{user.username}</Text>
                            )}
                        </Pressable>
                    </View>
    
                    <View style={styles.userRelationsContainer}>
                        <View style={styles.followCounts}>
                            <Pressable onPress={() => navigation.navigate("MutualUserLists", {username: user.username})}>
                                <Text style={[styles.text, {fontWeight: "bold", textAlign: "center"}]}>{user.follower_count}</Text>
                                <Text style={styles.text}>Followers</Text>
                            </Pressable>
    
                            <Pressable onPress={() => navigation.navigate("MutualUserLists", {username: user.username})}>
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
                        {renderPings()}
                </View>       
    
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
    
              </ScrollView>
            </SafeAreaView>
        )
    }
    
}