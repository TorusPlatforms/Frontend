
import React, { useState, useEffect } from "react";
import { View, Image, Text, Animated, TouchableOpacity, FlatList, SafeAreaView, RefreshControl } from "react-native";
import { SearchBar } from "react-native-elements";

import styles from "./styles";
import { searchUsers } from "../../components/handlers/search";


export default function SearchUsers({ navigation }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState(null);

  async function fetchUsers() {
    const fetchedUsers = await searchUsers(search)
    setUsers(fetchedUsers)
  }

  useEffect(() => {
    fetchUsers();
  }, [search]);




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
        <View style={{ marginVertical: 10, width: "100%", flexDirection: "row", paddingHorizontal: 20, flex: 1, alignItems: "center"}}>
            <Image style={{ width: 50, height: 50, borderRadius: 25}} source={{uri: data.pfp_url}}/>

            <View style={{flex: 3, left: 20}}>
                <Text style={{fontWeight: "bold", color: "white"}}>{data.display_name}</Text>
                <Text style={{color: "white"}}>{data.username}</Text>
            </View>

        </View>
    </TouchableOpacity>
  );
    
   

  return (
    <SafeAreaView style={styles.container}>
      <View style={{paddingHorizontal: 10}}>
            <SearchBar
              placeholder={"Search Users"}
              containerStyle={{ backgroundColor: "rgb(22, 23, 24)", borderTopWidth: 0, borderBottomWidth: 0 }}
              onChangeText={setSearch}
              value={search}
            />
      </View>

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
