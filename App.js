import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Notifications from 'expo-notifications';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

import AuthScreen from "./screens/auth";
import SignUpScreen from "./screens/signup"
import Feed from "./screens/feed"
import Profile from "./screens/profile"
import Loops from "./screens/loops"

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

function Tabs() {
  return (
    <Tab.Navigator  
      screenOptions={{
        tabBarStyle: { backgroundColor: 'rgb(22, 23, 24)' },
     }}
    >
      <Tab.Screen name="Feed" component={Feed} options={{headerShown: false}}/>
      <Tab.Screen name="Loops" component={Loops} options={{headerShown: false}}/>
      <Tab.Screen name="Profile" component={Profile} options={{headerShown: false}}/>
    </Tab.Navigator>
  )
};

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Auth" component={AuthScreen} options={{headerShown: false}} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{headerShown: false}} />
        <Stack.Screen name="Home" component={Tabs} options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
