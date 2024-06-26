import React, { useState, useRef, useEffect, useCallback, useContext } from 'react';
import { View, RefreshControl, Image, Text, FlatList, Animated, ActivityIndicator } from "react-native";
import { useNavigation, useFocusEffect, useIsFocused } from '@react-navigation/native';

import { Ping } from '../../components/pings';
import { getUserPings } from "../../components/handlers";
import styles from "./styles";


export default function UserPings({ username, scrollToPing }) {
  // const { username, scrollToPing } = route.params;

  const [pings, setPings] = useState([]);
  const [refreshing, setRefreshing] = useState(false)

  const pings_ref = useRef(null)


  const onRefresh = useCallback(async() => {
    setRefreshing(true);
    await fetchUserPings()
    setRefreshing(false)
  }, []);

  const handleScrollToIndexFailed = (info) => {
    const wait = new Promise(resolve => setTimeout(resolve, 500));
    wait.then(() => {
        if (pings_ref.current) {
        pings_ref.current.scrollToIndex({ index: info.index, animated: true });
        }
    });
};

  async function fetchUserPings() {
    function findIndexById(arr, id) {
        return arr.findIndex(obj => parseInt(obj.post_id) === parseInt(id));
    }

    const pings = await getUserPings(username)
    console.log("Fetched", pings.length, "pings. Last entry:", pings[pings.length - 1])
    setPings(pings)

    if (scrollToPing) {
        console.log("Scrollnig To", scrollToPing)
        const index = findIndexById(pings, scrollToPing)
        setTimeout(() => {
          if (pings_ref.current) {
            pings_ref.current.scrollToIndex({ index: index, animated: true });
          }
        }, 1000);
      }
    }   

    const isFocused = useIsFocused()
    useEffect(() => {
      fetchUserPings()
      console.log("Pings screen refocused...", username, scrollToPing)
    }, [isFocused, scrollToPing]);
    
  
  if (!pings) {
    return (<ActivityIndicator />)
  }


  return (
    <View style={{flex: 1, backgroundColor: "rgb(22, 23, 24)"}}>
          <FlatList
                ref={pings_ref}
                onScrollToIndexFailed={handleScrollToIndexFailed}
                // refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                data={pings}
                renderItem={({item}) => 
                  <Ping data={item} openComment={scrollToPing}/>
                }
                ItemSeparatorComponent={() => <View style={styles.item_seperator}/>}
                keyExtractor={(item) => item.post_id}
            />
    </View>
  )
}
