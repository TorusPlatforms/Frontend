import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ActivityIndicator, View, Text, TouchableOpacity, Image } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getFirestore, onSnapshot, doc } from "firebase/firestore"
import * as Notifications from 'expo-notifications';

import styles from "./styles";
import { ChatComponent } from '../../components/chat';
import { getChats, sendChat, getUser, sendAdminChat, getAdminChats} from '../../components/handlers';


export default function LoopChat({ route }) {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets();

  const [messages, setMessages] = useState([])
  const [user, setUser] = useState();

  const [unsubscribe, setUnsubscribe] = useState(null)
  const db = getFirestore();
  
  const { loop, fullScreen, defaultMessage, admin } = route.params;

  useFocusEffect(
    useCallback(() => {
      if (!loop.isAdmin && admin) {
          console.warn("Unauthorized user accessed admin messages")
          navigation.goBack()
      }

      fetchChats();
      fetchUser();

      Notifications.setNotificationHandler({
        handleNotification: async (notification) => {
          console.log("Notification received! Handling...")
          const data = notification?.request?.content?.data
          return {
              //The alert should be shown if it is 1) not a loop message OR 2) if it is a loop message from a different loop 
              shouldShowAlert: (admin ? data.type != "loop_admin_message" : data.type != "loop_message") || !(data.url.endsWith(loop.loop_id)),
              shouldPlaySound: false,
              shouldSetBadge: false,
          };
        },
      });

    
      return () => {
        if (unsubscribe) {
          unsubscribe()
        }

        Notifications.setNotificationHandler({
          handleNotification: async () => {
            return {
              shouldShowAlert: true,
              shouldPlaySound: false,
              shouldSetBadge: false,
            };
          },
        });

      }      
    }, [route.params])
  );


  async function fetchChats() {
    const getChatsFunction = ( admin ? getAdminChats : getChats )
    const messages = await getChatsFunction(loop.loop_id);

    if (messages) {
        setMessages(messages)

        const unsub = onSnapshot(doc(db, "loops", admin ? String(loop.loop_id) + "[ADMIN]" : String(loop.loop_id)), (snapshot) => {
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
    setUser(user)
  }


  const onSend = useCallback(async (messages = [], { image_url, reply_id }) => {
    const sendFunction = (admin ? sendAdminChat : sendChat)

    if (image_url) {
      await sendFunction({loop_id: loop.loop_id, image_url: image_url});
    }

    await sendFunction({loop_id: loop.loop_id, content: messages[0].text, reply_id: reply_id});
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

            <Text style={{color: 'white', fontSize: 16, maxWidth: 250}}>{loop.name} {admin && "(Administrators)"}</Text>
        </View>
      )}
         

        <ChatComponent
          route={route}
          messages={messages}
          onSend={onSend}
          id={user.username}
          loop={loop}
          defaultMessage={defaultMessage}
        />

    </View>
  );
}
