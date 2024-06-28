
import React, { useEffect, useState } from 'react';
import { View, Image, Text,  TouchableOpacity, Pressable } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { starLoop, unstarLoop } from '../handlers';

export const Loop = ({ data, goToLoop }) => {
  const [starred, setStarred] = useState(data.isStarred)

  async function handleStar() {
    setStarred(previousState => !previousState)
    
    if (data.isStarred) {
      await unstarLoop(data.loop_id)
    } else {
      await starLoop(data.loop_id)
    }
  }


  return (
    <TouchableOpacity onPress={() => goToLoop(data.loop_id)}>
      <View style={{ marginVertical: 20, width: "100%", flexDirection: "row", paddingHorizontal: 20 }}>
          <Image style={{ width: 100, height: 100, borderRadius: 50 }} source={{ uri: data.pfp_url || data?.pfp_url  }} />
          
          <View style={{ flex: 3, left: 20 }}>
            <Text style={{ color: "white", fontWeight: "bold" }}>{data.name || data?.name}</Text>
            <Text style={{ color: "white" }}>{data.description || data?.description}</Text>
          </View>
          
          { data.isJoined && (
            <Pressable onPress={handleStar}>
              <Ionicons name={starred ? "star" : "star-outline"} size={24} color={'white'} />
            </Pressable>
          )}

      </View>
    </TouchableOpacity>
  );
}



