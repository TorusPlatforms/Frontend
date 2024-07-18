import React, { useState, useEffect, useRef, useCallback} from 'react'
import { Text, View, SafeAreaView, Image, Animated, FlatList, Pressable, RefreshControl, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native'
import * as Clipboard from 'expo-clipboard';

import { getUserByUsername, getUserPings, follow, unfollow } from "../../components/handlers";
import { Ping } from "../../components/pings";
import styles from "./styles";
import { abbreviate } from '../../components/utils';


export default function UserProfile({ route, navigation }) {
    const [pings, setPings] = useState()
    const [user, setUser] = useState(null)
    const [refreshing, setRefreshing] = useState(false)

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

    async function fetchUser() {
        const fetchedUser = await getUserByUsername(route.params.username)

        if (!fetchedUser) {
            navigation.goBack()
        } else if (fetchedUser.isSelf) {
            navigation.navigate("Profile")
        } else {
            setUser(fetchedUser)
            setIsFollowing(fetchedUser?.isFollowing)
    
            const pings = await getUserPings(fetchedUser.username)
            setPings(pings)
        }
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
        return (
            <View style={{justifyContent: "center", alignItems: "center", flex: 1, backgroundColor: "rgb(22, 23, 24)"}}>
                <ActivityIndicator/>
            </View>
        )
    }
    
    const Header = () => (
        <View style={{marginTop: 20, flex: 1}}>
            <View style={{ flex: 0.8, flexDirection: 'row', paddingTop: 10, minHeight: 175 }}>
                <View style={{ flex: 1, alignItems: "center" }}>
                    <View>
                        <Image style={{ width: 100, height: 100, borderRadius: 50 }} source={{uri: user.pfp_url}}/>
                    </View>
                    
                    <Text style={{ color: "white", fontSize: 16, maxWidth: 150, textAlign: "center", marginVertical: 4, fontWeight: "bold" }}>{user.display_name}</Text>
                    <TouchableOpacity onPress={copyUsernameToClipboard}>
                        <Text style={{color: "white"}}>@{user.username}</Text>
                    </TouchableOpacity>

                    <Text style={{textAlign: "center", color: "lightgray", fontSize: 12, fontStyle: "italic", marginVertical: 5 }}>{user.college_nickname || (user.college.length < 25 ? user.college : abbreviate(user.college))}</Text>

                </View>

                <View style={{ flex: 1, paddingRight: 30 }}>
                    <View>
                        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                            <Pressable onPress={() => navigation.push("MutualUserLists", {username: user.username, initialScreen: "Followers"})}>
                                <Text style={{fontWeight: "bold", textAlign: "center", color: "white"}}>{user.follower_count}</Text>
                                <Text style={{color: "white"}}>Followers</Text>
                            </Pressable>

                            <Pressable onPress={() => navigation.push("MutualUserLists", {username: user.username, initialScreen: "Following"})}>
                                <Text style={{fontWeight: "bold", textAlign: "center", color: "white"}}>{user.following_count}</Text>
                                <Text style={{color: "white"}}>Following</Text>
                            </Pressable>
                        </View>

                        <View style={styles.item_seperator}/>

                    </View>
                   


                    <View style={{marginTop: 10}}>
                        <Text style={{textAlign: "center", color: "white", fontSize: 12}}>{user.bio}</Text>
                    </View>
                </View>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", paddingVertical: 20 }}>
                <Pressable onPress={toggleFollow} style={[styles.followButton, {backgroundColor: isFollowing ? 'rgb(62, 62, 62)' : 'rgb(47, 139, 128)', width: isFollowing ? 150 : 300}]}>
                    <Text style={styles.followButtonText}>{isFollowing ? 'Following' : 'Follow'}</Text>
                </Pressable>

                {isFollowing && (
                    <Pressable onPress={() => navigation.push("DirectMessage", {username: user.username})} style={[{backgroundColor: "rgb(47, 139, 128)"}, styles.followButton]}>
                        <Text style={styles.followButtonText}>Message</Text>
                    </Pressable>
                )}
            </View>

            <View style={styles.item_seperator} />
        </View>
    )

    return (
        <SafeAreaView style={styles.container}>
            {pings.length > 0 ? (
                 <FlatList
                    ListHeaderComponent={Header}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    data={pings}
                    renderItem={({item}) => <Ping data={item} />}
                    ItemSeparatorComponent={() => <View style={styles.item_seperator}/>}
                />
            ) : (
                <View style={{flex: 1}}>
                    <View style={{flex: 0.45}}>
                        <Header />
                    </View>

                    <View style={{alignItems: 'center', flex: 0.7}}>
                        <Text style={{color: 'gray', textAlign: "center", maxWidth: 250, marginTop: 50 }}>Looks like they haven't posted any pings...Maybe they are the aloof type?</Text>
                    </View>
                </View>
            )}
            

        </SafeAreaView>
    )
    
}