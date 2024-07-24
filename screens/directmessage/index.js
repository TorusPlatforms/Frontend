import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ActivityIndicator, View, Text, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect, useIsFocused, useNavigation } from "@react-navigation/native";
import { getFirestore, onSnapshot, doc, query, collection, where, getDocs } from "firebase/firestore"
import * as Notifications from 'expo-notifications';

import { getDM, sendMessage, getUser } from '../../components/handlers';
import { ChatComponent } from '../../components/chat';
import styles from "./styles"


export default function DirectMessage({ route }) {
    const navigation = useNavigation()

    const [messages, setMessages] = useState(null)
    const [user, setUser] = useState(null)
    const [pfp_url, setPFP_URL] = useState(null)
    const [unsubscribe, setUnsubscribe] = useState(null)
    const db = getFirestore();

    async function findThreadFirebase(username_1, username_2) {
      console.log("Searching for usernames...", username_1, username_2);
    
      const q = query(collection(db, 'messages'), where(`members.${username_1}`, '!=', null));
      const querySnapshot = await getDocs(q);
      
      for (const doc of querySnapshot.docs) {
        const members = doc.data().members;
        if (members.hasOwnProperty(username_2)) {
          return doc; 
        }
      }
    
      return null; 
    }

    useFocusEffect(
      useCallback(() => {
        fetchDM()
        Notifications.setNotificationHandler({
          handleNotification: async (notification) => {
            const data = notification?.request?.content?.data
            return {
              //The alert should be shown if it is 1) not a direct message OR 2) if it is a direct message from a different user 
              shouldShowAlert: (data.type) != "message" || !(data.url.endsWith(route.params.username)),
              shouldPlaySound: false,
              shouldSetBadge: false,
            };
          },
        });

        return () => {
          Notifications.setNotificationHandler({
            handleNotification: async () => {
              return {
                shouldShowAlert: true,
                shouldPlaySound: false,
                shouldSetBadge: false,
              };
            },
          });

          if (unsubscribe) {
            unsubscribe()
          }
        }      
      }, [route.params])
    );


    async function fetchDM() { 
        const user = await getUser();
        setUser(user)

        const dm = await getDM(route.params.username);
        setPFP_URL(dm?.pfp_url)

        if (dm?.messages) {
          setMessages(dm.messages);
          console.log("Fetched DMs between: ", user.username, route.params.username)
          console.log("Fetched", dm.messages.length, "messages. First entry:", dm.messages[0])

          const messageDoc = await findThreadFirebase(user.username, route.params.username)

          if (messageDoc) {
              const unsub = onSnapshot(doc(db, "messages", messageDoc.id), (snapshot) => {
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
  

    const onSend = useCallback(async (messages = [], { image_url, reply_id }) => {
        if (image_url) {
          console.log("Sending URL", image_url)
          await sendMessage({ username: route.params.username, image_url: image_url })
        }
        
        await sendMessage({ username: route.params.username, content: messages[0].text, reply_id: reply_id })
      }, [])

    function handleGoBack() {
      if (navigation.canGoBack()) {
        navigation.goBack()
      } else {
        navigation.navigate("Messages")
      }
    }

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
              <TouchableOpacity onPress={handleGoBack}>
                <Ionicons name="arrow-back" size={24} color="white" />        
              </TouchableOpacity>

              <Image source={{uri: pfp_url}} style={{width: 40, height: 40, borderRadius: 20, marginHorizontal: 10}}/>
              
              <TouchableOpacity onPress={() => navigation.push("UserProfile", {username: route.params.username})}>
                <Text style={{color: 'white', fontSize: 16}}>{route.params.username}</Text>
              </TouchableOpacity>
          </View>

          <ChatComponent
            messages={messages}
            onSend={onSend}
            id={user.username}
          />
    </SafeAreaView>
    )
}
