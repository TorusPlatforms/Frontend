import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, Image, Text, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

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

  const Post = () => {
   // THIS IS WHERE THE MAGIC WILL HAPPEN WHEN YOU CLICK POST
    console.log(textInputValue);
  };

  return (
    <View style={{ flex: 1, paddingTop: 20, backgroundColor: "rgb(22, 23, 24)" }}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 10 }}>
        <Text style={{ fontSize: 16, color: "white", paddingLeft: 10 }}>Cancel</Text>
      </TouchableOpacity>

      <View style={{ alignItems: 'center', justifyContent: 'flex-start' }}>
        <Text style={{ paddingTop: 0, fontWeight: "bold", fontSize: 30, color: "white" }}>New Ping</Text>
      </View>

      <View style={{ flexDirection: "column", alignItems: "center", marginTop: 20 }}>
        <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
          <Image style={{ width: 50, height: 50, marginLeft:20, borderRadius: 20, }} source={{ uri: exampleUserData.pfp }} />
          <TextInput
            ref={textInputRef}
            style={{ marginLeft: 20, paddingRight:20, paddingVertical: 10,marginTop:10, color: "white", fontSize: 18,minWidth:150, maxWidth:300 }}
            placeholder="Type something..."
            multiline
            numberOfLines={4}
            maxLength={40}
            placeholderTextColor="gray"
            value={textInputValue}
            onChangeText={(text) => setTextInputValue(text)}
          />
        </View>
        <TouchableOpacity
          style={{ backgroundColor: "rgb(247, 212, 114)", borderRadius: 20, borderWidth: 1, borderColor: "black", paddingVertical: 10, paddingHorizontal: 20, marginTop: 20 }}
          onPress={Post}
        >
          <Text style={{ color: "black", textAlign: "center" }}>Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreatePing;
