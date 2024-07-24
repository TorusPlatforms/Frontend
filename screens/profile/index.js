import React, { useState, useEffect, useRef, useCallback} from 'react'
import { Text, View, Image, Animated, TouchableOpacity, FlatList, Pressable, RefreshControl, ActivityIndicator, ScrollView, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Clipboard from 'expo-clipboard';
import { useFocusEffect, useIsFocused, useNavigation, useScrollToTop } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import UserEvents from "../userevents"
import UserPings from '../userpings';

import { getUser } from "../../components/handlers";
import styles from "./styles";


export default function Profile({ route }) {
    const Tab = createMaterialTopTabNavigator();

    const navigation = useNavigation()

    const [user, setUser] = useState(null)

    async function copyUsernameToClipboard() {
        await Clipboard.setStringAsync(user.username);
      };


    async function fetchUser() {
        const fetchedUser = await getUser()
        setUser(fetchedUser)
    }

    useFocusEffect(
        useCallback(() => {
          fetchUser()
        }, [])
      );
    
    useEffect(() => {
        if (route.params?.initialScreen) {
            navigation.navigate(route.params?.initialScreen);
          }
    }, [route.params])

    if (!user) {
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
        
            <View style={{ flex: 0.8, flexDirection: 'row', paddingTop: 10 }}>
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

                    <Text style={{textAlign: "center", color: "lightgray", fontSize: 12, fontStyle: "italic", marginVertical: 5 }}>{user.college_nickname || (user.college.length < 25 ? user.college : abbreviate(user.college))}</Text>

                </View>

                <View style={{ flex: 1, paddingRight: 30 }}>
                    <View>
                        <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 10 }}>
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
                   


                    <View style={{marginTop: 20}}>
                        <Text style={{textAlign: "center", color: "white", fontSize: 12}}>{user.bio}</Text>
                    </View>
                </View>
            </View>
                    
    
            
            <View style={{flex: 2}}>
                <Tab.Navigator screenOptions={{lazy: true, tabBarStyle: { backgroundColor: 'rgb(22, 23, 24)' }, tabBarLabelStyle: { color: "white", fontSize: 10 }}}>
                    <Tab.Screen name="Pings" children={() => <UserPings username={user.username}/>}/>
                    <Tab.Screen name="Events" component={UserEvents} />
                </Tab.Navigator>
            </View>

        </SafeAreaView>
    )
    
}