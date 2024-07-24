import React, { useEffect, useState } from 'react';
import { View, Image, Text, Pressable, Alert, TouchableOpacity, TextInput } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Lightbox from 'react-native-lightbox-v2';
import { useNavigation } from '@react-navigation/native';
import * as Linking from 'expo-linking';

import { strfEventDate, strfEventTime } from "../../components/utils";
import { deleteEvent, joinLeaveEvent } from "../../components/handlers";
import styles from "./styles"

const torus_default_url = "https://cdn.torusplatforms.com/torus_w_background.jpg"


export const Event = ({ data, showLoop = true }) => {
    const navigation = useNavigation()
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


    function handleUserPress({ prioritizeUser }) {
      //When we click on the PFP we ALWAYS want to go to the users profile even if its a loop event
      if ((data.loop_id && (data.public || !prioritizeUser))) {
        navigation.push("Loop", {loop_id: data.loop_id, initialScreen: "Events"})
      } else {
        navigation.push("UserProfile", {username: data.author})
      }
    }

    return (
        <View style={{ marginVertical: 20, width: "100%", flexDirection: "row", flex: 1, paddingBottom: 10 }}>
            <View style={{flex: 0.2, alignItems: "center"}}>
              <Pressable onPress={() => handleUserPress({prioritizeUser: true})}>
                  <Image style={{ width: 50, height: 50, borderRadius: 25 }} source={{ uri: data.pfp_url }} />
              </Pressable>

              <View style={{marginVertical: 12, width: 1, flex: data.image_url ? 0.9 : 0.75, backgroundColor: "gray"}} />

              <View style={{alignItems: 'center'}}>
                <Image style={{ left: -8, width: 30, height: 30, borderRadius: 15, position: "absolute" }} source={{ uri: data.mutual_attendees_pfp_urls[0] || torus_default_url }} />
                <Image style={{ right: -8, width: 30, height: 30, borderRadius: 15, position: "absolute" }} source={{ uri: data.mutual_attendees_pfp_urls[1] || torus_default_url }} />
              </View>
            </View>

            <View style={{flex: 0.8, flexDirection: 'column'}}>
              <View style={{borderRadius: 20, borderWidth: 2, borderColor: "gray"}}>
                <View style={{ padding: 20, minHeight: 150}}>
                      <TouchableOpacity onPress={handleUserPress} style={{flexDirection: "row", alignItems: "center"}}>
                          <Text style={{ color: "lightgray", fontSize: 12 }}>{data.author} { (data.loop_id && !data.public && showLoop) ? `(${data.loop_name})` : "" }</Text>
                      </TouchableOpacity>

                      <View style={{flexDirection: 'row', justifyContent: "space-between", marginVertical: 4}}>
                        <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>{data.name}</Text>
                      </View>

                      { data.address && (
                          <TouchableOpacity onPress={(openMaps)} style={{marginTop: 4, flexDirection: 'row', alignItems: 'flex-start'}}>
                            <FontAwesome name="map-marker" size={18} color="lightgray" />
                            <Text style={{ color: "white", fontStyle: "italic", fontSize: 12, marginLeft: 8, marginTop: 2, maxWidth: 200, lineHeight: 15 }}>{data.address}</Text>
                        </TouchableOpacity>
                      )}
                      

                      <TextInput multiline editable={false} scrollEnabled={false} style={{ color: "white", padding: 2, marginTop: 10, paddingBottom: data.image_url ? 0 : 40 }} value={data.message}></TextInput>
                    
                    </View>
       
                    {!data.image_url && data.isCreator && (
                        <View style={[styles.footerContainer, { marginBottom: 5 }]}>
                          <TouchableOpacity onPress={openCalender} style={[styles.timePill, {backgroundColor: data.isHappeningInNextHour ? "rgb(208, 116, 127)" : (data.isHappeningInNextDay ? "rgb(221, 160, 57)" : "rgb(47, 139, 128)")}]}>
                            <Feather name="clock" size={14} color="white" />
                                <Text style={styles.timePillText}>{strfEventDate(data.time, {short: true})}, {strfEventTime(data.time)}</Text>
                            </TouchableOpacity>

                            { data.isCreator && (
                                <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
                                    <Feather
                                        name="trash"
                                        size={14}
                                        color="white"
                                    />
                                </TouchableOpacity>
                            )}
                      </View>
                    )}


                  {data.image_url && (
                      <View>

                          <Lightbox navigator={navigation} activeProps={{style: styles.fullscreenImage}}>

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

                          </Lightbox>
                          
                          <View style={styles.footerContainer}>
                            <TouchableOpacity onPress={openCalender} style={[styles.timePill, {backgroundColor: data.isHappeningInNextHour ? "rgb(208, 116, 127)" : (data.isHappeningInNextDay ? "rgb(221, 160, 57)" : "rgb(47, 139, 128)")}]}>
                                <Feather name="clock" size={14} color="white" />
                                <Text style={styles.timePillText}>{strfEventDate(data.time, {short: true})}, {strfEventTime(data.time)}</Text>
                            </TouchableOpacity>

                            { data.isCreator && (
                              <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
                                  <Feather
                                      name="trash"
                                      size={14}
                                      color="white"
                                  />
                              </TouchableOpacity>
                            )}
                          </View>
               

                      </View>
                  )}
              </View>
               
              <View style={{flexDirection: "row", justifyContent: data.mutual_usernames.length > 0 ? "space-between" : "flex-end", alignItems: "center", paddingTop: 20, paddingRight: 10}}>
                {data.mutual_usernames.length == 1 && (
                  <Text style={{color: "white", fontSize: 12, maxWidth: 160}}>
                    <Text onPress={() => navigation.push("UserProfile", {username: data.mutual_usernames[0]})}>{data.mutual_usernames[0]} </Text>
                    is attending
                  </Text>
                )}

                {data.mutual_usernames.length == 2 && (
                  <Text style={{color: "white", fontSize: 12, maxWidth: 160}}>
                    <Text onPress={() => navigation.push("UserProfile", {username: data.mutual_usernames[0]})}>{data.mutual_usernames[0]} & </Text>
                    <Text onPress={() => navigation.push("UserProfile", {username: data.mutual_usernames[1]})}>{data.mutual_usernames[1]} </Text>
                    are attending
                  </Text>
                )}

                {data.mutual_usernames.length > 2 && (
                  <Text style={{color: "white", fontSize: 12, maxWidth: 150}}>{data.mutual_usernames.slice(0, 2)?.join(", ")} & {data.mutual_usernames.length - 2} others are attending</Text>
                )}

                <Pressable onPress={handleJoinLeave} style={{borderRadius: 5, borderColor: "gray", borderWidth: 1, padding: 4, paddingHorizontal: 20, backgroundColor: isJoined ? "rgb(62, 62, 62)" : "rgb(47, 139, 128)"}}>
                  <Text style={{ color: "white" }}>{isJoined ? "Joined" : "Join"}</Text>
                </Pressable>
              </View>
          </View>
        </View>
    );
  }