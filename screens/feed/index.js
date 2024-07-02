import React, { useState, useRef, useEffect, useCallback, useMemo, forwardRef } from 'react'
import { Text, View, TextInput, Pressable, FlatList, Image, TouchableOpacity, Modal, Platform, RefreshControl, Share, Alert, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from '@react-navigation/native';
import Popover from 'react-native-popover-view';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import _ from 'lodash';

import { getUser, getPings, getFollowingPings, updateUser } from "../../components/handlers";
import { abbreviate } from '../../components/utils';
import { Ping } from "../../components/pings";
import styles from "./styles";
import { getColleges } from '../../components/handlers/colleges';


export default function Feed() {
    const navigation = useNavigation()
    
    const [dropdownData, setDropdownData] = useState([])
    const [feedType, setFeedType] = useState("college");
    const [refreshing, setRefreshing] = useState(false);

    const [user, setUser] = useState(null)
    const [pings, setPings] = useState(null)

    
    function handleRegistrationError(errorMessage) {
        alert(errorMessage);
        throw new Error(errorMessage);
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
            handleRegistrationError('Must use physical device for push notifications');
        }
    }
      
    
    async function fetchPingsAndColleges() {
        setRefreshing(true)

        const fetchedUser = await getUser()
        setUser(fetchedUser)

        const token = await registerForPushNotificationsAsync()
        if (token != fetchedUser.expo_notification_id) {
            console.log("Token has changed! Updating...")
            await updateUser("expo_notification_id", token)
        } else {
          console.log("Token is the same! Doing nothing...")
        }
        
        await fetchPings(fetchedUser)
        await fetchColleges(fetchedUser)

        setRefreshing(false)
    }

    async function fetchPings(user) {
        let fetchedPings = []

        switch (feedType) {
          case "friends":
            console.log("Fetching friends")
            fetchedPings = await getFollowingPings()
            break;
          case "college":
            console.log("Fetching", user.college)
            fetchedPings = await getPings(user.college)
            break;
          default:
            console.log("Fetching college", feedType)
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

    useEffect(() => {
      fetchPingsAndColleges()
    }, [feedType]); 
    

  
    const onRefresh = useCallback(async() => {
      await fetchPingsAndColleges()
    }, [feedType]);


 

 
    if (!user || !pings) {
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
                  containerStyle={{width: 140, borderRadius: 10, backgroundColor: "rgb(22, 23, 24)", borderWidth: 1, borderColor: "white" }}
                  itemContainerStyle={{borderRadius: 10}}
                  itemTextStyle={styles.text}
                  selectedTextStyle={[styles.text, {fontWeight: "bold"}]}
                  activeColor='rgb(22, 23, 24)'
                  data={dropdownData}
                  placeholder='Torus'
                  placeholderStyle={[styles.text, {fontWeight: "bold", fontSize: 24}]}
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

                <Popover
                    from={(
                      <TouchableOpacity>
                          <Ionicons name="information-circle" size={24} color="white" />
                      </TouchableOpacity>
                    )}>

                    <View style={{backgroundColor: "rgb(22, 23, 24)", padding: 20}}>
                      <Text style={{color: "white"}}>Your account has been registered to: {user.college}</Text>
                    </View>
                </Popover>

                <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
                    <Ionicons name="notifications-outline" size={24} color="white" />
                    
                    { user.hasUnreadNotifications && (
                        <View style={{backgroundColor: "red", width: 12, height: 12, borderRadius: 6, top: 0, right: 0, position: "absolute"}}/>
                    )}

                </TouchableOpacity>
          </View>
      </View>
      )

      return (
        
          <SafeAreaView style={styles.container}>

              <FlatList
                    ListHeaderComponent={header}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={"white"}/>}
                    data={pings}
                    renderItem={({item}) => (<Ping data={item} />)}
                    ItemSeparatorComponent={() => <View style={styles.item_seperator} />}
                    keyExtractor={(item) => item.post_id}
                />                 
            </SafeAreaView>
        )
    }
