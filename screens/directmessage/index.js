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
          avatar: 'https://cdn.discordapp.com/attachments/803748247402184714/822541056436207657/kobe_b.PNG?ex=658f138d&is=657c9e8d&hm=37b45449720e87fa714d5a991c90f7fac4abb55f6de14f63253cdbf2da0dd7a4&',
        },
      },
    ])
  }, [])

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    )
  }, [])


  const renderBubble = (props) => { // styling of the text bubble of the other user
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            marginLeft: 5,
          },
        }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <GiftedChat
            textInputStyle={{backgroundColor: "rgb(22, 23, 24)", color: "white"}}
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
                _id: 1,
            }}
            renderBubble={renderBubble}
        />
    </View>
    )
}