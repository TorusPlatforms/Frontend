import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, Image, Text, TextInput, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from '@expo/vector-icons/Ionicons';

import styles from "./styles";

const exampleUserData = {
  pfp: "https://cdn.discordapp.com/attachments/803748247402184714/822541056436207657/kobe_b.PNG?ex=658f138d&is=657c9e8d&hm=37b45449720e87fa714d5a991c90f7fac4abb55f6de14f63253cdbf2da0dd7a4&",
  displayName: "Grant Hough",
  username: "@granthough",
  following: 128,
  followers: 259,
  description: "A pretty funny guy. Has a strong affinity for dogs. \n Stefan Murphy: 'The test is in'"
}

const CreatePing = () => {
  const navigation = useNavigation();
  const [textInputValue, setTextInputValue] = useState("");
  const textInputRef = useRef(null);

  useEffect(() => {
    textInputRef.current.focus();
  }, []);


  const handleTapOutside = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={handleTapOutside}>
    <View style={{ flex: 1, paddingTop: 20, backgroundColor: "rgb(22, 23, 24)" }}>
        <View>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 10 }}>
            <Text style={{ fontSize: 16, color: "white", paddingLeft: 10 }}>Cancel</Text>
          </TouchableOpacity>
  
          <View style={{ alignItems: 'center', justifyContent: 'flex-start' }}>
            <Text style={{ paddingTop: 0, fontWeight: "bold", fontSize: 30, color: "white" }}>Create New Loop</Text>
          </View>
  
          <View style={{ flexDirection: "row", alignItems: "baseline" }}>
            <Text style={{ color: "white", fontSize: 18, marginTop: 50, marginLeft: "25%" }}>Name:</Text>
            <TextInput
              ref={textInputRef}
              style={{ marginLeft: 10, color: "white", fontSize: 18 }}
              placeholder="Name"
              multiline
              numberOfLines={4}
              maxLength={40}
              placeholderTextColor="gray"
              value={textInputValue}
              onChangeText={(text) => setTextInputValue(text)}
            />
          </View>
        </View>
      

        </View>
        </TouchableWithoutFeedback>

  );
};

export default CreatePing;
