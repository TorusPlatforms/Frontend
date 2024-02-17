import React, { useState, useEffect, useRef, useCallback} from 'react'
import { Text, View, SafeAreaView, Image, Animated, FlatList, Pressable, RefreshControl, ActivityIndicator, ScrollView } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Clipboard from 'expo-clipboard';
import { useNavigation } from "@react-navigation/native";

import { getUserByUsername, getUserPings, handleShare, handleLike, postComment, follow } from "../../components/handlers";
import { CommentModal } from '../../components/comments';
import { Ping } from "../../components/pings";
import styles from "./styles";


export default function UserProfile({ route }) {
    const navigation = useNavigation()
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
        setIsFollowing(current => !current); 
        console.log("||||||||||||||")
        await console.log(route.params.username)
        console.log(route.params.username)
        const following = await follow(route.params.username)
        //backend stuff here
    };

    const updateLike = useCallback(() => {
        fetchUser()
      }, []);


    async function fetchUser() {
        const user = await getUserByUsername(route.params.username)
        setUser(user)

        const pings = await getUserPings(user.username)
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
        
        return (
            <SafeAreaView style={styles.container}>
              <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
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
                <Pressable
                                onPress={toggleFollow}
                                style={({ pressed }) => [
                                {
                                backgroundColor: pressed ? 'darkblue' : 'blue',
                                },
                                styles.followButton,
                                
                                 ]}
                                 >
                               
                                <Text style={styles.followButtonText}>
                               {isFollowing ? 'Following' : 'Follow'}

                                </Text>
                                
                        </Pressable>
    
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