import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, ActivityIndicator } from "react-native";
import { GiftedChat, Bubble, InputToolbar, Avatar } from 'react-native-gifted-chat';
import { getAuth } from "firebase/auth";

import { getDM, sendMessage, getUser } from '../../components/handlers';
import styles from "./styles";

export default function DirectMessage({ route }) {
  const [messages, setMessages] = useState(null)
  const [user, setUser] = useState(null)
  const auth = getAuth()

  useEffect(() => {
    fetchDM();
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
      const user = await getUser();
      setUser(user)
      console.log(route.params.username);

      const dm = await getDM(route.params.username);
      console.log(dm);
      console.log("dm messsages" + dm[0].messages);
      if (dm[0].messages) {
        setMessages(dm[0].messages);
      } else {
        await sendMessage(route.params.username, "Hey there! Can we connect?")
        await fetchDM()
      }
    };
 

  const onSend = useCallback(async (messages = []) => { //
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


  if (!messages || !user) {
    return <ActivityIndicator />
  }

  console.log(messages, user.username)

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
          _id: user.username,
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
