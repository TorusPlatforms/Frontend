import React, { useState, useRef, useEffect, useCallback, useMemo, forwardRef } from 'react'
import { Text, View, TextInput, Pressable, FlatList, Image, TouchableOpacity, Modal, Platform, RefreshControl, Share, Alert, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from '@react-navigation/native';
import Popover from 'react-native-popover-view';
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
    }, []);


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
                  onChange={item => {
                    feedChange(item.value);
                  }}
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
