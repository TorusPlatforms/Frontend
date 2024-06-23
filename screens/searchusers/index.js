
import React, { useState, useEffect } from "react";
import { View, Image, Text, Animated, TouchableOpacity, FlatList, SafeAreaView, RefreshControl } from "react-native";
import { SearchBar } from "react-native-elements";

import styles from "./styles";
import { searchUsers } from "../../components/handlers/search";


export default function SearchUsers({ route, navigation }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchUsers() {
    const fetchedUsers = await searchUsers(search)
    setUsers(fetchedUsers)
  }

  useEffect(() => {
    fetchUsers();
  }, [search]);

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
        <View style={styles.userContainer}>
            <Image style={styles.pfp} source={{uri: data.pfp_url}}/>

            <View style={{flex: 3, left: 20}}>
                <Text style={[styles.text, {fontWeight: "bold"}]}>{data.display_name}</Text>
                <Text style={styles.text}>{data.username}</Text>
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="white"
          />
        }
      />
    </SafeAreaView>
  );
};



/*const exampleLoopData = {
            pfp: "https://cdn.discordapp.com/attachments/803748247402184714/822541056436207657/kobe_b.PNG?ex=658f138d&is=657c9e8d&hm=37b45449720e87fa714d5a991c90f7fac4abb55f6de14f63253cdbf2da0dd7a4&",
            displayName: "Grant's Epic Group",
            members: 120,
            interests: ["Golfing", "Frolicking", "Hijinks"]
        }   */     

