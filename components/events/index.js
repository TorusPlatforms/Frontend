import React, { useEffect, useState } from 'react';
import { View, Image, Text, Pressable, Alert, TouchableOpacity, TextInput } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';

import { strfEventDate, strfEventTime } from "../../components/utils";
import { deleteEvent, joinLeaveEvent } from "../../components/handlers";
import * as Linking from 'expo-linking';

const torus_default_url = "https://cdn.torusplatforms.com/torus_w_background.jpg"


export const Event = ({ data, navigation }) => {
    const [isJoined, setIsJoined] = useState(data.isJoined)

    async function handleDelete() {
      Alert.alert("Are you sure you want to delete this event?", "This is a permanent action that cannot be undone.", [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: async() => await deleteEvent(data.event_id)},
      ]);
    }

    async function handleJoinLeave() {
      const newJoined = (!isJoined)
      setIsJoined(newJoined)
      await joinLeaveEvent({event_id: data.event_id, endpoint: newJoined ? "join" : "leave"})
    }

    function openMaps() {
      Linking.openURL(`http://maps.google.com/?q=${data.address}`);
    }

    function openCalender() {
      function convertTimestampToCustomFormat(timestamp) {
        function convertTimestampToString(timestamp) {
          const date = new Date(timestamp);
          const isoString = date.toISOString().replace(/\.\d{3}/, '');
          const customFormat = isoString.replace(/[-:]/g, '').replace('T', 'T').replace('Z', 'Z');
          return customFormat
        }

        const date = new Date(timestamp)
    
        return convertTimestampToString(date) + "/" + convertTimestampToString(date.getTime() + (60 * 60 * 1000)); //makes the event 1 hour long
    }

        Linking.openURL(`https://calendar.google.com/calendar/u/0/r/eventedit?text=${data.name}&dates=${convertTimestampToCustomFormat(data.time)}&details=${data.message}+\n\nLocation: ${data.address}&sf=true&output=xml`)
    }


    function handleUserPress() {
      if (data.loop_id && data.public) {
        navigation.push("Loop", {loop_id: data.loop_id})
      } else {
        navigation.push("UserProfile", {username: data.author})
      }
    }

    return (
        <View style={{ marginVertical: 20, width: "100%", flexDirection: "row", flex: 1, paddingBottom: 10 }}>
            <View style={{flex: 0.2, alignItems: "center"}}>
              <Pressable onPress={handleUserPress}>
                  <Image style={{ width: 50, height: 50, borderRadius: 25 }} source={{ uri: data.pfp_url }} />
              </Pressable>

              <View style={{marginVertical: 12, width: 1, flex: 0.9, backgroundColor: "gray"}} />

              <View style={{alignItems: 'center'}}>
                <Image style={{ left: -8, width: 30, height: 30, borderRadius: 15, position: "absolute" }} source={{ uri: data.mutual_attendees_pfp_urls[0] || data?.mutual_attendees_pfp_urls[0] || torus_default_url }} />
                <Image style={{ right: -8, width: 30, height: 30, borderRadius: 15, position: "absolute" }} source={{ uri: data.mutual_attendees_pfp_urls[1] || data?.mutual_attendees_pfp_urls[1] || torus_default_url }} />
              </View>
            </View>

            <View style={{flex: 0.8, flexDirection: 'column'}}>
              <View style={{borderRadius: 20, borderWidth: 2, borderColor: "gray"}}>
                <View style={{ justifyContent: "space-between", padding: 20, minHeight: 150}}>
                      <View>
                          <TouchableOpacity onPress={handleUserPress}>
                              <Text style={{ color: "lightgray", fontSize: 12 }}>{(data.loop_id && data.public) ? "[LOOP] " : ""}{data.author}</Text>
                          </TouchableOpacity>

                        <View style={{flexDirection: 'row', justifyContent: "space-between", marginVertical: 4}}>
                          <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>{data.name || data?.name}</Text>
                        </View>

                        <TouchableOpacity onPress={openCalender}>
                            <Text style={{ color: "white" }}>{strfEventDate(data.time)} @ {strfEventTime(data.time)}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={(openMaps)} style={{marginVertical: 4}}>
                          <Text style={{ color: "white", textDecorationLine: "underline", fontSize: 12 }}>{data.address || data?.address}</Text>
                        </TouchableOpacity>
                      </View>

                      <View style={{marginTop: 15, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
                          <TextInput multiline editable={false} style={{ color: "white", maxWidth: 200, padding: 2 }} value={data.message}></TextInput>

                          {!data.image_url && data.isCreator && (
                            <TouchableOpacity onPress={handleDelete}>
                                <Feather
                                    name="trash"
                                    size={20}
                                    color="white"
                                    style={{ opacity: 0.5 }}
                                />
                            </TouchableOpacity>
                          )}
                      </View>
                  </View>

                  {data.image_url && (
                      <View style={{ position: 'relative' }}>
                          <Image
                              style={{
                                  width: "100%",
                                  height: 150,
                                  resizeMode: "cover",
                                  borderBottomLeftRadius: 20,
                                  borderBottomRightRadius: 20
                              }}
                              source={{ uri: data.image_url || data?.image_url }}
                          />

                          { data.isCreator && (
                            <TouchableOpacity onPress={handleDelete}>
                                <Feather
                                    name="trash"
                                    size={20}
                                    color="white"
                                    style={{ position: 'absolute', bottom: 10, right: 10, opacity: 0.5 }}
                                />
                            </TouchableOpacity>
                            
                          )}
                          
                      </View>
                  )}
              </View>
               
                <View style={{flexDirection: "row", justifyContent: data.mutual_usernames.length > 0 ? "space-between" : "flex-end", alignItems: "center", paddingTop: 20, paddingRight: 10}}>
                  {data.mutual_usernames.length == 1 && (
                    <Text style={{color: "white", fontSize: 12}}>{data.mutual_usernames[0]} is attending</Text>
                  )}

                  {data.mutual_usernames.length == 2 && (
                    <Text style={{color: "white", fontSize: 12, maxWidth: 150}}>{data.mutual_usernames.slice(0, 2)?.join(" & ")} are attending</Text>
                  )}

                  {data.mutual_usernames.length > 2 && (
                    <Text style={{color: "white", fontSize: 12, maxWidth: 150}}>{data.mutual_usernames.slice(0, 2)?.join(", ")} & {data.mutual_usernames.length - 2} others are attending</Text>
                  )}

                  <Pressable onPress={handleJoinLeave} style={{borderRadius: 5, borderColor: "gray", borderWidth: 1, padding: 4, paddingHorizontal: 20, backgroundColor: isJoined ? "rgb(62, 62, 62)" : "rgb(47, 139, 128)"}}>
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