import React, { useState, useCallback, useEffect } from 'react';
import { View, ActivityIndicator } from "react-native";
import { GiftedChat, Bubble, InputToolbar, Avatar } from 'react-native-gifted-chat';

import { getDM, sendMessage } from '../../components/handlers';
import styles from "./styles";

export default function DirectMessage({ route }) {
  const [messages, setMessages] = useState(null)

  useEffect(() => {
    fetchDM()
    // setMessages([
    //   {
    //     _id: 1,
    //     text: 'Hello developer',
    //     createdAt: new Date(),
    //     user: {
    //       _id: 2,
    //       name: 'React Native',
    //       avatar: 'https://cdn.discordapp.com/attachments/803748247402184714/822541056436207657/kobe_b.PNG?ex=658f138d&is=657c9e8d&hm=37b45449720e87fa714d5a991c90f7fac4abb55f6de14f63253cdbf2da0dd7a4&',
    //     },
    //   },
    // ])
  }, [])

  async function fetchDM() {
    console.log(route.params.username)
    const dm = await getDM(route.params.username)
    setMessages(dm.messages)
    // setMessages([
    //   {"created_at": 1706077107961, "text": "gabooble", "_id": 1, "user": {"_id": 1, "avatar": "https://cdn.torusplatforms.com/e2d4deba-849e-4265-88f8-73b83c9fe9b6.JPG", "name": "tanujks"}}, 
    //   {"created_at": 1706077111023, "text": "boo", "_id": 2, "user": {"_id": 2, "avatar": "https://cdn.torusplatforms.com/e2d4deba-849e-4265-88f8-73b83c9fe9b6.JPG", "name": "tanujks"}}, 
    //   {"created_at": 1706077112547, "text": "boo", "_id": 3, "user": {"avatar": "https://cdn.torusplatforms.com/e2d4deba-849e-4265-88f8-73b83c9fe9b6.JPG", "name": "tanujks"}}])
  }


  const onSend = useCallback(async (messages = []) => {
    console.log("MESSAGSE", messages)
    if (messages) {
      await sendMessage(route.params.username, messages[0].text)
    }

    setMessages(previousMessages =>
      GiftedChat.append(messages, previousMessages),
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

  console.log(messages)

  if (!messages) {
    return <ActivityIndicator />
  }

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
        inverted={false}
      />
    </View>
  );
}
