
import React, { useState, useEffect } from "react";
import { View, Image, Text, Animated, TouchableOpacity, FlatList, SafeAreaView, RefreshControl, ActivityIndicator } from "react-native";

import styles from "./styles";
import { getVotedUsers } from "../../components/handlers";

export default function VotedUsers({ navigation, route }) {
  const { poll_id } = route.params

  const [choices, setChoices] = useState()
  const [users, setUsers] = useState();

  async function fetchUsers() {
    const poll = await getVotedUsers(poll_id)
    const fetchedUsers = []
    poll.votes.map(vote => fetchedUsers.push({...vote.torus_user, choice: vote.choice}))

    setChoices(poll.choices)
    setUsers(fetchedUsers)
  }

  useEffect(() => {
    fetchUsers();
  }, [poll_id]);


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
                <Text style={{color: "lightgray"}}>Voted for: {choices[data.choice]}</Text>
            </View>

        </View>
    </TouchableOpacity>
  );
    
  if (!choices || !users) {
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
            renderItem={({item}) => <User data={item} />}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="white" />}
            keyExtractor={item => item.username}
        />
    </SafeAreaView>
  );
};
