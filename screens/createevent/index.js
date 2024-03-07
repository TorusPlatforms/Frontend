import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, Image, Text, TextInput, TouchableWithoutFeedback, Keyboard, ActivityIndicator, Pressable, Platform, KeyboardAvoidingView, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Input } from 'react-native-elements';

import { requestCameraPerms, requestPhotoLibraryPerms, openCamera, pickImage } from "../../components/imagepicker";
import { getUser, createEvent, getGoogleMapsKey } from "../../components/handlers";
import { strfEventDate, strfEventTime } from "../../components/utils";
import styles from "./styles";


export default function CreateEvent() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null)
  const [key, setKey] = useState(null)

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [address, setAddress] = useState("");

  const [displayDate, setDisplayDate]= useState(Platform.OS === "android" ? "When is it happening?" : "")
  const [displayTime, setDisplayTime] = useState(Platform.OS === "android" ? "What time is it happening?" : "")
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date())
  const [showCalendar, setShowCalendar] = useState(Platform.OS === "android" ? false : true);
  const [showClock, setShowClock] = useState(Platform.OS === "android" ? false : true);

  
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // run this whenever the selected image changes
    async function fetchUser() {
      const user = await getUser()
      setUser(user)
    }

    async function fetchGoogleMapsKey() {
      const key = await getGoogleMapsKey();
      setKey(key)
    }

    fetchUser()
    fetchGoogleMapsKey()

    requestCameraPerms()
    requestPhotoLibraryPerms()
    
    if (selectedImage && selectedImage.assets && selectedImage.assets.length > 0 && selectedImage.assets[0].uri) {
      console.log('Image is available:', selectedImage.assets[0].uri);
      
    } else {
      console.log('No image available');
    }

  }, [selectedImage]); 

  const closeKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleBackgroundPress = () => {
    closeKeyboard();
  };

  const handleImageSelect = (image) => {
    if (!image.canceled) {
      setSelectedImage(image);
    }
    console.log("Selected Image in CreateEvent:", image);
  };

  const handlePictureTaken = (uri) => {
    setSelectedImage({ assets: [{ uri }] });
  };

  const removeImage = () => {
    setSelectedImage(null); // set image to null (delete image)
  };


  async function handlePost() {
    await createEvent(name, address, date, time, message, selectedImage);
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


  } else {


    return (
      <TouchableWithoutFeedback style={{backgroundColor: "rgb(22, 23, 24)"}} onPress={handleBackgroundPress}>
        <View style={styles.container}>
            <View style={{flex: 0.2, marginTop: 10}}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 10 }}>
                <Text style={{ fontSize: 16, color: "white", paddingLeft: 10 }}>Cancel</Text>
              </TouchableOpacity>
            </View>
      

            <View style={{ justifyContent: "space-between", alignItems: 'center', flex: 0.3}}>
              <Text style={{ fontWeight: "bold", fontSize: 20, color: "white" }}>Create Event</Text>
              <Text style={{ fontSize: 16, color: "white", textAlign: "center", marginTop: 5, paddingHorizontal: 25 }}>Get together. Reunite. Connect.</Text>
            </View>

            <View style={{ flexDirection: "column", paddingLeft: 20, flex: 2, justifyContent: "space-between", paddingRight: 50, marginTop: 50}}>
                <View style={{ flexDirection: "row", alignItems: "center"}}>
                    <Ionicons name="reorder-four" size={24} color="gray" />

                    <TextInput
                      style={{ marginLeft: 10, color: "white", fontSize: 18, textAlign: "left"}}
                      placeholder="What's happening?"
                      multiline
                      maxLength={50}
                      numberOfLines={4}
                      placeholderTextColor="gray"
                      value={name}
                      onChangeText={setName}
                    />

                
                </View>

                <View style={{marginLeft: 24}}>
                  <TextInput
                      style={{ marginLeft: 10, color: "white", fontSize: 18, textAlign: "left"}}
                      placeholder="Any more details?"
                      multiline
                      maxLength={150}
                      numberOfLines={2}
                      placeholderTextColor="gray"
                      value={message}
                      onChangeText={setMessage}
                    />
                </View>
                <View style={{ flexDirection: "row", alignItems: "center"}}>
                    <Ionicons name="pin" size={24} color="gray" />

                    <GooglePlacesAutocomplete
                          placeholder={"Where is it happening?"}
                          onPress={(data, details = null) => {
                            // 'details' is provided when fetchDetails = true
                            console.log(data, details);
                            setAddress(data.description)
                          }}
                          query={{
                            key: key,
                            language: 'en',
                          }}
                          styles={{
                            textInput: {
                              backgroundColor: 'rgb(22, 23, 24)',
                              color: 'white',
                              height: 44,
                              borderRadius: 5,
                              paddingVertical: 5,
                              paddingHorizontal: 10,
                              fontSize: 18,
                              flex: 1,
                            },
                          }}
                      />
                </View>

                <View style={{ flexDirection: "row", alignItems: "center"}}>
                  <Ionicons name="calendar" size={24} color="gray" />

                  <Pressable onPress={() => setShowCalendar(true)}>
                      <Text style={{color: "gray", marginLeft: 10, fontSize: 18}}>{displayDate}</Text>
                  </Pressable>

                  { showCalendar && (
                      <DateTimePicker
                          value={date}
                          mode={'date'}
                          onChange={onChangeDate}
                      />
                  )}
                </View>

                <View style={{ flexDirection: "row", alignItems: "center"}}>
                  <Ionicons name="time" size={24} color="gray" />

                  <Pressable onPress={() => setShowClock(true)}>
                      <Text style={{color: "gray", marginLeft: 10, fontSize: 18}}>{displayTime}</Text>
                  </Pressable>

                  { showClock && (
                      <DateTimePicker
                          value={time}
                          mode={'time'}
                          onChange={onChangeTime}
                      />
                  )}
                </View>
              </View>

          <View style={{justifyContent: "center", alignItems: "center", flex: 1.5}}>
                {/*Render the ImagePickercomponeent and pass the callback function, image picker contrains both the camera and camera roll buttons */}
              {!selectedImage && (
                <View style={{ flexDirection: "row", marginTop: 20, justifyContent: "center"}}>
                <TouchableOpacity style={{ marginRight: 10 }} onPress={() => pickImage(handleImageSelect)}>
                  <Ionicons name="image-outline" size={30} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => openCamera(handleImageSelect)}>
                  <Ionicons name="camera-outline" size={30} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              )}
            

              {selectedImage && selectedImage.assets && selectedImage.assets.length > 0 && selectedImage.assets[0].uri && (
                  <View>
                      <Image source={{ uri: selectedImage.assets[0].uri }} style={{ width: 100, height: 100, borderWidth: 2, borderColor: "white", marginTop: 15 }} />
                      <TouchableOpacity onPress={removeImage}>
                          <Text style={{alignSelf:"center", marginTop:10, color:"red", textDecorationLine:"underline"}}>Remove Image</Text>
                      </TouchableOpacity>
                  </View>
              )}  

              <View>
                  <Pressable
                    style={{ backgroundColor: "rgb(54, 163, 107)", borderRadius: 20, borderWidth: 1, borderColor: "black", paddingVertical: 10, paddingHorizontal: 25, marginTop: 20 }}
                    onPress={handlePost}
                  >
                      <Text style={{ color: "black", textAlign: "center" }}>Post</Text>
                  </Pressable>
              </View>
            </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
};


