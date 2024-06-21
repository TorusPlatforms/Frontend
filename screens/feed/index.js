import React, { useState, useRef, useEffect, useCallback, useMemo, forwardRef } from 'react'
import { Text, View, TextInput, Pressable, FlatList, Image, KeyboardAvoidingView, Modal, Platform, RefreshControl, Share, Alert, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from '@react-navigation/native';

import { getUser, getPings, getFollowingPings } from "../../components/handlers";
import { abbreviate } from '../../components/utils';
import { Ping } from "../../components/pings";
import {  NewCommentModal } from '../../components/comments';
import styles from "./styles";


export default function Feed() {
    const navigation = useNavigation()
    
    const [dropdownData, setDropdownData] = useState([])
    const [feedType, setFeedType] = useState("college");

    const [refreshing, setRefreshing] = useState(false);

    const [user, setUser] = useState(null)
    const [pings, setPings] = useState(null)

    const modalRef = useRef()
    const [commentPing, setCommentPing] = useState(null)

    async function fetchPings(type) {
      const user = await getUser();
      setUser(user)

      let fetchedPings = []
      if (type == "college") {
        console.log("Fetching pings from College")
        fetchedPings = await getPings(user);
      } else if (type == "friends") {
        console.log("Fetching pings from Friends")
        fetchedPings = await getFollowingPings();
      } else {
        throw new Error("Type not defined in Feed")
      }

      console.log("Fetched", fetchedPings.length, "pings. First entry:", fetchedPings[0])
      setPings(fetchedPings);
  
      setDropdownData([
        { label: 'Friends', value: 'friends' },
        { label: abbreviate(user.college), value: 'college' },
      ]);

    }
  
    async function feedChange(type) {
      setFeedType(type)

      setRefreshing(true);
      await fetchPings(type)
      setRefreshing(false)    }


  
    const onRefresh = useCallback(async() => {
      setRefreshing(true);
      await fetchPings(feedType)
      setRefreshing(false)
    }, [feedType]);


    useEffect(() => {
      fetchPings(feedType);
    }, []); 
    


    if (!user || !pings) {
      return (
        <View style={[styles.container, {justifyContent: "center", alignItems: "center"}]}>
            <ActivityIndicator />
        </View>
      )
    }

    const header = (
      <View style={styles.header}>
          <View style={{flex: 0.3}}>
              <Dropdown
                containerStyle={styles.dropdownContainer}
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
                onChange={item => {
                  feedChange(item.value);
                }}
              />
          </View>

          <View>
              <Pressable onPress={() => navigation.navigate("Notifications")}>
                  <Ionicons name="notifications-outline" size={24} color="white" />
                  
                  { user.hasUnreadNotifications && (
                      <View style={{backgroundColor: "red", width: 12, height: 12, borderRadius: 6, top: 0, right: 0, position: "absolute"}}/>
                  )}

              </Pressable>
          </View>

      </View>
      )

      return (
        
          <SafeAreaView style={styles.container}>
              <FlatList
                    ListHeaderComponent={header}
                    style={{ paddingHorizontal: 20, zIndex: 1 }}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    data={pings}
                    renderItem={({item}) => (
                      <Ping 
                        data={item} 
                        navigation={navigation}
                        modalRef={modalRef}
                        setCommentPing={setCommentPing}
                    />
                    )}
                    ItemSeparatorComponent={() => <View style={styles.item_seperator} />}
                />


              <NewCommentModal modalRef={modalRef} commentPing={commentPing} />
                 
            </SafeAreaView>
        )
    }
