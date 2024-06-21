import React, { useState, useEffect, useRef, useCallback} from 'react'
import { Text, View, SafeAreaView, Image, Animated, FlatList, Pressable, RefreshControl, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native'
import * as Clipboard from 'expo-clipboard';

import { getUserByUsername, getUserPings, follow, unfollow } from "../../components/handlers";
import { NewCommentModal } from '../../components/comments';
import { Ping } from "../../components/pings";
import styles from "./styles";


export default function UserProfile({ route, navigation }) {
    const [pings, setPings] = useState([])
    const [user, setUser] = useState(null)
    const [refreshing, setRefreshing] = useState(false)

    const [isFollowing, setIsFollowing] = useState(false); 

    const modalRef = useRef()
    const [ commentPing, setCommentPing ]= useState(null)


    const toggleFollow = async () => {
        setIsFollowing(!isFollowing)
        if(isFollowing){
            await unfollow(route.params.username)
        }
        else{
           await follow(route.params.username) 
        }
    };

    async function fetchUser() {
        const user = await getUserByUsername(route.params.username)
        setUser(user)

        if (user.isSelf) {
            navigation.navigate("Profile")
        }

        const pings = await getUserPings(user.username)
        setIsFollowing(user.isFollowing)
        setPings(pings)
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
    }
    
    const header = (
        <View>
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
        </View>
    )

        return (
            <SafeAreaView style={styles.container}>
           
               
                    <FlatList
                        ListHeaderComponent={header}
                        style={{paddingHorizontal: 20}}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        data={pings}
                        renderItem={({item}) => 
                        <Ping 
                            data={item} 
                            navigation={navigation}
                            openComment={route.params?.scrollToPing}
                            setCommentPing={setCommentPing}
                            modalRef={modalRef}
                        />
                        }
                        ItemSeparatorComponent={() => <View style={styles.item_seperator}/>}
                    />

                <NewCommentModal modalRef={modalRef} commentPing={commentPing} />
                </SafeAreaView>
        )
    
}