import React, { useState, useCallback, useEffect } from 'react';
import { View, TouchableOpacity, Image, Text, TextInput, ScrollView } from "react-native";
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";


const exampleLoopData = {
    pfp: "https://cdn.discordapp.com/attachments/803748247402184714/822541056436207657/kobe_b.PNG?ex=658f138d&is=657c9e8d&hm=37b45449720e87fa714d5a991c90f7fac4abb55f6de14f63253cdbf2da0dd7a4&",
    displayName: "Grant's Group",
    following: 128,
    followers: 259,
    description: "A place for Grants and Hoes to chill"
}



const LoopsPage = () => {
    const navigation = useNavigation()
    const goToLoop = () => {
        navigation.navigate('Profile'); 
      };


      return (
        <View style={{ flex: 1, paddingTop: 20, backgroundColor: "rgb(22, 23, 24)" }}>
          <TouchableOpacity onPress={goToLoop} style={{ padding: 10, marginTop: 30 }}>
            <Text style={{ fontSize: 16, color: "white", paddingLeft: 10 }}>Back</Text>
          </TouchableOpacity>
          <Image style={{height:150, width:150, alignSelf:'center', borderRadius:200}}source={{uri: exampleLoopData.pfp}}/>
          <Text style={{color:"white", fontSize:30,marginTop:20, alignSelf:"center"}}>{exampleLoopData.displayName}</Text>
          <Text style={{color:"white", fontSize:20, alignSelf:"center"}}>{exampleLoopData.description}</Text>
          <ScrollView style={{marginTop:40, alignSelf:"center",alignContent:"center",maxHeight:100, borderWidth:5,borderColor:'white', minWidth:200}}>
            <Text style ={{color:"white", fontSize:40,alignSelf:"center"}}>poo</Text>
            <Text style ={{color:"white", fontSize:40,alignSelf:"center"}}>poo</Text>
            <Text style ={{color:"white", fontSize:40,alignSelf:"center"}}>poo</Text>
            <Text style ={{color:"white", fontSize:40,alignSelf:"center"}}>poo</Text>
            <Text style ={{color:"white", fontSize:40,alignSelf:"center"}}>poo</Text>
            <Text style ={{color:"white", fontSize:40,alignSelf:"center"}}>poo</Text>
            <Text style ={{color:"white", fontSize:40,alignSelf:"center"}}>poo</Text>
            <Text style ={{color:"white", fontSize:40,alignSelf:"center"}}>poo</Text>
            

            </ScrollView>
        </View>
      );
}

export default LoopsPage;
