import React, { useState, useEffect, useRef, useCallback} from 'react'
import { Text, View, Image, Animated, TouchableOpacity, FlatList, Pressable, RefreshControl, ActivityIndicator, ScrollView, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Clipboard from 'expo-clipboard';
import { useIsFocused, useNavigation, useScrollToTop } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import UserEvents from "../userevents"
import UserPings from '../userpings';

import { getUser, getUserEvents, getJoinedLoops } from "../../components/handlers";
import styles from "./styles";


export default function Profile({ route }) {
    const Tab = createMaterialTopTabNavigator();

    const navigation = useNavigation()

    const movingLine = useRef(new Animated.Value(0)).current;

    const [loops, setLoops] = useState([])
    const [user, setUser] = useState(null)

    const [refreshing, setRefreshing] = useState(false)

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

    console.log("First symbol:",  radius * Math.cos(degToRad(60)) + center - symbolSize / 2, radius * Math.sin(degToRad(60)) + center - symbolSize / 2)
    const iconStyles = [
        {left: radius * Math.cos(degToRad(60)) + center - symbolSize / 2, bottom: radius * Math.sin(degToRad(60)) + center - symbolSize / 2}, 
        {left: radius * Math.cos(degToRad(120)) + center - symbolSize / 2, bottom: radius * Math.sin(degToRad(120)) + center - symbolSize / 2},
        {left: radius * Math.cos(degToRad(180)) + center - symbolSize / 2, bottom: radius * Math.sin(degToRad(180)) + center - symbolSize / 2},
        {left: radius * Math.cos(degToRad(360)) + center - symbolSize / 2, bottom: radius * Math.sin(degToRad(360)) + center - symbolSize / 2},
        // {left: radius * Math.cos(degToRad(240)) + center - symbolSize / 2, bottom: radius * Math.sin(degToRad(240)) + center - symbolSize / 2},
        // {left: radius * Math.cos(degToRad(300)) + center - symbolSize / 2, bottom: radius * Math.sin(degToRad(300)) + center - symbolSize / 2}
    ]
    
    const x = movingLine.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 60],
        });

    // const y = movingLine.interpolate({
    //     inputRange: [0, 1],
    //     outputRange: [30, 50],
    //     });

 
    const lineStyles = [
        {top: 50, right: 55, transform: [{rotate: "30deg"}]},  
        {top: 50, left: 55, transform: [{rotate: "-30deg"}]},  
        {left: 85, transform: [{rotate: "90deg"}]},  
        {right: 85, transform: [{rotate: "90deg"}]},
        // {bottom: 50, left: y, transform: [{rotate: "30deg"}]}, 
        // {bottom: 50, right: y, transform: [{rotate: "-30deg"}]}
    ]

    function LoopsSpiral() {      
        return loops.slice(0, 4).map((item, index) => (
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
              source={{ uri: item.pfp_url }}
            />
            {/* {renderNotification()} */}
            <Animated.View style={[lineStyles[index], { backgroundColor: "gray", width: 2, height: x, position: "absolute" }]} />
          </TouchableOpacity>
        ));
      }
     
    useEffect(() => {
        Animated.sequence([
            Animated.delay(500),
            Animated.timing(movingLine, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: false
                })
            ]).start();
 
    }, [])

    // function renderNotification(item, index) {
    //     const unread = false

    //     if (unread) {
    //         return <View style={{width: 15, height: 15, borderRadius: 7.5, backgroundColor: 'red', bottom: 30, position: 'absolute', alignSelf: 'flex-end', zIndex: 1}}/>
    //     }
    // };


    async function fetchUser() {
        const fetchedUser = await getUser()
        setUser(fetchedUser)
    }


    async function fetchLoops() {
        const loops = await getJoinedLoops(4);
        setLoops(loops);
    } 
    
  
    const onRefresh = useCallback(async() => {
      setRefreshing(true);
      await fetchUser()
      await fetchLoops()
      setRefreshing(false)
    }, []);

    useEffect(() => {
        fetchLoops();
        fetchUser();
        console.log("Parent updated scroll ping", route.params?.scrollToPing)
      }, [route.params]);
    


    
    if (!user || !loops) {
        return (
            <View style={[styles.container, {justifyContent: "center", alignItems: "center"}]}>
                <ActivityIndicator/>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={refreshing} />} style={{flex: 1}}>
                <View style={{ flexDirection: "row", justifyContent: "flex-end", flex: 0.25, paddingHorizontal: 30, marginTop: 10}}>
                    <Pressable onPress={() => navigation.navigate("Edit Profile")}>
                        <Ionicons name="person-outline" size={24} color="white" />
                    </Pressable>

                    {/* <Pressable onPress={() => navigation.navigate("Settings")}>
                        <Ionicons name="settings-outline" size={24} color="white" />
                    </Pressable> */}
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
                        {loops?.length > 0 && (
                            <Pressable onPress={() => navigation.navigate("My Loops")} style={styles.centerLoopIcon}>
                                <MaterialCommunityIcons name="google-circles-communities" color={"gray"} size={60}/>
                            </Pressable>
                            

                        )}
                        <LoopsSpiral />

                        {loops.length === 0  && (
                            <View style={{justifyContent: 'center', alignItems: "center"}}>
                                <Text style={{color: "white", fontSize: 18}}>No Loops Found</Text>
                            </View>
                        )}
                    </View>

                </View>
            </ScrollView>
            
            <View style={{flex: 1}}>
                <Tab.Navigator screenOptions={{lazy: true, tabBarStyle: { backgroundColor: 'rgb(22, 23, 24)' }, tabBarLabelStyle: { color: "white", fontSize: 10 }}}>
                    <Tab.Screen name="Pings" children={() =>  <UserPings scrollToPing={route.params?.scrollToPing} username={user.username}/>}/>
                    <Tab.Screen name="Events" component={UserEvents} />
                </Tab.Navigator>
            </View>

        </SafeAreaView>
    )
    
}