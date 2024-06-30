import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ActivityIndicator, View, Text, TouchableOpacity, Image } from "react-native";
import { GiftedChat } from 'react-native-gifted-chat';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
import { getFirestore, onSnapshot, doc } from "firebase/firestore"

import styles from "./styles";
import { ChatComponent } from '../../components/chat';
import { getChats, sendChat, getUser} from '../../components/handlers';


export default function LoopChat({ route }) {
  const navigation = useNavigation()

  const [messages, setMessages] = useState([])
  const [user, setUser] = useState();

  const [unsubscribe, setUnsubscribe] = useState(null)
  const db = getFirestore();
  
  const { loop } = route.params;


  useEffect(() => {
    fetchChats();
    fetchUser();

    if (unsubscribe) {
      return () => unsubscribe();
    }
  }, [route.params])


  async function fetchChats() {
    const chat = await getChats(loop.loop_id);

    if (chat.messages) {
        setMessages(chat.messages)

        const unsub = onSnapshot(doc(db, "loops", String(loop.loop_id)), (snapshot) => {
            console.log("Loop chat was updated")
            const data = snapshot.data()
            if (data && data?.messages) {
              setMessages(data.messages);
            }
          })
        
        setUnsubscribe(() => unsub); 
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
      GiftedChat.append(messages, previousMessages),
    )

  }, [])


  if (!user || !messages) {
    return <ActivityIndicator />
  }


  return (
    <SafeAreaView style={styles.container}>
         <View style={{paddingHorizontal: 20, flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderColor: "gray", padding: 10, marginBottom: 20}}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="white" />        
            </TouchableOpacity>

            <Image source={{uri: loop.pfp_url}} style={{width: 40, height: 40, borderRadius: 20, marginHorizontal: 10}}/>

            <Text style={{color: 'white', fontSize: 16}}>{loop.name}</Text>
        </View>

        <ChatComponent
          messages={messages}
          onSend={messages => onSend(messages)}
          id={user.username}
        />
    </SafeAreaView>
  );
}
