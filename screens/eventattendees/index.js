
import React, { useState, useEffect } from "react";
import { View, Image, Text, Animated, TouchableOpacity, FlatList, SafeAreaView, RefreshControl, ActivityIndicator } from "react-native";

import styles from "./styles";
import { getEventAttendees } from "../../components/handlers";

export default function EventAttendees({ navigation, route }) {
  const { event_id } = route.params

  const [users, setUsers] = useState();

  async function fetchUsers() {
    const users = await getEventAttendees(event_id)
    console.log(users)

    setUsers(users)
  }

  useEffect(() => {
    fetchUsers();
  }, [event_id]);




  const [refreshing, setRefreshing] = useState(false);

  async function onRefresh() {
      setRefreshing(true)
      await fetchUsers();
      setRefreshing(false)
  };




  const User = ({data}) => (
    <TouchableOpacity onPress={() => {
      navigation.goBack();
      navigation.push("UserProfile", {username: data.username});
      }}>
        <View style={{ marginVertical: 10, width: "100%", flexDirection: "row", paddingHorizontal: 5, flex: 1, alignItems: "center"}}>
            <Image style={{ width: 50, height: 50, borderRadius: 25}} source={{uri: data.pfp_url}}/>

            <View style={{flex: 3, left: 20}}>
                <Text style={{fontWeight: "bold", color: "white"}}>{data.display_name}</Text>
                <Text style={{color: "white"}}>{data.username}</Text>
            </View>

        </View>
    </TouchableOpacity>
  );
    
  if (!users) {
      return (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgb(22, 23, 24)"}}>
            <ActivityIndicator />
        </View>
      )
  }

  return (
    <SafeAreaView style={styles.container}>
        <FlatList
            style={{ paddingHorizontal: 20 }}
            data={users}
            ItemSeparatorComponent={() => <View style={styles.item_seperator} />}
            renderItem={({item}) => <User data={item.attendee} />}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="white" />}
            keyExtractor={item => item.attendee.username}
        />
    </SafeAreaView>
  );
};
