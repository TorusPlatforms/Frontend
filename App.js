import { NavigationContainer, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import * as Notifications from 'expo-notifications';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useState, useRef, useEffect } from "react";
import { StatusBar, Image, View, TouchableOpacity, Platform } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth, onAuthStateChanged } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

import AuthScreen from "./screens/auth/login";
import SignUpScreen from "./screens/auth/signup"
import Feed from "./screens/feed"
import Profile from "./screens/profile"
import MutualsScreen from './screens/mutualuserlists';
import CreatePing from './screens/createping';
import Loops from "./screens/discoverloops";
import Events from "./screens/events";
import LoopsPage from './screens/loop'; //this is the view for a single loop
import CreateLoop from "./screens/createloop";
import Messages from "./screens/messages" 
import DirectMessage from "./screens/directmessage";
import NotificationsScreen from './screens/notifications';
import ForgotPassword from './screens/auth/forgotpassword';
import VerifyEmail from './screens/auth/verifyemail';
import EditProfile from "./screens/editprofile";
import EditField from "./screens/editfield";
import MyLoops from "./screens/myloops";
import UserProfile from './screens/userprofile';
import CreateEvent from './screens/createevent';
import CreateAnnouncement from './screens/createannouncement';
import LoopChat from './screens/loopchat';
import LoopMembers from './screens/loopmembers';
import EditLoop from './screens/editloop';
import JoinRequests from './screens/joinrequests';
import SearchUsers from './screens/searchusers';
import CommentsScreen from './screens/comments';
import SearchColleges from './screens/searchcolleges';
import Ping from './screens/ping';
import SplashScreen from './screens/splashscreen';
import LoopAnnouncements from './screens/loopannouncements';


const firebaseConfig = {
  apiKey: "AIzaSyBJS-LKFsOiuLvapER3-Lfa6uBz5ZasmPI",
  authDomain: "torus-ad58e.firebaseapp.com",
  projectId: "torus-ad58e",
  
  storageBucket: "torus-ad58e.appspot.com",
  messagingSenderId: "210175229761",
  appId: "1:210175229761:web:774b6b86fb6255e3592bc0",
  measurementId: "G-VKFWMGZVXZ"
};


if (getApps().length) {
    getApp();
} else {
    const app = initializeApp(firebaseConfig)
    const auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
}

Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    return {
      shouldShowAlert: !(['messages', 'loop_message'].includes(notification?.request?.content?.data?.type)),
      shouldPlaySound: false,
      shouldSetBadge: false,
    };
  },
});



const prefix = Linking.createURL('/');

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();


const Tabs = () => {
  return (
    <Tab.Navigator screenOptions={{tabBarStyle: { backgroundColor: 'rgb(22, 23, 24)'}, headerShown: false, tabBarShowLabel: false, headerStyle: { backgroundColor: 'rgb(22, 23, 24)'}, headerTitleStyle: { "color": "white" }}}>
      <Tab.Screen name="Feed" component={FeedScreens} options={{tabBarIcon: ({ focused, size }) => (<Ionicons name={focused ? "home" : "home-outline"} color={"white"} size={size}/>)}}/>
      <Tab.Screen name="Community" component={DiscoverTabs} options={{tabBarIcon: ({ focused, size }) => (<Ionicons name={focused ? "search" : "search-outline"} color={"white"} size={size}/>)}}/>
      <Tab.Screen name="CreateContainer" listeners={({ navigation }) => ({tabPress: (e) => {e.preventDefault(); navigation.navigate("Create")}})} component={CreatePing} options={{ presentation: "modal", tabBarIcon: ({ focused, size }) => (<Ionicons name={focused ? "add-circle" : "add-circle-outline"} color={"white"} size={size}/>)}} />
      <Tab.Screen name="My Loops" component={MyLoops} options={{headerShown: true, tabBarIcon: ({ focused, size }) => (<MaterialCommunityIcons name={focused ? "account-group" : "account-group-outline"} color={"white"} size={size}/>)}}/>
      <Tab.Screen name="Profile" component={Profile} options={{tabBarIcon: ({ focused, size }) => (<Ionicons name={focused ? "person" : "person-outline"} color={"white"} size={size}/>)}}/>
    </Tab.Navigator>
  )
};

const FeedScreens = () => {
  return (
  <Stack.Navigator>
      <Stack.Screen name="ForYou" component={Feed} initialParams={{get: "foryou"}} options={{headerShown: false}} />
      <Stack.Screen name="Friends" component={Feed} initialParams={{get: "friends"}} options={{headerShown: false}} />
  </Stack.Navigator>
  )
}


const DiscoverTabs = () => {
  return (
  <TopTab.Navigator screenOptions={{lazy: true, tabBarStyle: { backgroundColor: 'rgb(22, 23, 24)', paddingTop: 50}, tabBarLabelStyle: { "color": "white"}}}>
    <TopTab.Screen name="Loops" component={Loops} options={{headerShown: false}} />
    <TopTab.Screen name="Events" component={Events} options={{headerShown: false}} />
  </TopTab.Navigator>)
}

const FollowTabs = ({ route }) => {
  return (
    <TopTab.Navigator initialRouteName={route.params?.initialScreen} screenOptions={{tabBarStyle: { backgroundColor: 'rgb(22, 23, 24)'}, tabBarLabelStyle: { "color": "white" }}}>
      <TopTab.Screen name="Following" component={MutualsScreen} initialParams={{get: "following", username: route.params.username}} options={{headerShown: false}} />
      <TopTab.Screen name="Followers" component={MutualsScreen} initialParams={{get: "followers", username: route.params.username}} options={{headerShown: false}} />
    </TopTab.Navigator>
  )
};

function App() {
    const [loggedIn, setLoggedIn] = useState(false)
    const [loading, setLoading] = useState(true)

    const config = {
      screens: {
        Ping: 'ping/:post_id',  
        Loop: 'loop/:loop_id',
        UserProfile: 'user/:username',
        Notifications: 'notifications',
      },
    };

    const linking = {
      prefixes: [prefix],
      config
    };

    
    useEffect(() => {
      const auth = getAuth()
      const unsubscribe = onAuthStateChanged(auth, user => {
          console.log("User State Changed")
  
          if (user && user.emailVerified) {
            setLoggedIn(true)
          } else {
            setLoggedIn(false)
          }

          setTimeout(() => {
            setLoading(false);
          }, 1000); 
      })

      return () => unsubscribe()

    }, []);

    useEffect(() => {
      const subscription = Notifications.addNotificationResponseReceivedListener(response => {
        const url = response.notification.request.content.data.url;
        console.log("Opening URL", prefix, url)
        Linking.openURL(prefix.trim() + url.trim());
      });
      return () => subscription.remove();
    }, []);



    if (loading) {
      return (
          <SplashScreen />
      )
    }

    return (
      <GestureHandlerRootView style={{backgroundColor: "rgb(22, 23, 24)", flex: 1}}>
      <SafeAreaProvider>
      <NavigationContainer linking={linking}>
        <StatusBar barStyle="light-content" backgroundColor="rgb(22, 23, 24)" />

        <Stack.Navigator screenOptions={({ navigation }) => ({   
              headerLeft: () => (
                <TouchableOpacity onPress={() => {
                  if (navigation.canGoBack()) {
                    navigation.goBack()
                  } else {
                    navigation.navigate("Home")
                  }
                }}>
                  <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
              ),  
              gestureEnabled: true, headerShown: false, headerBackTitleVisible: false, headerTitleStyle: {color: "white"}, 
              headerTintColor: 'white', headerStyle: {backgroundColor: "rgb(22, 23, 24)"}, animation: Platform.OS == "android" ? "slide_from_bottom" : null
            })}>


            {loggedIn ? (
              <>
                <Stack.Screen name="Home" options={{ gestureEnabled: false }} component={Tabs} />
                <Stack.Screen name="Create" component={CreatePing} options={{ presentation: "modal", gestureEnabled: true }} />
                <Stack.Screen name="CreateLoop" component={CreateLoop} options={{ presentation: "modal", gestureEnabled: true }} />
                <Stack.Screen name="CreateEvent" component={CreateEvent} options={{ presentation: "modal", gestureEnabled: true }} />
                <Stack.Screen name="CreateAnnouncement" component={CreateAnnouncement} options={{ presentation: "modal", gestureEnabled: true }} />
                <Stack.Screen name="Loop" component={LoopsPage} />
                <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: true, headerTitleAlign: "center" }} />
                <Stack.Screen name="Comments" component={CommentsScreen} options={{ presentation: "modal", gestureEnabled: true, headerShown: true, headerLeft: () => (<View />), headerBackVisible: false, headerTitleAlign: 'center' }} />
                <Stack.Screen name="LoopMembers" component={LoopMembers} options={{ presentation: "modal", gestureEnabled: true, title: "Members", headerShown: true }} />
                <Stack.Screen name="LoopAnnouncements" component={LoopAnnouncements} options={{ presentation: "modal", gestureEnabled: true, title: "Announcements", headerShown: true }} />
                <Stack.Screen name="DirectMessage" component={DirectMessage} />
                <Stack.Screen name="MutualUserLists" component={FollowTabs} options={({ route }) => ({ headerShown: true, title: route.params.username })} />
                <Stack.Screen name="Edit Profile" component={EditProfile} options={{ headerShown: true }} />
                <Stack.Screen name="EditLoop" component={EditLoop} options={{ headerShown: true, headerTitle: "Edit Loop"}} />
                <Stack.Screen name="EditField" component={EditField} />
                <Stack.Screen name="UserProfile" component={UserProfile} options={({ route }) => ({ headerShown: true, title: route.params.username })} />
                <Stack.Screen name="LoopChat" component={LoopChat} />
                <Stack.Screen name="Messages" component={Messages} />
                <Stack.Screen name="Ping" component={Ping} options={{ headerShown: true }} />
                <Stack.Screen name="JoinRequests" component={JoinRequests} options={{ headerShown: true, headerTitle: "Join Requests" }} />
                <Stack.Screen name="Search Users" component={SearchUsers} options={{ headerShown: true, presentation: "modal", headerLeft: () => (<View />) }} />
                <Stack.Screen name="Search Colleges" component={SearchColleges} options={{ headerShown: true, presentation: "modal", headerLeft: () => (<View />) }} />

                 {/* <Stack.Screen name="Settings" component={Settings} options={{ headerShown: true }} />
                <Stack.Screen name="Your Account" component={YourAccountScreen} options={{ headerShown: true }} />
                <Stack.Screen name="Accessibility" component={AccessibilityDisplay} options={{ headerShown: true }} />
                <Stack.Screen name="Privacy and Safety" component={PrivacySafety} options={{ headerShown: true }} />
                <Stack.Screen name="Security and Account Access" component={SecurityAccountAccess} options={{ headerShown: true }} />
                <Stack.Screen name="AdditionalResources" component={AdditionalResources} options={{ headerShown: true }} />
                <Stack.Screen name="Coming Soon" component={ComingSoon} options={{ headerShown: true }} /> */}
              </>
            ) : (
              <>
              <Stack.Screen name="Auth" component={AuthScreen} />
              <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: true }} />
              <Stack.Screen name="Forgot Password" component={ForgotPassword} options={{ headerShown: true }} />
              <Stack.Screen name="Verify Email" component={VerifyEmail} options={{ headerShown: true }} />
              </>
          )}
          
          
        </Stack.Navigator>
      </NavigationContainer>
      </SafeAreaProvider>
      </GestureHandlerRootView>
    );
}

export default App;
