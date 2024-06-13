import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, Image, Text, TextInput, TouchableWithoutFeedback, Keyboard, ActivityIndicator, Pressable, Platform, KeyboardAvoidingView, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from "react-native-safe-area-context";

import { requestCameraPerms, requestPhotoLibraryPerms, openCamera, pickImage } from "../../components/imagepicker";
import { getUser, createEvent, getGoogleMapsKey } from "../../components/handlers";
import { strfEventDate, strfEventTime } from "../../components/utils";
import styles from "./styles";
import { Input } from "react-native-elements";

const torus_default_url = "https://cdn.torusplatform.com/5e17834c-989e-49a0-bbb6-0deae02ae5b5.jpg"

export default function CreateEvent({ route }) {
  const navigation = useNavigation();
  const [user, setUser] = useState(null)
  const [key, setKey] = useState(null)

  const [name, setName] = useState("");
  const [message, setMessage] = useState("A hella cool fun event. All are welcoem!");
  const [address, setAddress] = useState("");


  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date())
  const [displayDate, setDisplayDate]= useState(Platform.OS === "android" ? strfEventDate(date) : "")
  const [displayTime, setDisplayTime] = useState(Platform.OS === "android" ? strfEventTime(time) : "")

  const [showCalendar, setShowCalendar] = useState(Platform.OS === "android" ? false : true);
  const [showClock, setShowClock] = useState(Platform.OS === "android" ? false : true);

  
  const [image, setImage] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const user = await getUser()
      setUser(user)
      setName(user.username + "'s event")
    }

    async function fetchGoogleMapsKey() {
      const key = await getGoogleMapsKey();
      setKey(key)
    }

    fetchUser()
    fetchGoogleMapsKey()

    requestCameraPerms()
    requestPhotoLibraryPerms()
    console.log(user, key)
  }, []); 

  const closeKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleBackgroundPress = () => {
    closeKeyboard();
  };

  const handleImageSelect = (image) => {
    if (!image.canceled) {
      setImage(image);
    }
    console.log("Selected Image in CreateEvent:", image);
  };


  const removeImage = () => {
    setImage(null);
  };


  async function handlePost() {
    const eventData = {
      name: name, 
      address: address, 
      day: date, 
      time: time, 
      details: message, 
      image: image, 
      isPublic: route.params?.loop ? false : true,
      loop_id: route.params?.loop.loop_id
    }

    console.log("Event data", eventData)

    await createEvent(eventData);
    navigation.goBack()
  }

  function onChangeDate(event, selectedDate) {

    if (Platform.OS === "android") {
        setShowCalendar(false);
        setDate(selectedDate);
        setDisplayDate(strfEventDate(selectedDate))
    } else {
      setDate(selectedDate);
    }
    
  };

  function onChangeTime(event, selectedTime) {
    if (Platform.OS === "android") {
      setShowClock(false);
      setTime(selectedTime);
      setDisplayTime(strfEventTime(selectedTime))
    } else {
        setTime(selectedTime);
    }
  };




  if (!user || !key) {
    return <ActivityIndicator />
  }


  return (
    <TouchableWithoutFeedback style={{backgroundColor: "rgb(22, 23, 24)"}} onPress={handleBackgroundPress}>
      <SafeAreaView style={styles.container}>
          <View style={{flex: 0.2}}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 10 }}>
              <Text style={{ fontSize: 16, color: "white", paddingLeft: 10 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
    
          <View style={{ alignItems: 'center', flex: 0.3}}>
            <Text style={{ fontWeight: "bold", fontSize: 20, color: "white" }}>Create Event</Text>
            <Text style={{ fontSize: 16, color: "white", textAlign: "center", marginTop: 5, paddingHorizontal: 25 }}>{route.params?.loop ? `Posting in ${route.params.loop.name}` : "Get together. Reunite. Connect."}</Text>
          </View>     

          <View style={{flex: 2, flexDirection: "row", paddingHorizontal: 25}}>
              <View style={{ width: "100%", flexDirection: "row", flex: 0.2 }}>
                  <View style={{alignItems: "center"}}>
                      <Image style={{ width: 50, height: 50, borderRadius: 25 }} source={{ uri: user.pfp_url }} />
                      <View style={{marginVertical: 12, width: 1, height: "85%", backgroundColor: "gray"}} />
                      <View style={{alignItems: 'center'}}>
                        <Image style={{ width: 30, height: 30, borderRadius: 15, position: "absolute" }} source={{ uri: user.pfp_url }} />
                      </View>
                  </View>
              </View>


              <View style={{flex: 0.8, flexDirection: 'column'}}>
                  <View style={{ justifyContent: "space-between", borderWidth: 2, borderBottomWidth: 0, borderColor: "gray", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, height: 300}}>
                      <View>
                        <Input 
                          value={name}
                          onChangeText={setName}
                          style={{color: 'white', fontSize: 16 }}
                          placeholder={user.username + "'s event"}
                          placeholderTextColor={"gray"}
                        />

                        <View style={{marginBottom: 10, marginTop: -10, flexDirection: "row", justifyContent: "space-between"}}>
                          <View>
                            {Platform.OS === "android" && (
                                <Pressable onPress={() => setShowCalendar(true)}>
                                    <Text style={{color: "white"}}>{displayDate}</Text>
                                </Pressable>
                            )}
                    

                            { showCalendar && (
                              <View style={{marginLeft: -15}}>
                                <DateTimePicker
                                    value={date}
                                    mode={'date'}
                                    onChange={onChangeDate}
                                />
                              </View>
                            )}
                          </View>
                          
                          <View>
                                {Platform.OS === "android" && (
                                    <Pressable onPress={() => setShowClock(true)}>
                                      <Text style={{color: "white"}}>{displayTime}</Text>
                                    </Pressable>
                                )}

                                { showClock && (
                                  <View style={{marginLeft: -20}}>
                                    <DateTimePicker
                                        value={time}
                                        mode={'time'}
                                        onChange={onChangeTime}
                                    />
                                  </View>
                                )}
                          </View>
                        </View>
                        
                        <View style={{height: 130}}>
                          <GooglePlacesAutocomplete
                              styles={{description: {fontSize: 12, color: "white"}, row: {backgroundColor: "rgb(22, 23, 24)"}}}
                              placeholder={"Where is it happening?"}
                              onPress={(data, details = null) => {
                                console.log(data, details);
                                setAddress(data.description)
                              }}
                              query={{
                                key: key,
                                language: 'en',
                              }}
                            />
                        </View>
                      </View>

                      <View>
                          <TextInput
                            placeholderTextColor={"gray"}
                            placeholder="Fun details"
                            style={{color: "white", fontSize: 14}}
                            value={message}
                            onChangeText={setMessage}
                          />
                      </View>
                  </View>


                    <Pressable onPress={() => pickImage(handleImageSelect)}>
                      <Image style={{borderWidth: 2, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, borderColor: 'gray', width: "100%", height: 200, resizeMode: "cover"}} source={{ uri: image.assets[0].uri || torus_default_url }} />
                    </Pressable>

              </View>
          </View>
          
          

            <View style={{alignItems: "center", flex: 0.5, justifyContent: "center"}}>
                <Pressable
                  style={{ backgroundColor: "rgb(54, 163, 107)", borderRadius: 20, borderWidth: 1, borderColor: "black", paddingVertical: 10, paddingHorizontal: 25, marginTop: 20, width: "80%" }}
                  onPress={handlePost}
                >
                    <Text style={{ color: "black", textAlign: "center" }}>Post</Text>
                </Pressable>
            </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}


