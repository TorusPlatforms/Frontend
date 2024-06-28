
import React, { useState, useEffect } from "react";
import { View, Image, Text, Animated, TouchableOpacity, FlatList, SafeAreaView, RefreshControl } from "react-native";
import { SearchBar } from "react-native-elements";
import Ionicons from '@expo/vector-icons/Ionicons';

import styles from "./styles";
import { searchColleges } from "../../components/handlers/search";
import { addCollege, removeCollege } from "../../components/handlers/colleges";


export default function SearchColleges({ }) {
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

  //setRefreshing is not inside the fetchColleges function because otherwise it will buffer whenver you type
  async function onRefresh() {
      setRefreshing(true)
      await fetchColleges();
      setRefreshing(false)
  };

  async function handleAdd(college_id) {
    setRefreshing(true)
    await addCollege(college_id)
    await fetchColleges()
    setRefreshing(false)
  }

  async function handleRemove(college_id) {
    setRefreshing(true)
    await removeCollege(college_id)
    await fetchColleges()
    setRefreshing(false)
  }

  const College = ({data}) => (
    <View style={{padding: 20, flexDirection: 'row', justifyContent: "space-between", alignItems: "center"}}>
        <View style={{maxWidth: "90%", alignItems: "center"}}>
            <Text style={{color: "white", fontWeight: "bold"}}>{data.name}</Text>
        </View>

        { !data.isAdded && (
            <TouchableOpacity style={{borderRadius: 12, backgroundColor: "rgb(47, 139, 128)"}} onPress={() => handleAdd(data.college_id)}>
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
        )}
        
        { data.isAdded && (
            <TouchableOpacity style={{borderRadius: 12, backgroundColor: "rgb(208, 116, 127)"}} onPress={() => handleRemove(data.college_id)}>
              <Ionicons name="remove" size={24} color="white" />
            </TouchableOpacity>
        )}

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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="white" />}
        keyExtractor={item => item.college_id}
      />
    </SafeAreaView>
  );
};

