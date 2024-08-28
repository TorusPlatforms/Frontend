import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, ScrollView } from "react-native";
import { useNavigation, useFocusEffect, useIsFocused } from '@react-navigation/native';

import { Ping } from '../../components/pings';
import { getUserPings } from "../../components/handlers";
import styles from "./styles";


export default function UserPings({ username }) {
    const navigation = useNavigation()

    const [refreshing, setRefreshing] = useState()

    const [pings, setPings] = useState(null);

    const pings_ref = useRef(null)


    async function fetchUserPings() {
        const pings = await getUserPings(username)
        console.log("Fetched", pings.length, "pings. Last entry:", pings[pings.length - 1])
        setPings(pings)
    }   


    const onRefresh = useCallback(async() => {
        setRefreshing(true);
        await fetchUserPings()
        setRefreshing(false)
    }, []);

    useEffect(() => {
      fetchUserPings()
    }, [])


    if (!pings) {
      return (
        <View style={{flex: 1, backgroundColor: "rgb(22, 23, 24)", justifyContent: "center", alignItems: "center"}}>
            <ActivityIndicator />
        </View>
      )
    }


    return (
      <View style={{flex: 1, backgroundColor: "rgb(22, 23, 24)"}}>
        {pings.length > 0 ? (
           <FlatList
              // onScroll={onScroll}
              ref={pings_ref}
              data={pings}
              renderItem={({item}) => 
                <Ping data={item}/>
              }
              ItemSeparatorComponent={() => <View style={styles.item_seperator}/>}
              keyExtractor={(item) => item.post_id}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={"white"}/>}
            />
          ) : (
            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={"white"}/>}>
              <TouchableOpacity onPress={() => navigation.navigate("Feed")} style={{justifyContent: 'center', alignItems: 'center', marginTop: 50}}>
                  <Text style={{color: "lightgrey", textAlign: "center", maxWidth: 270}}>Looks like you haven't posted any pings... Send one to your campus!</Text>
              </TouchableOpacity>
            </ScrollView>
        
          )}
      </View>
    )
}
