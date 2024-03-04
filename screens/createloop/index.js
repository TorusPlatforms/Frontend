import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, Text, TextInput, TouchableWithoutFeedback, Image, Keyboard, Switch, pingEnabled, togglePing } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from '@expo/vector-icons/Ionicons';
import ImagePickerComponent from "./imagepicker";
import defaultPic from "../../assets/user.png";
import { createLoop, getUser, joinLoop } from "../../components/handlers";
import { LinearGradient } from 'expo-linear-gradient';

const exampleLoopData = {
    pfp: "https://cdn.discordapp.com/attachments/803748247402184714/822541056436207657/kobe_b.PNG?ex=658f138d&is=657c9e8d&hm=37b45449720e87fa714d5a991c90f7fac4abb55f6de14f63253cdbf2da0dd7a4&",
    displayName: "Grant's Group",
    memberCount: 30,
    notifications:false,
    description: "A place for Grants and Hoes to chill",
    chats: ['Chat 1', 'Chat 2', 'Chat 3', 'Chat 4', 'Chat 5','Chat 6', 'Chat 7', 'Chat 8', 'Chat 9'],
    recentAnnouncement: "Grant becomes world's first trillionaire after buying every single realfeel dumpad and selling them for billions each",
    recentAnnouncementUser:"@stefan",
    users: ["DrumDogLover","TanujBeatMaster","GrantPawRhythms", "DogGrooveMaster","GrantAndTanujJams","RhythmHound","DrumBeatsWithTanuj","GrantCanineGrooves","TanujDogDrummer","BarkingBeatsGrant","DrummingTanujPaws","GrantAndDogRhythms","TanujDrumTails","PuppyGroovesGrant","BeatBuddyTanuj","WoofingRhythmsGrant","DrummingPawsTanuj","GrantGroovePup","TanujAndTheBeat","DoggyDrummingGrant","RhythmTanujTail","GrantPercussionPup","TanujDoggieBeats","PawsAndSnaresGrant","DrummingDogTanuj","GrantBeatsHowl","TanujRhythmBuddy","DogBeatHarmonyGrant","DrumPawsTanujGroove","GrantAndTanujRhythmic",]
}

const CreateLoop = () => {
    const navigation = useNavigation();
    const [nameInputValue, setNameInputValue] = useState("");
    const [discInputValue, setDiscInputValue] = useState("");
    const [chats, setChats] = useState([{ id: 1, value: "" }]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [rulesInputValue, setRulesInputValue] = useState("");
    const [privateMode, setPrivateMode] = useState(false);

    const handleCreateLoop = async () => {
        const user = await getUser();
        const loopData = {
          name: nameInputValue,
          description: discInputValue,
          creator_id:user.username,
          rules: rulesInputValue,
          status:"public",
          location:user.college,
          profile_picture: selectedImage ? selectedImage.assets[0].uri : null,
        };
    
        const createdLoop = await createLoop(loopData);
        //const createdLoopLog = await JSON.parse(createdLoop);
        console.log("Created loop:", createdLoop);
        const newLoopId = await createdLoop.LOOPID
        await joinLoop(newLoopId);
        console.log("LOOOOOOOOOOOOP IDDDDDDDDDDDDDD", newLoopId);
        goToLoop(newLoopId)

      };

      const goToLoop = (loopId) => {
        console.log("||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||")
        console.log(loopId)
        navigation.navigate('Loop', { loopId });
      };
  
    const textInputRefs = useRef(chats.reduce((acc, _, index) => {
      acc[index] = React.createRef();
      return acc;
    }, {}));
  
    const handleKeyboardDidShow = (event) => {
        setKeyboardHeight(event.endCoordinates.height);
      };
    
      const handleKeyboardDidHide = () => {
        setKeyboardHeight(0);
      };

      
    const togglePrivate = () => {

        setPrivateMode(!privateMode)


    }


    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
          'keyboardDidShow',
          handleKeyboardDidShow,
        );
        const keyboardDidHideListener = Keyboard.addListener(
          'keyboardDidHide',
          handleKeyboardDidHide,
        );
    
        return () => {
          keyboardDidShowListener.remove();
          keyboardDidHideListener.remove();
        };
      }, []);
  
    const handleTapOutside = () => {
      Keyboard.dismiss();
    };
    
    const handleImageSelect = (image) => {
        setSelectedImage(image);
        console.log("Selected Image in CreateLoop:", image);
      };

    const handleAddChat = () => {
        const newId = chats.length + 1;
        setChats([...chats, { id: newId, value: "" }]);
      
        // Ensure the new ref is created
        textInputRefs.current[newId - 1] = React.createRef();
      
        // Check if the ref is not null before focusing
        if (textInputRefs.current[newId - 1].current) {
          textInputRefs.current[newId - 1].current.focus();
        }
      };

      const handleResetImage = () => {
        setSelectedImage(null);
      };

      const handleRemoveChat = () => {
        if (chats.length > 1) {
          const updatedChats = [...chats];
          updatedChats.pop(); // Remove the last chat
          setChats(updatedChats);
        }
      };
  
    const handleChatInputChange = (text, index) => {
      const updatedChats = [...chats];
      updatedChats[index].value = text;
      setChats(updatedChats);
    };
  
    return (
        <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: "rgb(22, 23, 24)" }}
      enableOnAndroid
      extraScrollHeight={80}
    >

      <TouchableWithoutFeedback onPress={handleTapOutside}>
          <View>
          <View style={{flexDirection:"row", justifyContent:"space-between", marginTop:20}}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 10,marginTop:20 }}>
                    <Text style={{ fontSize: 16, color: "white", paddingLeft: 10 }}>Cancel</Text>
            </TouchableOpacity>

          </View>
           
  
            <View style={{ alignItems: 'center', justifyContent: 'flex-start',paddingBottom:10, borderBottomWidth:.2,borderBottomColor:"white" }}>
              <Text style={{ paddingTop: 0, fontWeight: "bold", fontSize: 30, color: "white",marginTop:0,borderColor:"white", borderBottomWidth:1,borderBottomColor:"white" }}>Create New Loop</Text>
            </View>
            <Image
            source={selectedImage ? { uri: selectedImage.assets[0].uri } : defaultPic}
            style={{
                width: 100,
                height: 100,
                alignSelf:"center",
                marginVertical: 15,
                backgroundColor: "white",
                borderRadius: 100,
            }}
            />
            {selectedImage && (
                <TouchableOpacity onPress={handleResetImage} style={{ marginTop: -10,marginBottom:10, alignSelf:"center" }}>
                <Text style={{ color: "red",textDecorationLine:"underline", fontSize: 10 }}>Remove Image</Text>
                </TouchableOpacity>
            )}
            <View style={{alignSelf:"center"}}>
                <ImagePickerComponent style={{}} setSelectedImage={handleImageSelect}></ImagePickerComponent>

            </View>
            

            <View style={{ alignItems: "baseline" }}>
              <Text style={{ color: "white", fontSize: 15, marginTop: 20, marginLeft: "5%" }}>Name</Text>
              <TextInput
                ref ={textInputRefs.current[0]}
                style={{ marginLeft: 20, paddingLeft:10,paddingTop: 5, paddingBottom:5, marginTop:5, color: "white", fontSize: 18,minWidth:300, maxWidth:300, backgroundColor:"rgb(46, 46, 46)",borderRadius:5 }}
                placeholder="Type something..."
                multiline
                numberOfLines={4}
                maxLength={40}
                placeholderTextColor="gray"
                value={nameInputValue}
                onChangeText={(text) => setNameInputValue(text)}
          />
            </View>
  
            <View style={{ alignItems: "baseline" }}>
              <Text style={{ color: "white", fontSize: 15, marginTop: 15, marginLeft: "5%" }}>Description</Text>
              <TextInput
                ref={textInputRefs.current[1]}
                style={{ marginLeft: 20, paddingLeft:10, paddingTop: 5, paddingBottom:5,marginTop:5, color: "white", fontSize: 18,minWidth:300, maxWidth:500, backgroundColor:"rgb(46, 46, 46)",borderRadius:5 }}
                placeholder="Type something else..."
                multiline
                numberOfLines={4}
                maxLength={500}
                placeholderTextColor="gray"
                value={discInputValue}
                onChangeText={(text) => setDiscInputValue(text)}
              />
            </View>


            <View style={{ alignItems: "baseline" }}>
        <Text style={{ color: "white", fontSize: 15, marginTop: 15, marginLeft: "5%" }}>Rules</Text>
        <TextInput
            ref={textInputRefs.current[2]} // Use the next available index
            style={{
                marginLeft: 20, paddingLeft:10,paddingTop: 5, paddingBottom:5,marginTop:5, color: "white", fontSize: 18,minWidth:300, maxWidth:500, backgroundColor:"rgb(46, 46, 46)",borderRadius:5 
            }}
            placeholder="Type rules here..."
            multiline
            numberOfLines={4}
            maxLength={500}
            placeholderTextColor="gray"
            value={rulesInputValue}
            onChangeText={(text) => setRulesInputValue(text)}
        />
    </View>

    <View style={{flexDirection:"row", justifyContent:"space-between", paddingHorizontal:25,marginTop:25}}>
  <Text style={{ fontSize: 18, color: "white", textAlign: 'center', }}>Private Loop</Text>
    <Switch
        trackColor={{ false: '#767577', true: 'rgb(54, 163, 107)' }}
        thumbColor={pingEnabled ? 'grey' : 'white'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={togglePrivate}
        value={privateMode}
      />
  </View>
  
                {/*
          <View style={{ marginTop: 50, }}>
            <Text style={{ color: "white", marginLeft: "5%", fontSize: 25 }}>Chats:</Text>
            <View style={{flexDirection:"row",}}>
                <ScrollView style={{maxHeight:450}}>

                {/*
                }
                {chats.map((chat, index) => (
              <View key={chat.id} style={{ flexDirection: "row", marginTop: "5%" }}>
                <TextInput
                  ref={textInputRefs.current[index]}
                  style={{
                    marginLeft: 10,
                    color: "white",
                    fontSize: 25,
                    backgroundColor: "black",
                    paddingBottom: 0,
                    paddingRight: 70,
                    paddingLeft: 0,
                    maxWidth: 350,
                    minWidth: 138,
                    marginLeft: "5%"
                  }}
                  placeholder="Name"
                  multiline
                  numberOfLines={4}
                  maxLength={40}
                  placeholderTextColor="gray"
                  value={chat.value}
                  onChangeText={(text) => handleChatInputChange(text, index)}
                />
                
                
              </View>
            ))}
                </ScrollView>

                <View style={{flexDirection:"row",marginTop:8,marginRight:100}}>
                  <TouchableOpacity onPress={() => handleAddChat()}>
                    <Icon name="add-circle-outline" size={30} color="#ffffff" style={{ marginLeft: 20 }} />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => handleRemoveChat()}>
                    <Icon name="remove-circle-outline" size={30} color="#ff0000" style={{ marginLeft: 20 }} />
                  </TouchableOpacity>
                  </View>
                  </View> 
          </View> */}

        
                <TouchableOpacity
                    style={{  borderRadius: 40, borderWidth: 1,borderColor: "black", paddingVertical: 10, paddingHorizontal: 20,marginTop: 0,width: 150,alignContent: "center",alignSelf: "center", height: 60}}
                    onPress={handleCreateLoop}>
                <LinearGradient colors={['#50C878', '#228B22', '#355E3B']} style={{overflow:"hidden", borderRadius: 40, borderWidth: 1,borderColor: "black", paddingHorizontal: 20,marginTop: 40,width: 150,alignContent: "center",alignSelf: "center", height: 60}}>
                    <Text style={{ color: "black", textAlign: "center", alignSelf: "center", marginTop: 15, fontSize: 20 }}>Create</Text>
                </LinearGradient>
                </TouchableOpacity>
  

        </View>
      </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    );
  };
  
  export default CreateLoop;