import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ActivityIndicator, View, Text, TouchableOpacity, Image } from "react-native";
import { GiftedChat } from 'react-native-gifted-chat';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
import { getFirestore, onSnapshot, doc } from "firebase/firestore"

import styles from "./styles";
import { ChatComponent } from '../../components/chat';
import { getChats, sendChat, getUser} from '../../components/handlers';


export default function LoopChat({ route }) {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets();

  const [messages, setMessages] = useState([])
  const [user, setUser] = useState();

  const [unsubscribe, setUnsubscribe] = useState(null)
  const db = getFirestore();
  
  const { loop, fullScreen } = route.params;


  useEffect(() => {
    fetchChats();
    fetchUser();

    if (unsubscribe) {
      return () => unsubscribe();
    }
  }, [route.params])


  async function fetchChats() {
    const messages = await getChats(loop.loop_id);

    if (messages) {
        setMessages(messages)

        const unsub = onSnapshot(doc(db, "loops", String(loop.loop_id)), (snapshot) => {
            console.log("Loop chat was updated")
            const data = snapshot.data()
            if (data && data?.messages) {
              setMessages(data.messages.reverse());
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


  const onSend = useCallback(async (messages = [], image_url = null) => {
    if (route.name != "LoopChat") {
      navigation.navigate("LoopChat", {loop: loop, fullScreen: true})
    }

    if (image_url) {
      await sendChat(loop.loop_id, null, image_url);
    }

    await sendChat(loop.loop_id, messages[0].text);
  }, [])


  if (!user || !messages) {
    return (
      <View style={{flex: 1, backgroundColor: "rgb(22, 23, 24)", justifyContent: "center", alignItems: "center"}}>
          <ActivityIndicator />
      </View>
    )
  }


  return (
    <View style={[styles.container, {
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingTop: fullScreen ? insets.top : 25,
      paddingBottom: fullScreen ? insets.bottom : 0,

    }]}>

      {fullScreen && (
        <View style={{paddingHorizontal: 20, flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderColor: "gray", padding: 10, marginBottom: 20}}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="white" />        
            </TouchableOpacity>

            <Image source={{uri: loop.pfp_url}} style={{width: 40, height: 40, borderRadius: 20, marginHorizontal: 10}}/>

            <Text style={{color: 'white', fontSize: 16}}>{loop.name}</Text>
        </View>
      )}
         

        <ChatComponent
          route={route}
          messages={messages}
          onSend={onSend}
          id={user.username}
          loop={loop}
        />

    </View>
  );
}
