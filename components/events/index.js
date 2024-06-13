import React, { useEffect, useState } from 'react';
import { View, Image, Text, Pressable } from "react-native";

import { strfEventDate } from "../../components/utils";
import { joinLeaveEvent } from "../../components/handlers";
import * as Linking from 'expo-linking';

const torus_default_url = "https://cdn.torusplatform.com/5e17834c-989e-49a0-bbb6-0deae02ae5b5.jpg"


export const Event = ({ data }) => {
    data.image_url = data.image_url || torus_default_url
    const [isJoined, setIsJoined] = useState(data.isJoined)

    async function handleJoinLeave() {
      setIsJoined(!isJoined)
      await joinLeaveEvent(data)
    }

    function openMaps() {
      Linking.openURL(`http://maps.google.com/?q=${data.address}`);
    }

    return (
        <View style={{ marginVertical: 20, width: "100%", flexDirection: "row", flex: 1 }}>
            <View style={{flex: 0.2, alignItems: "center"}}>
              <Image style={{ width: 50, height: 50, borderRadius: 25 }} source={{ uri: torus_default_url }} />
              <View style={{marginVertical: 12, width: 1, height: "70%", backgroundColor: "gray"}} />
              <View style={{alignItems: 'center'}}>
                <Image style={{ left: -8, width: 30, height: 30, borderRadius: 15, position: "absolute" }} source={{ uri: data.mutual_attendees_pfp_urls[0] || data?.mutual_attendees_pfp_urls[0] || torus_default_url }} />
                <Image style={{ right: -8, width: 30, height: 30, borderRadius: 15, position: "absolute" }} source={{ uri: data.mutual_attendees_pfp_urls[1] || data?.mutual_attendees_pfp_urls[1] || torus_default_url }} />
              </View>
            </View>

            <View style={{flex: 0.8, flexDirection: 'column'}}>
              <View style={{borderRadius: 20, borderWidth: 2, borderColor: "gray"}}>
                <View style={{ justifyContent: "space-between", padding: 20, height: 150}}>
                      <View>
                        <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>{data.name || data?.name}</Text>
                        <Text style={{ color: "white" }}>{strfEventDate(data.time) || data?.time}</Text>
                        <Pressable onPress={(openMaps)}>
                          <Text style={{ color: "white", textDecorationLine: "underline", fontSize: 12 }}>{data.address || data?.address}</Text>
                        </Pressable>
                      </View>

                      <View style={{marginTop: 15}}>
                        <Text style={{ color: "white" }}>{data.message || data?.message}</Text>
                      </View>
                  </View>

                  {data.image_url && (
                      <Image style={{
                          width: "100%", 
                          height: 150, 
                          resizeMode: "cover",
                          borderBottomLeftRadius: 20,
                          borderBottomRightRadius: 20
                      }} source={{ uri: data.image_url || data?.image_url }} />
                  )}

              </View>
               
                <View style={{flexDirection: "row", justifyContent: data.attendee_ids.length > 0 ? "space-between" : "flex-end", alignItems: "center", marginTop: 10}}>
                  {data.attendee_ids.length == 1 && (
                    <Text style={{color: "white", fontSize: 12}}> 1 other is attending</Text>
                  )}

                  {data.attendee_ids.length > 1 && (
                    <Text style={{color: "white", fontSize: 12}}> {data.mutual_attendees.join(",")} & {data.attendee_ids.length} others are attending</Text>
                  )}

                  <Pressable onPress={handleJoinLeave} style={{borderRadius: 5, borderColor: "gray", borderWidth: 1, padding: 4, paddingHorizontal: 20, backgroundColor: isJoined ? "blue" : "rgb(22, 23, 24)"}}>
                    <Text style={{ color: "white" }}>{isJoined ? "Joined" : "Join"}</Text>
                  </Pressable>
                </View>
                {/* <View style={{marginBottom: 30, marginTop: 20}}>
                    {data.attendees_url.map((url, index) => (
                    <Image
                      key={index}
                      style={{ position: "absolute", left: index * 10 + 10, width: 30, height: 30, borderRadius: 15 }}
                      source={{ uri: url }}
                    />
                  ))} */}
            </View>

        </View>
    );
  }