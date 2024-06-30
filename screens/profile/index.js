import React, { useState, useEffect, useRef, useCallback} from 'react'
import { Text, View, Image, Animated, TouchableOpacity, FlatList, Pressable, RefreshControl, ActivityIndicator, ScrollView, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Clipboard from 'expo-clipboard';
import { useIsFocused, useNavigation, useScrollToTop } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import UserEvents from "../userevents"
import UserPings from '../userpings';

import { getUser, getUserEvents, getJoinedLoops } from "../../components/handlers";
import styles from "./styles";


export default function Profile() {
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

    const iconStyles = [
        {left: radius * Math.cos(degToRad(120)) + center - symbolSize / 2, bottom: radius * Math.sin(degToRad(120)) + center - symbolSize / 2},
        {left: radius * Math.cos(degToRad(60)) + center - symbolSize / 2, bottom: radius * Math.sin(degToRad(60)) + center - symbolSize / 2}, 
        {left: radius * Math.cos(degToRad(360)) + center - symbolSize / 2, bottom: radius * Math.sin(degToRad(360)) + center - symbolSize / 2},
        {left: radius * Math.cos(degToRad(180)) + center - symbolSize / 2, bottom: radius * Math.sin(degToRad(180)) + center - symbolSize / 2},
        // {left: radius * Math.cos(degToRad(240)) + center - symbolSize / 2, bottom: radius * Math.sin(degToRad(240)) + center - symbolSize / 2},
        // {left: radius * Math.cos(degToRad(300)) + center - symbolSize / 2, bottom: radius * Math.sin(degToRad(300)) + center - symbolSize / 2}
    ]
    
    const lineStyles = [
        {top: 50, left: 55, transform: [{rotate: "-30deg"}]}, 
        {top: 50, right: 55, transform: [{rotate: "30deg"}]},  
        {right: 85, transform: [{rotate: "90deg"}]},   
        {left: 85, transform: [{rotate: "90deg"}]},
        // {bottom: 50, left: y, transform: [{rotate: "30deg"}]}, 
        // {bottom: 50, right: y, transform: [{rotate: "-30deg"}]}
    ]
    
    const x = movingLine.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 60],
        });

    // const y = movingLine.interpolate({
    //     inputRange: [0, 1],
    //     outputRange: [30, 50],
    //     });

 
    

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
        setRefreshing(true)
        const fetchedUser = await getUser()
        setUser(fetchedUser)
        setRefreshing(false)
    }


    async function fetchLoops() {
        setRefreshing(true)
        const loops = await getJoinedLoops(4);
        setLoops(loops);

        console.log("Fetched 4 loops. First entry:", loops[0])
        setRefreshing(false)
    } 
    
    const isFocused = useIsFocused()

    useEffect(() => {
        fetchLoops();
        fetchUser();
      }, [isFocused]);
    

    

    if (!user || !loops) {
        return (
            <View style={[styles.container, {justifyContent: "center", alignItems: "center"}]}>
                <ActivityIndicator/>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* <View style={{ flexDirection: "row", justifyContent: "flex-end", flex: 0.25, paddingHorizontal: 30, marginTop: 10}}>
                <Pressable onPress={() => navigation.navigate("Edit Profile")}>
                    <Ionicons name="person-outline" size={24} color="white" />
                </Pressable>

                <Pressable onPress={() => navigation.navigate("Settings")}>
                    <Ionicons name="settings-outline" size={24} color="white" />
                </Pressable>
            </View> */}
        
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ flex: 1, alignItems: "center" }}>
                    <Pressable onPress={() => navigation.navigate("Edit Profile")}>
                        <Image style={{ width: 100, height: 100, borderRadius: 50 }} source={{uri: user.pfp_url}}/>
                        <View  style={{position: "absolute", bottom: 5, right: 5, backgroundColor: "rgb(47, 139, 128)", borderRadius: 15, width: 25, height: 25, justifyContent: "center", alignItems: "center"}}>
                            <MaterialIcons name="edit" size={20} color="white"/>
                        </View>
                    </Pressable>
                    
                    <Text style={{ color: "white", fontSize: 16, maxWidth: 150, textAlign: "center", marginVertical: 4, fontWeight: "bold" }}>{user.display_name}</Text>
                    <TouchableOpacity onPress={copyUsernameToClipboard}>
                        <Text style={{color: "white"}}>@{user.username}</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 1, paddingRight: 30 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                        <Pressable onPress={() => navigation.navigate("MutualUserLists", {username: user.username, initialScreen: "Followers"})}>
                            <Text style={{fontWeight: "bold", textAlign: "center", color: "white"}}>{user.follower_count}</Text>
                            <Text style={{color: "white"}}>Followers</Text>
                        </Pressable>

                        <Pressable onPress={() => navigation.navigate("MutualUserLists", {username: user.username, initialScreen: "Following"})}>
                            <Text style={{fontWeight: "bold", textAlign: "center", color: "white"}}>{user.following_count}</Text>
                            <Text style={{color: "white"}}>Following</Text>
                        </Pressable>
                    </View>

                    <View style={[styles.item_seperator, {marginVertical: 10}]}/>

                    <Text style={{textAlign: "center", color: "white", fontSize: 12}}>{user.bio}</Text>
                </View>
            </View>
                    
        
            <View style={{ alignItems: "center", flex: 0.75 }}>
                <View style={{ width: 250, height: 250, borderRadius: 125 }}>
                    {loops?.length > 0 && (
                        <Pressable onPress={() => navigation.navigate("My Loops")} style={{ width: 80, height: 80, borderRadius: 40, alignSelf: "center", top: 85, zIndex: 1, justifyContent: "center", alignItems: "center" }}>
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
            
            <View style={{flex: 1.5}}>
                <Tab.Navigator screenOptions={{lazy: true, tabBarStyle: { backgroundColor: 'rgb(22, 23, 24)' }, tabBarLabelStyle: { color: "white", fontSize: 10 }}}>
                    <Tab.Screen name="Pings" children={() =>  <UserPings username={user.username}/>}/>
                    <Tab.Screen name="Events" component={UserEvents} />
                </Tab.Navigator>
            </View>

        </SafeAreaView>
    )
    
}