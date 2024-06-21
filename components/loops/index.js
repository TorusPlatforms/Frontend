
import React, { useEffect, useState } from 'react';
import { View, Image, Text,  TouchableOpacity } from "react-native";


export const Loop = ({ data, goToLoop }) => {

  console.log("rendering loop", data)
  return (
    <TouchableOpacity onPress={() => goToLoop(data.loop_id)}>
      <View style={{ marginVertical: 20, width: "100%", flexDirection: "row", paddingHorizontal: 20 }}>
          <Image style={{ width: 100, height: 100, borderRadius: 50 }} source={{ uri: data.pfp_url || data?.pfp_url  }} />
          
          <View style={{ flex: 3, left: 20 }}>
            <Text style={{ color: "white", fontWeight: "bold" }}>{data.name || data?.name}</Text>
            <Text style={{ color: "white" }}>{data.description || data?.description}</Text>
          </View>
      </View>
    </TouchableOpacity>
  );
}



