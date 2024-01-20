import React, { useState, useCallback, useEffect } from 'react';
<<<<<<< HEAD
import { View } from "react-native";
=======
import { View, KeyboardAvoidingView } from "react-native";
>>>>>>> main
import { GiftedChat, Bubble, InputToolbar, Avatar } from 'react-native-gifted-chat';
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

  const CustomInputToolbar = props => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: 'transparent', 
          borderTopWidth: 0, 
          paddingHorizontal: 10, 
<<<<<<< HEAD
          marginBottom: 25
=======
>>>>>>> main
        }}
      />
    );
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            marginLeft: 5,
            marginBottom: 20,
          },
        }}
      />
    );
  }

  const renderAvatar = (props) => {
    return (
        <View style={{marginBottom:20}}>
            <Avatar 
            {...props}
            containerStyle={{ marginLeft: 10, marginRight: 10 }} 
            imageStyle={{ borderRadius: 20 }} 
            />

        </View>
      
    );
  };

  return (
    <View style={[styles.container, {paddingVertical: 30}]}>
      <GiftedChat
        textInputStyle={{
          backgroundColor: "rgb(50,50,50)",
          color: "white",
          marginLeft: 5,
          marginTop: 10,
          paddingLeft:10,
          borderRadius:25
        }}
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1,
        }}
        renderBubble={renderBubble}
        renderInputToolbar={props => <CustomInputToolbar {...props} />}
        textInputProps={{
          placeholderTextColor: 'gray',
          multiline: false,
        }}
        renderAvatar={renderAvatar}
      />
    </View>
  );
}
