import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, ActivityIndicator } from "react-native";
import { GiftedChat, Bubble, InputToolbar, Avatar } from 'react-native-gifted-chat';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getDM, sendMessage, getUser } from '../../components/handlers';
import { ChatComponent } from '../../components/chat';
import { getFirestore, collection, getDocs, query, where, onSnapshot, doc } from "firebase/firestore"

import styles from "./styles"


export default function DirectMessage({ route }) {
    const [messages, setMessages] = useState(null)
    const [user, setUser] = useState(null)
    const [unsubscribe, setUnsubscribe] = useState(null)
    const db = getFirestore();

    async function findThreadFirebase(username_1, username_2) {
      console.log("Searching for usernames...", username_1, username_2);
    
      const q = query(collection(db, 'messages'), where(`members.${username_1}`, '!=', null));
      const querySnapshot = await getDocs(q);
      
      console.log(querySnapshot.empty)
      console.log("DOCS", querySnapshot.docs)
      for (const doc of querySnapshot.docs) {
        console.log(doc.id, doc.data().members);
        const members = doc.data().members;
        if (members.hasOwnProperty(username_2)) {
          return doc; 
        }
      }
    
      return null; 
    }

    useEffect(() => {
      fetchDM();
        
      if (unsubscribe) {
        return () => unsubscribe();
      }
    }, [route.params])

    async function fetchDM() { 
        const user = await getUser();
        setUser(user)

        const dm = await getDM(route.params.username);
        if (dm.messages) {
          setMessages(dm.messages);
          console.log("Fetched DMs between: ", user.username, route.params.username)
          console.log("Fetched", dm.messages.length, "messages. First entry:", dm.messages[0])

          const messageDoc = await findThreadFirebase(user.username, route.params.username)
          const unsub = onSnapshot(doc(db, "messages", messageDoc.id), (snapshot) => {
              console.log("Chat was updated")
              const data = snapshot.data()
              if (data && data?.messages) {
                setMessages(data.messages);
              }
            })
          
          setUnsubscribe(() => unsub); 
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
      return <ActivityIndicator />
    }
    
    return (
      <SafeAreaView style={styles.container}>
        <ChatComponent onSend={onSend} messages={messages} id={user.username}/>
      </SafeAreaView>
    )
}
