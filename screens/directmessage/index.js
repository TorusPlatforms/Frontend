import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ActivityIndicator, View, Text, TouchableOpacity, Image } from "react-native";
import { GiftedChat } from 'react-native-gifted-chat';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { getFirestore, onSnapshot, doc, query, collection, where, getDocs } from "firebase/firestore"
import * as Notifications from 'expo-notifications';

import { getDM, sendMessage, getUser } from '../../components/handlers';
import { ChatComponent } from '../../components/chat';
import styles from "./styles"


export default function DirectMessage({ route }) {


    const navigation = useNavigation()

    const [messages, setMessages] = useState(null)
    const [user, setUser] = useState(null)
    const [unsubscribe, setUnsubscribe] = useState(null)
    const db = getFirestore();

    async function findThreadFirebase(username_1, username_2) {
      console.log("Searching for usernames...", username_1, username_2);
    
      const q = query(collection(db, 'messages'), where(`members.${username_1}`, '!=', null));
      const querySnapshot = await getDocs(q);
      
      for (const doc of querySnapshot.docs) {
        console.log(doc.id, doc.data().members);
        const members = doc.data().members;
        if (members.hasOwnProperty(username_2)) {
          return doc; 
        }
      }
    
      return null; 
    }

    const isFocused = useIsFocused()
    useEffect(() => {
        Notifications.setNotificationHandler({
          handleNotification: async (notification) => {
            return {
              shouldShowAlert: (notification?.request?.content?.data?.type) != "message",
              shouldPlaySound: false,
              shouldSetBadge: false,
            };
          },
        });

        return () => {
          Notifications.setNotificationHandler({
            handleNotification: async (notification) => {
              return {
                shouldShowAlert: true,
                shouldPlaySound: false,
                shouldSetBadge: false,
              };
            },
          });
        }
  
        
    }, [isFocused])


    useEffect(() => {
      fetchDM();
        
      if (unsubscribe) {
        return () => {
          unsubscribe()
        };
      }
    }, [route.params])

    async function fetchDM() { 
        const user = await getUser();
        setUser(user)

        const dm = await getDM(route.params.username);
        if (dm?.messages) {
          setMessages(dm.messages);
          console.log("Fetched DMs between: ", user.username, route.params.username)
          console.log("Fetched", dm.messages.length, "messages. First entry:", dm.messages[0])

          const messageDoc = await findThreadFirebase(user.username, route.params.username)

          if (messageDoc) {
              const unsub = onSnapshot(doc(db, "messages", messageDoc.id), (snapshot) => {
                console.log("Chat was updated")
                const data = snapshot.data()
                if (data && data?.messages) {
                  setMessages(data.messages.reverse());
                }
              })
            
              setUnsubscribe(() => unsub);
          }
       
        } else {
            setMessages([])
        }
    }
  

    const onSend = useCallback(async (messages = []) => { //
        if (messages) {
          await sendMessage(route.params.username, messages[0].text)
        }

        setMessages(previousMessages =>
          GiftedChat.append(messages, previousMessages),
        )
      }, [])

    if (!messages || !user) {
      return (
        <View style={{flex: 1, backgroundColor: "rgb(22, 23, 24)", justifyContent: "center", alignItems: "center"}}>
            <ActivityIndicator />
        </View>
      )
    }
    
    return (
      <SafeAreaView style={styles.container}>
         <View style={{paddingHorizontal: 20, flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderColor: "gray", padding: 10, marginBottom: 20}}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="white" />        
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.push("UserProfile", {username: route.params.username})} style={{marginLeft: 20}}>
                <Text style={{color: 'white', fontSize: 16}}>{route.params.username}</Text>
            </TouchableOpacity>
        </View>

        <ChatComponent
          messages={messages}
          onSend={messages => onSend(messages)}
          id={user.username}
        />
    </SafeAreaView>
    )
}
