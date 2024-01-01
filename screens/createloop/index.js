import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, Text, TextInput, TouchableWithoutFeedback, Keyboard, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from '@expo/vector-icons/Ionicons';

const CreatePing = () => {
    const navigation = useNavigation();
    const [nameInputValue, setNameInputValue] = useState("");
    const [discInputValue, setDiscInputValue] = useState("");
    const [chats, setChats] = useState([{ id: 1, value: "" }]);
  
    const textInputRefs = useRef(chats.reduce((acc, _, index) => {
      acc[index] = React.createRef();
      return acc;
    }, {}));
  
    useEffect(() => {
      textInputRefs.current[0].current.focus();
    }, []);
  
    const handleTapOutside = () => {
      Keyboard.dismiss();
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
      <TouchableWithoutFeedback onPress={handleTapOutside}>
        <View style={{ flex: 1, paddingTop: 20, backgroundColor: "rgb(22, 23, 24)" }}>
          <View>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 10,marginTop:20 }}>
              <Text style={{ fontSize: 16, color: "white", paddingLeft: 10 }}>Cancel</Text>
            </TouchableOpacity>
  
            <View style={{ alignItems: 'center', justifyContent: 'flex-start' }}>
              <Text style={{ paddingTop: 0, fontWeight: "bold", fontSize: 30, color: "white",marginTop:20 }}>Create New Loop</Text>
            </View>
  
            <View style={{ flexDirection: "row", alignItems: "baseline" }}>
              <Text style={{ color: "white", fontSize: 25, marginTop: 50, marginLeft: "5%" }}>Name:</Text>
              <TextInput
                ref={textInputRefs.current[0]}
                style={{
                  marginLeft: 10,
                  color: "white",
                  fontSize: 25,
                  backgroundColor: "black",
                  paddingBottom: 0,
                  paddingRight: 70,
                  paddingLeft: 5,
                  maxWidth: 350,
                  minWidth: 138
                }}
                placeholder="Name"
                multiline
                numberOfLines={4}
                maxLength={40}
                placeholderTextColor="gray"
                value={nameInputValue}
                onChangeText={(text) => setNameInputValue(text)}
              />
            </View>
  
            <View style={{ flexDirection: "row", alignItems: "baseline" }}>
              <Text style={{ color: "white", fontSize: 25, marginTop: 25, marginLeft: "5%" }}>Description:</Text>
              <TextInput
                ref={textInputRefs.current[0]}
                style={{
                  marginLeft: 10,
                  color: "white",
                  fontSize: 10,
                  backgroundColor: "black",
                  paddingBottom: 0,
                  paddingRight: 10,
                  paddingLeft: 5,
                  maxWidth: 220,
                  minWidth: 135
                }}
                placeholder="What is your loop about?"
                multiline
                numberOfLines={4}
                maxLength={100}
                placeholderTextColor="gray"
                value={discInputValue}
                onChangeText={(text) => setDiscInputValue(text)}
              />
            </View>
          </View>
  
          <View style={{ marginTop: 50, }}>
            <Text style={{ color: "white", marginLeft: "5%", fontSize: 25 }}>Chats:</Text>
            <View style={{flexDirection:"row",}}>
                <ScrollView style={{maxHeight:450}}>

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
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };
  
  export default CreatePing;