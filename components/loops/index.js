
import React, { useEffect, useState } from 'react';
import { View, Image, Text, Animated, Pressable, FlatList, SafeAreaView, RefreshControl } from "react-native";
import { SearchBar } from "react-native-elements";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";

import styles from "./styles";

export const Loop = ({ data, goToLoop }) => {
  return (
    <Pressable onPress={() => goToLoop(data.loop_id)}>
      <View style={{ marginVertical: 20, width: "100%", flexDirection: "row", paddingHorizontal: 20 }}>
        <Image style={{ width: 100, height: 100, borderRadius: 50 }} source={{ uri: data.profile_picture || data?.profile_picture }} />
        <View style={{ flex: 3, left: 20 }}>
          <Text style={{ color: "white", fontWeight: "bold" }}>{data.name || data?.name}</Text>
          <Text style={{ color: "white" }}>{data.description || data?.description}</Text>

        </View>
      </View>
    </Pressable>
  );
}



