import React, { useState, useRef, useEffect, useCallback, useContext } from 'react';
import { View, RefreshControl, Image, Text, FlatList, Animated, ActivityIndicator } from "react-native";
import { useNavigation, useFocusEffect, useIsFocused } from '@react-navigation/native';

import { Ping } from '../../components/pings';
import { getUserPings } from "../../components/handlers";
import styles from "./styles";


export default function UserPings({ username }) {
    const [pings, setPings] = useState([]);

    const pings_ref = useRef(null)


    async function fetchUserPings() {
        const pings = await getUserPings(username)
        console.log("Fetched", pings.length, "pings. Last entry:", pings[pings.length - 1])
        setPings(pings)
    }   

    const isFocused = useIsFocused()

    useEffect(() => {
      fetchUserPings()
    }, [isFocused]);
    
    
    if (!pings) {
      return (<ActivityIndicator />)
    }


    return (
      <View style={{flex: 1, backgroundColor: "rgb(22, 23, 24)"}}>
            <FlatList
                  ref={pings_ref}
                  data={pings}
                  renderItem={({item}) => 
                    <Ping data={item} />
                  }
                  ItemSeparatorComponent={() => <View style={styles.item_seperator}/>}
                  keyExtractor={(item) => item.post_id}
              />
      </View>
    )
}
