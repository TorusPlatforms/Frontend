import React, { useState, useCallback, useEffect } from 'react';
import { View } from "react-native";
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import styles from "./styles";

export default function DirectMessage() {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ])
  }, [])

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    )
  }, [])

  return (
    <View style={styles.container}>
      <GiftedChat
            textInputStyle={{backgroundColor: "rgb(22, 23, 24)", color: "white"}}
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
                _id: 1,
            }}
        />
    </View>
    )
}