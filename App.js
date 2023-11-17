import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import * as Notifications from 'expo-notifications';
import Ionicons from '@expo/vector-icons/Ionicons';
import { View, Image, Text, Animated, Dimensions, Pressable, TextInput, Modal, FlatList, Button } from "react-native";

import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

import AuthScreen from "./screens/auth";
import SignUpScreen from "./screens/signup"
import Feed from "./screens/feed"
import Profile from "./screens/profile"
import Loops from "./screens/loops"
import MutualsScreen from './screens/mutualuserlists';
import CreatePing from './screens/createping';
import Search from "./screens/search";

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
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();
const config = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

function handleModal(e) {
  
}
const Tabs = () => {
  return (
    <Tab.Navigator screenOptions={{tabBarStyle: { backgroundColor: 'rgb(22, 23, 24)'}, headerShown: false, tabBarShowLabel: false}}>
      <Tab.Screen name="Feed" component={Feed} options={{tabBarIcon: ({ focused, size }) => (<Ionicons name={focused ? "home" : "home-outline"} color={"white"} size={size}/>)}}/>
      <Tab.Screen name="Loops" component={LoopsTabs} options={{tabBarIcon: ({ focused, size }) => (<Ionicons name={focused ? "people" : "people-outline"} color={"white"} size={size}/>)}}/>
      <Tab.Screen name="CreateContainer" listeners={({ navigation }) => ({tabPress: (e) => {e.preventDefault(); navigation.navigate("Create")}})} component={CreatePing} options={{ presentation: "modal", tabBarIcon: ({ focused, size }) => (<Ionicons name={focused ? "add-circle" : "add-circle-outline"} color={"white"} size={size}/>)}} />
      <Tab.Screen name="Search" component={Search} options={{tabBarIcon: ({ focused, size }) => (<Ionicons name={focused ? "search" : "search-outline"} color={"white"} size={size}/>)}}/>
      <Tab.Screen name="Profile" component={Profile} options={{tabBarIcon: ({ focused, size }) => (<Ionicons name={focused ? "person" : "person-outline"} color={"white"} size={size}/>)}}/>
    </Tab.Navigator>
  )
};

const FollowTabs = () => {
  return (
    <TopTab.Navigator screenOptions={{tabBarStyle: { backgroundColor: 'rgb(22, 23, 24)'}, tabBarLabelStyle: { "color": "white" }}}>
      <TopTab.Screen name="Following" component={MutualsScreen} initialParams={{get: "following"}} options={{headerShown: false}} />
      <TopTab.Screen name="Followers" component={MutualsScreen} initialParams={{get: "followers"}} options={{headerShown: false}} />
    </TopTab.Navigator>
  )
};

const LoopsTabs = () => {
  return (
    <TopTab.Navigator screenOptions={{tabBarStyle: { backgroundColor: 'rgb(22, 23, 24)', paddingTop: 50}, tabBarLabelStyle: { "color": "white" }}}>
      <TopTab.Screen name="Discover" component={Loops} initialParams={{get: "Discover"}} options={{headerShown: false}} />
      <TopTab.Screen name="My Loops" component={Loops} initialParams={{get: "Main"}} options={{headerShown: false}} />
    </TopTab.Navigator>
  )
};

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Auth" component={AuthScreen} options={{headerShown: false}} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{headerShown: false}} />
        <Stack.Screen name="Home" component={Tabs} options={{headerShown: false}} />
        <Stack.Screen name="Create" component={CreatePing} options={{headerShown: false, presentation: "modal"}} />
        <Stack.Screen name="MutualUserLists" component={FollowTabs} options={({ route }) => ({ title: route.params.name, headerStyle: {backgroundColor: "rgb(22, 23, 24)"}, headerTitleStyle: {color: "white"}, headerTintColor: 'white'})}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
