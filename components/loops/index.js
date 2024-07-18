
import React, { useEffect, useState } from 'react';
import { View, Image, Text,  TouchableOpacity, Pressable } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from "@expo/vector-icons/Entypo"

import { updateMember } from '../handlers';
import { useNavigation } from '@react-navigation/native';

export const Loop = ({ data }) => {
  const [starred, setStarred] = useState()
  const navigation = useNavigation()

  async function handleStar(data) {
    console.log("Starring")
    const newStarred = (!starred)
    setStarred(previousValue => !previousValue)
    await updateMember({loop_id: data.loop_id, endpoint: "isStarred", value: newStarred})
  }

  useEffect(() => {
    setStarred(data.isStarred)
  }, [data])

  return (
    <TouchableOpacity onPress={() => navigation.push('Loop', { loop_id: data.loop_id })}>
      <View style={{ marginVertical: 20, width: "100%", flexDirection: "row", paddingHorizontal: 20, justifyContent: "space-between" }}>
        <View style={{flexDirection: "row", flex: 1}}>
            <Image style={{ width: 100, height: 100, borderRadius: 50 }} source={{ uri: data.pfp_url || data?.pfp_url  }} />
            
            <View style={{ flex: 3, left: 20, maxWidth: 200 }}>
              <Text style={{ color: "white", fontWeight: "bold", maxWidth: 150}}>{data.name || data?.name}</Text>  
              <Text style={{ color: "white", fontSize: 12, fontStyle: 'italic', marginTop: 2}}>{data.location || data?.location}</Text>
              <Text style={{ color: "white", marginTop: 10 }}>{data.description || data?.description}</Text>
            </View>
        </View>
          
          { data.isJoined ? (
            <View style={{justifyContent: "space-between"}}>

                <Pressable onPress={() => handleStar(data)}>
                  <Ionicons name={starred ? "star" : "star-outline"} size={24} color={'white'} />
                </Pressable>
                
                {data.hasUnreadMessages && (
                  <View>
                    <Ionicons name={"chatbubble-ellipses"} size={24} color={'white'} />
                    <View style={{backgroundColor: "rgb(241, 67, 67)", width: 12, height: 12, borderRadius: 6, top: 0, right: 0, position: "absolute"}}/>
                  </View>
                )}
                

                {data.hasUnreadAnnouncements && (
                  <View>
                      <Entypo name="megaphone" size={24} color="white" /> 
                      <View style={{backgroundColor: "rgb(241, 67, 67)", width: 12, height: 12, borderRadius: 6, top: 0, right: 0, position: "absolute"}}/>
                  </View>
                )}

            </View>
          ) : (
              <View style={{flexDirection: "row"}}>
                <Ionicons name="people" size={16} color="white"/>
                <Text style={{ color: "white", marginLeft: 5 }}>{data.member_count}</Text>
              </View>
          )}

      </View>
    </TouchableOpacity>
  );
}



