import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, Image, Text, TextInput, TouchableWithoutFeedback, Keyboard, ActivityIndicator, Pressable, Platform, Alert, ScrollView, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";
import { Input } from "react-native-elements";
import Lightbox from 'react-native-lightbox-v2';

import { requestCameraPerms, requestPhotoLibraryPerms, openCamera, pickImage } from "../../components/imagepicker";
import { getUser, createEvent, getGoogleMapsKey } from "../../components/handlers";
import { combineDateAndTime, strfEventDate, strfEventTime } from "../../components/utils";
import { AlreadyExistsError, InputError } from "../../components/utils/errors";

import styles from "./styles";


export default function CreateEvent({ route }) {
  const navigation = useNavigation();
  const [user, setUser] = useState(null)
  const [key, setKey] = useState(null)

  const [name, setName] = useState();
  const [message, setMessage] = useState();
  const [address, setAddress] = useState("");

  const [errorMessage, setErrorMessage] = useState(null)

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date())
  const [displayDate, setDisplayDate]= useState(Platform.OS === "android" ? strfEventDate(date) : "")
  const [displayTime, setDisplayTime] = useState(Platform.OS === "android" ? strfEventTime(time) : "")
  const [isPublic, setIsPublic] = useState(!(route.params?.loop))

  const [showCalendar, setShowCalendar] = useState(Platform.OS === "android" ? false : true);
  const [showClock, setShowClock] = useState(Platform.OS === "android" ? false : true);
  
  const [image, setImage] = useState(null);

  const [postEnabled, setPostEnabled] = useState(true)

  async function fetchUser() {
    const user = await getUser()
    setUser(user)
    setName(user.username + "'s event")
  }

  async function fetchGoogleMapsKey() {
    const key = await getGoogleMapsKey();
    setKey(key)
  }

  useEffect(() => {
    fetchUser()
    fetchGoogleMapsKey()

    requestCameraPerms()
    requestPhotoLibraryPerms()
  }, []); 

  const handleBackgroundPress = () => {
    Keyboard.dismiss();
  };

  function removeImage() {
    setImage(null)
  }

  const handleImageSelect = (fetchedImage) => {
    if (!fetchedImage.canceled) {
      setImage(fetchedImage);
    }
    console.log("Selected Image in CreateEvent:", fetchedImage);
  };

  function isToday(timestamp) {
      const inputDate = new Date(timestamp);
      const now = new Date();

      return (
          inputDate.getFullYear() === now.getFullYear() &&
          inputDate.getMonth() === now.getMonth() &&
          inputDate.getDate() === now.getDate()
      );
  }

  function isLessThan10MinutesAfterNow(timestamp) {
      const now = Date.now(); 
      const tenMinutesInMilliseconds = 10 * 60 * 1000; 
      const tenMinutesAfterNow = now + tenMinutesInMilliseconds;

      return timestamp < tenMinutesAfterNow;
  }

  async function handlePost() {
    try {
        setPostEnabled(false)

        setErrorMessage("")
        
        const combinedDate = combineDateAndTime(date, time)

        if (name.length == 0) {
          throw new InputError("Event must have a name")
        }

        if (isToday(combinedDate.getTime()) && isLessThan10MinutesAfterNow(combinedDate.getTime())) {
          throw new InputError("Cannot create an event starting in 10 minutes")
        }

        const eventData = {
          name: name, 
          address: address, 
          date: combinedDate, 
          message: message, 
          image: image, 
          isPublic: isPublic,
          loop_id: route.params?.loop.loop_id
        }

        console.log("Event data", eventData)

        await createEvent(eventData);
    } catch(error) {

      if (error instanceof AlreadyExistsError) {
          setErrorMessage("That event name is taken!")
      } else if (error instanceof InputError) {
          setErrorMessage(error.message)
      } else {
        alert("Something went wrong!")
        console.error(error)
      } 
    } finally {
      navigation.goBack()
    }
  }

  function onChangeDate(event, selectedDate) {
    if (Platform.OS === "android") {
        setShowCalendar(false);
        setDate(selectedDate);
        setDisplayDate(strfEventDate(selectedDate))
    } else {
      setDate(selectedDate);
      console.log("Date", date)
    }
    
  };

  function onChangeTime(event, selectedTime) {
    if (Platform.OS === "android") {
      setShowClock(false);
      setTime(selectedTime);
      setDisplayTime(strfEventTime(selectedTime))
    } else {
        setTime(selectedTime);
        console.log("Time", time)
    }
  };

  function handleLockPress() {
    let alertTitle, alertMessage = ""
    if (isPublic) {
      alertTitle = "Are you sure you want to make this event private?"
      alertMessage = "This means only members of this loop will be able to join this event."
    } else {
      alertTitle = "Are you sure you want to make this event public?"
      alertMessage = "This means anyone from your college will be able to join this event."
    }

    Alert.alert(alertTitle, alertMessage, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => setIsPublic(previousState => !previousState)},
    ]);

  }


  if (!user || !key) {
    return (
      <View style={{backgroundColor: "rgb(22, 23, 24)", flex: 1, justifyContent: 'center', alignItems: "center"}}>
        <ActivityIndicator />
      </View>
    )
  }


  return (
    <TouchableWithoutFeedback onPress={handleBackgroundPress}>

      <SafeAreaView style={styles.container}>

          <View style={{ alignItems: 'center', flex: 0.25}}>
            <Text style={{ fontWeight: "bold", fontSize: 20, color: "white" }}>Create Event</Text>
            <Text style={{ fontSize: 16, color: "white", textAlign: "center", marginTop: 5, paddingHorizontal: 25 }}>{route.params?.loop ? `Posting ${isPublic ? "as" : "in"} ${route.params.loop.name}` : "Get together. Reunite. Connect."}</Text>
            <Text style={{ fontSize: 16, color: "red", textAlign: "center", marginTop: 5 }}>{errorMessage}</Text>
          </View>     

          <View style={{flex: 2, flexDirection: "row", paddingHorizontal: 25, marginTop: 20}}>
              <View style={{ width: "100%", flexDirection: "row", flex: 0.2 }}>
                  <View style={{alignItems: "center"}}>
                      <Image style={{ width: 50, height: 50, borderRadius: 25 }} source={{ uri: user.pfp_url }} />
                      <View style={{marginVertical: 12, width: 1, height: "80%", backgroundColor: "gray"}} />
                      <View style={{alignItems: 'center'}}>
                        <Image style={{ width: 30, height: 30, borderRadius: 15, position: "absolute" }} source={{ uri: user.pfp_url }} />
                      </View>
                  </View>
              </View>


              <View style={{flex: 0.8, flexDirection: 'column'}}>
                  <View style={{ justifyContent: "space-between", borderWidth: 2,  borderColor: "gray", borderRadius: 20, flex: 1}}>
                      <View style={{flex: 1, padding: 20}}>
                          <View style={{justifyContent: 'space-between', flexDirection: "row", paddingRight: 25}}>
                              <Input 
                                onChangeText={text => setName(text.trim())}
                                style={{color: 'white', fontSize: 16 }}
                                defaultValue={user.username + "'s event"}
                                placeholderTextColor={"gray"}
                              />

                              {route.params?.loop && (route.params?.loop?.location == user.college) && (
                                <TouchableOpacity onPress={handleLockPress} style={{top: 5}} >
                                    <Ionicons name={isPublic ? "lock-open" : "lock-closed"} size={24} color={"white"}/>
                                </TouchableOpacity>
                              )}
                          </View>

                          
                          {/* date & time */}
                          <View style={{marginBottom: 10, marginTop: -10, flexDirection: "row", justifyContent: "space-between"}}>
                              <View>
                                {Platform.OS === "android" && (
                                    <Pressable onPress={() => setShowCalendar(true)}>
                                        <Text style={{color: "white"}}>{displayDate}</Text>
                                    </Pressable>
                                )}
                        

                                { showCalendar && (
                                  <View style={{marginLeft: -10}}>
                                    <DateTimePicker
                                        minimumDate={new Date()}
                                        value={date}
                                        mode={'date'}
                                        onChange={onChangeDate}
                                        accentColor="rgb(47, 139, 128)"
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
                                            accentColor="rgb(47, 139, 128)"
                                        />
                                      </View>
                                    )}
                                </View>
                            </View>
                          
                            {/* google maps */}
                            <View style={{flex: 0.5, zIndex: 1}}>
                              <GooglePlacesAutocomplete
                                  styles={{listView: {zIndex: 1, position: "absolute", height: 150, top: 50, borderRadius: 10, borderColor: "gray", borderWidth: 2}, description: {fontSize: 12, color: "white"}, row: {backgroundColor: "black"}}}
                                  placeholder={"Where is it happening?"}
                                  onPress={(data, details = null) => {
                                    setAddress(data.description)
                                  }}
                                  query={{
                                    key: key,
                                    language: 'en',
                                  }}
                                />
                            </View>

                            <View style={{flex: 1}}>
                                <TextInput
                                  maxLength={245}
                                  multiline
                                  placeholderTextColor={"gray"}
                                  placeholder="Event Details..."
                                  style={{color: "white", fontSize: 14, width: "100%"}}
                                  value={message}
                                  onChangeText={setMessage}
                                />
                            </View>
                      </View>
                      
                      {image?.uri ? (
                        <View style={{flex: 0.6}}>
                            <Lightbox navigator={navigation} activeProps={{style: styles.fullscreenImage}}>
                              <Image style={{width: "100%", height: "100%", resizeMode: "cover", borderBottomLeftRadius: 20, borderBottomRightRadius: 20, bottom: image?.uri ? 0 : 20}} source={{ uri: image?.uri || "https://static.thenounproject.com/png/4974686-200.png" }} />
                            </Lightbox>

                            <Pressable onPress={removeImage} style={{position: "absolute", right: -10, top: -10}} >
                                <MaterialIcons name="cancel" size={32} color="gray" />
                            </Pressable>
                        </View>
                  

                      ) : (
                        <Pressable style={{flex: 0.6}} onPress={() => pickImage(handleImageSelect)}>
                          <Image style={{width: "100%", height: "100%", resizeMode: "cover", borderBottomLeftRadius: 20, borderBottomRightRadius: 20, bottom: 20}} source={{ uri: "https://static.thenounproject.com/png/4974686-200.png" }} />
                        </Pressable>
                      )}
                     

                  </View>
              </View>
          </View>
          
          

            <View style={{alignItems: "center", flex: 0.35, justifyContent: "center"}}>
                <TouchableOpacity
                  style={{ backgroundColor: postEnabled ? "rgb(47, 139, 128)" : "gray", borderRadius: 20, borderWidth: 1, borderColor: "black", paddingVertical: 10, paddingHorizontal: 25, marginTop: 20, width: "80%" }}
                  onPress={handlePost}
                  disabled={!postEnabled}
                >
                    <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>Post</Text>
                </TouchableOpacity>
            </View>

      </SafeAreaView>
      </TouchableWithoutFeedback>

  );
}


