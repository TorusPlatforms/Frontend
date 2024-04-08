import React, { useState, useEffect, useRef, useCallback} from 'react'
import { Text, View, SafeAreaView, Image, Animated, FlatList, Pressable, RefreshControl, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Clipboard from 'expo-clipboard';
import { useNavigation } from "@react-navigation/native";

import { getUserByUsername, getUserPings, handleShare, handleLike, postComment, follow, unfollow, sendMessage } from "../../components/handlers";
import { CommentModal } from '../../components/comments';
import { Ping } from "../../components/pings";
import styles from "./styles";


export default function UserProfile({ route, navigation }) {
    const [pings, setPings] = useState([])
    const [user, setUser] = useState(null)
    const [modalVisible, setModalVisible] = useState(false);
    const [commentText, onChangeComment] = useState('');
    const [commentPing, setCommentPing] = useState(null)
    const [replyingTo, setReplyingTo] = useState(null) 
    const [refreshing, setRefreshing] = useState(false)
    const ref_input = useRef();

    const [isFollowing, setIsFollowing] = useState(false); 

    const toggleFollow = async () => {
        setIsFollowing(!isFollowing)
        if(isFollowing){
            await unfollow(route.params.username)
        }
        else{
           await follow(route.params.username) 
        }
    };

    const updateLike = useCallback(() => {
        fetchUser()
      }, []);

    async function fetchUser() {
        const user = await getUserByUsername(route.params.username)
        setUser(user)
        console.log(user)
        const pings = await getUserPings(user.username)
        setIsFollowing(user.isFollowing)
        setPings(pings)
    }

  
    function handleReply(data) {
        ref_input.current.focus()
        setReplyingTo(data.author)
        onChangeComment("@" + data.author + " ")
    }


    async function copyUsernameToClipboard() {
        await Clipboard.setStringAsync(user.username);
      };

    
    const onRefresh = useCallback(async() => {
        setRefreshing(true);
        await fetchUser()
        setRefreshing(false)
    }, []);

    useEffect(() => {
        fetchUser()
      }, []);
    
    if (!user || !pings) {
        return <ActivityIndicator/>

    } else {
        console.log("IM HERE", user.username)

        return (
            <SafeAreaView style={styles.container}>
              <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                <View style={styles.userInfoContainer}>
                    <View style={styles.pfpContainer}>
                        <Image style={styles.pfp} source={{uri: user.pfp_url}}/>
                        <Text style={styles.displayName}>{user.display_name}</Text>
                        <TouchableOpacity onPress={copyUsernameToClipboard}>
                            <Text style={{color: "white"}}>@{user.username}</Text>
                        </TouchableOpacity>
                       
                    </View>
    
                    <View style={styles.userRelationsContainer}>
                        <View style={styles.followCounts}>
                            <Pressable onPress={() => navigation.push("MutualUserLists", {username: user.username, merge: true})}>
                                <Text style={[styles.text, {fontWeight: "bold", textAlign: "center"}]}>{user.follower_count}</Text>
                                <Text style={styles.text}>Followers</Text>
                            </Pressable>
                            

                            <Pressable onPress={() => navigation.push("MutualUserLists", {username: user.username, merge: true})}>
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

                <View style={{flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", paddingVertical: 20}}>
                    <Pressable onPress={toggleFollow} style={[styles.followButton, {backgroundColor: isFollowing ? 'gray' : 'blue', width: isFollowing ? 150 : 300}]}>
                        <Text style={styles.followButtonText}>{isFollowing ? 'Following' : 'Follow'}</Text>
                    </Pressable>

                    {isFollowing && (
                        <Pressable onPress={() => navigation.push("DirectMessage", {username: user.username})} style={[{backgroundColor: "black"}, styles.followButton]}>
                            <Text style={styles.followButtonText}>Message</Text>
                        </Pressable>
                    )}
                </View>
               
                <View style={styles.loopsListContainer}>
                    <View style={styles.item_seperator} />
                        {pings.map((item) =>
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