import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Text, View, Animated, Pressable, FlatList, Image, TouchableOpacity, Modal, Platform, RefreshControl, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { Dropdown } from 'react-native-element-dropdown';
import { useFocusEffect, useNavigation, useLinkTo } from '@react-navigation/native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import _ from 'lodash';

import { getUser, getPings, getFollowingPings, updateUser } from "../../components/handlers";
import { abbreviate } from '../../components/utils';
import { Ping } from "../../components/pings";
import styles from "./styles";
import { getCollegePings, getColleges } from '../../components/handlers/colleges';


export default function Feed() {
    const navigation = useNavigation()
    
    const [dropdownData, setDropdownData] = useState()
    const [feedType, setFeedType] = useState("college");

    const [refreshing, setRefreshing] = useState(false);

    const [user, setUser] = useState(null)
    const [pings, setPings] = useState(null)

    const flatListRef = useRef(0);
    const currentScrollPosition = useRef()
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const lastNotificationResponse = Notifications.useLastNotificationResponse();
    const linkTo = useLinkTo()

    useEffect(() => {
      if (
        lastNotificationResponse &&
        lastNotificationResponse?.notification?.request?.content?.data?.url
      ) {
        const url = lastNotificationResponse.notification.request.content.data.url
        console.log("BACKGROUND NOTIFICATION DETECTED IN FEED. URL", url)
        linkTo("/" + url)
      }
    }, [lastNotificationResponse]);



    const scrollToTop = () => {
      if (flatListRef.current) {
        flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
        fadeAnim.setValue(0)
      }
    };

    //handles appearnce of the Scroll to top button
    onScroll = (event) => {
      currentScrollPosition.current = event.nativeEvent.contentOffset.y
    }

    const handleScrollEnd = () => {
      if (currentScrollPosition.current && currentScrollPosition.current > 1000) {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }).start();
      } else {
        fadeAnim.setValue(0)
      }
    };
  
    const handleScrollBegin = () => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start();
    };
  

    function handleRegistrationError(errorMessage) {
        console.error("Error Registering for Notifications", errorMessage);
    }

    async function registerForPushNotificationsAsync() {
        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
            });
        }
        
        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
              const { status } = await Notifications.requestPermissionsAsync();
              finalStatus = status;
            }

            if (finalStatus !== 'granted') {
              handleRegistrationError('Permission not granted to get push token for push notification!');
              return;
            }

            const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

            if (!projectId) {
              handleRegistrationError('Project ID not found');
            }
            
            try {
                const pushTokenString = (
                    await Notifications.getExpoPushTokenAsync({
                    projectId,
                    })
                ).data;

                console.log("Found Expo Push Token:", pushTokenString);
                return pushTokenString;
            } catch (e) {
                handleRegistrationError(`${e}`);
            }
        } else {
            console.log('Must use physical device for push notifications');
        }
    }
      
    async function updateToken() {
      const fetchedUser = await fetchUser()
      const token = await registerForPushNotificationsAsync()
      if (token && token != fetchedUser.expo_notification_id) {
          console.log("Token has changed! Updating...")
          await updateUser("expo_notification_id", token)
      } else {
        console.log("Token is the same! Doing nothing...")
      }
    }  

    async function fetchPingsAndColleges() {
        setRefreshing(true)
        const fetchedUser = await fetchUser()

        await fetchPings(fetchedUser)
        await fetchColleges(fetchedUser)

        setRefreshing(false)
    }

    async function fetchUser() {
      const fetchedUser = await getUser()
      setUser(fetchedUser)
      return fetchedUser
    }

    async function fetchPings(user) {
        let fetchedPings = []

        switch (feedType) {
          case "friends":
            console.log("Fetching Friends")
            fetchedPings = await getFollowingPings()
            break;
          case "college":
            console.log("Fetching", user?.college)
            fetchedPings = await getCollegePings()
            break;
          default:
            console.log("Fetching College:", feedType)
            fetchedPings = await getPings(feedType)
        }
  
        console.log("Fetched", fetchedPings.length, "pings. First entry:", fetchedPings[0])
        setPings(fetchedPings);      
    }

    async function fetchColleges(user) {
        const fetchedColleges = await getColleges()
        const cleanedColleges = fetchedColleges.map(college => ({ label: college.nickname ?? abbreviate(college.name), value: college.name }))
        console.log("Fetched", fetchedColleges.length, 'colleges. First entry:', fetchedColleges[0])

        setDropdownData([
          { label: user.college_nickname ?? abbreviate(user.college), value: 'college' },
          { label: 'Following', value: 'friends' },
          ...cleanedColleges
        ])
    }
    
    useFocusEffect(
      useCallback(() => {
        fetchUser()
      }, [])
    );
  
    useEffect(() => {
      updateToken()
    }, []); 

     useEffect(() => {
      fetchPingsAndColleges()
    }, [feedType]); 


    const onRefresh = useCallback(async() => {
      await fetchPingsAndColleges()
    }, [feedType]);


 
    if (!user || !pings || !dropdownData) {
      return (
        <View style={[styles.container, {justifyContent: "center", alignItems: "center"}]}>
            <ActivityIndicator />
        </View>
      )
    }

    const header = (
      <View style={styles.header}>
          <View style={{flex: 0.8, flexDirection: "row", alignItems: "center"}}>
                <Image style={{width: 60, height: 60, resizeMode: "cover"}} source={require('../../assets/torus.png')}></Image>

                <Dropdown
                  containerStyle={{width: 140, borderRadius: 10, backgroundColor: "rgb(22, 23, 24)", borderWidth: 1, borderColor: "white"}}
                  itemContainerStyle={{borderRadius: 10}}
                  itemTextStyle={styles.text}
                  selectedTextStyle={[styles.text, {fontWeight: "bold"}]}
                  style={{borderRadius: 10}}
                  activeColor='rgb(22, 23, 24)'
                  data={dropdownData}
                  placeholder={Platform.OS === "ios" ? (user.college_nickname ?? abbreviate(user.college)) : 'Torus'}
                  placeholderStyle={styles.text}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  value={feedType}
                  onChange={item => {setFeedType(item.value)}}
                />

          </View>
   

          <View style={{flex: 0.3, flexDirection: 'row', justifyContent: "space-between"}}>
                <TouchableOpacity onPress={() => navigation.navigate("Search Colleges")}>
                    <Ionicons name="school" size={24} color="white" />
                </TouchableOpacity>
           
                <TouchableOpacity onPress={() => navigation.navigate("Messages")}>
                    <Ionicons name="chatbubble-ellipses" size={24} color="white" />

                    { user.hasUnreadMessages && (
                        <View style={{backgroundColor: "rgb(241, 67, 67)", width: 12, height: 12, borderRadius: 6, top: 0, right: 0, position: "absolute"}}/>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
                    <Ionicons name="notifications" size={24} color="white" />
                    
                    { user.notifications > 0 && (
                        <View style={{backgroundColor: "rgb(241, 67, 67)", width: 12, height: 12, borderRadius: 6, top: 0, right: 0, position: "absolute", justifyContent: "center", alignItems: "center"}}>
                            <Text style={{color: "white", fontSize: 8}}>{user.notifications <= 99 ? user.notifications : 99}</Text>
                        </View>
                    )}

                </TouchableOpacity>
          </View>
      </View>
      )

      return (
        
          <SafeAreaView style={styles.container}>

              <FlatList
                    ref={flatListRef}
                    ListHeaderComponent={header}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={"white"}/>}
                    data={pings}
                    renderItem={({item}) => (<Ping data={item} />)}
                    ItemSeparatorComponent={() => <View style={styles.item_seperator} />}
                    keyExtractor={(item) => item.post_id}
                    scrollEventThrottle={16}
                    onMomentumScrollBegin={handleScrollBegin}
                    onMomentumScrollEnd={handleScrollEnd}
                    onScroll={onScroll}
                />                 

              <Animated.View style={{opacity: fadeAnim, width: 50, height: 50, borderRadius: 25, backgroundColor: "white", position: "absolute", top: 100, right: 25, alignItems: "center", justifyContent: "center"}}>
                  <Pressable onPress={scrollToTop}>
                      <Feather name="arrow-up" size={24} color="black" />                  
                  </Pressable>
              </Animated.View>
      

            </SafeAreaView>
        )
    }
