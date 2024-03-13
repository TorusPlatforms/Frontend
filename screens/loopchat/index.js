import React, { useState, useCallback, useEffect } from 'react';
import { ActivityIndicator, View, Text, TouchableOpacity, Image } from "react-native";
import { GiftedChat, Bubble, InputToolbar, Avatar } from 'react-native-gifted-chat';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";

import styles from "./styles";
import { getChats, sendChat, getUser} from '../../components/handlers';


export default function LoopChat({ route }) {
  const navigation = useNavigation()

  const [messages, setMessages] = useState([])
  const [user, setUser] = useState();
  const { loop } = route.params;


  useEffect(() => {
    fetchChats();
    fetchUser();
  }, [])


  async function fetchChats() {
    const chat = await getChats(loop.loop_id);
    if (chat.messages) {
        setMessages(chat.messages.reverse())
    } else {
        setMessages([]);
    }
  }

  async function fetchUser() {
    const user = await getUser()
    console.log(user)
    setUser(user)
  }


  const onSend = useCallback(async (messages = []) => {
    await sendChat(loop.loop_id, messages[0].text);
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    )
  }, [])


  if (!user || !messages) {
    return <ActivityIndicator />
  }


  console.log(loop)

  return (
    <SafeAreaView style={styles.container}>
         <View style={{paddingHorizontal: 20, flexDirection: "row", alignItems: "center"}}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="white" />        
            </TouchableOpacity>

            <Image source={{uri: loop.pfp_url}} style={{width: 40, height: 40, borderRadius: 20, marginHorizontal: 10}}/>

            <Text style={{color: 'white', fontSize: 16}}>{loop.name}</Text>
        </View>

        <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{
            _id: user.username,
          }}
        />
    </SafeAreaView>
  );
}
