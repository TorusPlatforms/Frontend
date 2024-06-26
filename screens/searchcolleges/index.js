
import React, { useState, useEffect } from "react";
import { View, Image, Text, Animated, TouchableOpacity, FlatList, SafeAreaView, RefreshControl } from "react-native";
import { SearchBar } from "react-native-elements";
import Ionicons from '@expo/vector-icons/Ionicons';

import styles from "./styles";
import { searchColleges } from "../../components/handlers/search";


export default function SearchColleges({ route, navigation }) {
  const [colleges, setColleges] = useState([]);
  const [search, setSearch] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchColleges() {
    const fetchedColleges = await searchColleges(search)
    console.log("Fetched", fetchedColleges.length, "colleges. First entry:", fetchedColleges[0])
    setColleges(fetchedColleges)
  }

  useEffect(() => {
    fetchColleges();
  }, [search]);

  async function onRefresh() {
      setRefreshing(true)
      await fetchColleges();
      setRefreshing(false)
  };

  const College = ({data}) => (
    <View style={{padding: 20, flexDirection: 'row', justifyContent: "space-between", alignItems: "center"}}>
        <View style={{maxWidth: "90%"}}>
              <Text style={[styles.text, {fontWeight: "bold"}]}>{data.name}</Text>
              <Text style={styles.text}>{data.state_province}</Text>
        </View>

        <TouchableOpacity style={{borderRadius: 12, backgroundColor: "rgb(47, 139, 128)"}}>
            <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>

    </View>
  );
    
   
  return (
    <SafeAreaView style={styles.container}>
      <View style={{paddingHorizontal: 10}}>
            <SearchBar
              placeholder={"Search Colleges"}
              containerStyle={{ backgroundColor: "rgb(22, 23, 24)", borderTopWidth: 0, borderBottomWidth: 0 }}
              onChangeText={setSearch}
              value={search}
            />
      </View>

      <FlatList
        style={{ paddingHorizontal: 20 }}
        data={colleges}
        ItemSeparatorComponent={() => <View style={styles.item_seperator} />}
        renderItem={({item}) => <College data={item} />}
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

