import React, { useState, useEffect, useRef, useCallback} from 'react'
import { Text, View, Image, Animated, TouchableOpacity, FlatList, Pressable, RefreshControl, ActivityIndicator, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Clipboard from 'expo-clipboard';
import { useNavigation } from "@react-navigation/native";

import { getUser, getUserPings, postComment, getJoinedLoops } from "../../components/handlers";
import { CommentModal } from '../../components/comments';
import { Ping } from "../../components/pings";
import styles from "./styles";

const torus_default_url = "https://cdn.torusplatform.com/5e17834c-989e-49a0-bbb6-0deae02ae5b5.jpg"

export default function Profile({ route }) {
    const navigation = useNavigation()

    const movingLine = useRef(new Animated.Value(0)).current;

    const [loops, setLoops] = useState([])
    const [pings, setPings] = useState([])
    const [user, setUser] = useState(null)

    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    const pings_ref = useRef(null)

    function findIndexById(arr, id) {
        return arr.findIndex(obj => parseInt(obj.post_id) === parseInt(id));
    }
      
    async function fetchUserPings(ping_id) {
        const user = await getUser();
        setUser(user)

        const pings = await getUserPings(user.username)
        setPings(pings)

        if (ping_id) {
            const index = findIndexById(pings, ping_id)
            console.log("INDEX", index)
            setTimeout(() => {
              if (pings_ref.current) {
                pings_ref.current.scrollToIndex({ index: index, animated: true });
              }
            }, 1000);
          }


        console.log(pings[pings.length - 1])
        setLoading(false)
    }   
  
 

    async function fetchLoops() {
        const loops = await getJoinedLoops(6);
        setLoops(loops);
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
        console.log("RENDERING LOOPS\n\n\n");
      
        return loops.slice(0, 6).map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[iconStyles[index], { justifyContent: "center", alignItems: "center", position: "absolute" }]}
            onPress={async () => navigation.navigate('Loop', { loop_id: item.loop_id })}
          >
            <Image
              style={{
                width: symbolSize,
                height: symbolSize,
                borderRadius: symbolSize / 2,
                zIndex: 1,
                borderColor: "white",
                borderWidth: 1
              }}
              source={{ uri: item.profile_picture || torus_default_url }} // Note: use 'uri' instead of 'url'
            />
            {renderNotification()}
            <Animated.View style={[lineStyles[index], { backgroundColor: "gray", width: 2, height: x, position: "absolute" }]} />
          </TouchableOpacity>
        ));
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
      await fetchUserPings()
      setRefreshing(false)
    }, []);


    useEffect(() => {
        console.log("PARAMS", route.params)
        setLoading(true)
        fetchLoops();
        fetchUserPings(route.params?.scrollToPing);
      }, [route.params]);
    

    const handleScrollToIndexFailed = (info) => {
        const wait = new Promise(resolve => setTimeout(resolve, 500));
        wait.then(() => {
            if (pings_ref.current) {
            pings_ref.current.scrollToIndex({ index: info.index, animated: true });
            }
        });
    };


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

    

    const header = () => (
        <View>
            <View style={styles.header}>
                <Pressable onPress={() => navigation.navigate("Edit Profile")}>
                    <Ionicons name="person-outline" size={24} color="white" />
                </Pressable>

                <Pressable onPress={() => navigation.navigate("Settings")}>
                    <Ionicons name="settings-outline" size={24} color="white" />
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
                    {loops?.length != 0 && (
                        <Pressable onPress={() => navigation.navigate("MyLoops")} style={styles.centerLoopIcon}>
                            <MaterialCommunityIcons name="google-circles-communities" color={"gray"} size={60}/>
                        </Pressable>
                        

                    )}
                    {renderLoops()}

                    {loops.length === 0  && (
                        <View style={{justifyContent: 'center', alignItems: "center"}}>
                            <Text style={{color: "white", fontSize: 18}}>No Loops Found</Text>
                        </View>
                    )}
                </View>

            </View>

            <View style={[styles.item_seperator, {marginTop: 50, marginBottom: 30}]} />
        </View>
    )






    if (loading) {
        return (
            <View style={[styles.container, {justifyContent: "center", alignItems: "center"}]}>
                <ActivityIndicator/>
            </View>
        )

    } else {

        return (
            <SafeAreaView style={styles.container}>
                <FlatList
                    ref={pings_ref}
                    onScrollToIndexFailed={handleScrollToIndexFailed}
                    ListHeaderComponent={header}
                    style={{paddingHorizontal: 20}}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    data={pings}
                    renderItem={({item}) => 
                    <Ping 
                        data={item} 
                        navigation={navigation}
                        openComment={route.params?.scrollToPing}
                    />
                    }
                    ItemSeparatorComponent={() => <View style={styles.item_seperator}/>}
                />
            </SafeAreaView>
        )
    }
    
}