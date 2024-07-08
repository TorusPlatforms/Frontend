import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text } from "react-native";
import { GiftedChat, Bubble, InputToolbar , Avatar} from 'react-native-gifted-chat';
import styles from "./styles"



function isNewAuthor(props) {
  return props.previousMessage?.user?._id != props.currentMessage?.user?._id
}

const CustomInputToolbar = props => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: 'transparent', 
          borderTopWidth: 0, 
        }}
      />
    );
  };

const renderBubble = (props) => {
    return (
      <View>
          {(props.user._id != props.currentMessage.user._id) && isNewAuthor(props) && (
            <Text style={{color: "lightgray", marginBottom: 4, marginLeft: 2}}>{props.currentMessage.user.name}</Text>
          )}
          
          <Bubble
            {...props}
          />
      </View>
    );
}

const renderAvatar = (props) => {
  console.log("CURRENT MESSAGE", props.currentMessage.user._id)
  console.log("PREVIOUS MESAGE", props.previousMessage.user)
  if (isNewAuthor(props)) {
      return (
        <Avatar 
            {...props} 
            containerStyle={{
              left: {
                marginBottom: 20
              },
            }}
        />
      )
  } else {
    return <Avatar /> //blank avatar
  }
  
}


export const ChatComponent = ({ messages, onSend, id, loop }) => {
      const navigation = useNavigation()

      function handleBubblePress() {
        if (loop) {
          navigation.navigate("LoopChat", {loop: loop, fullScreen: true})
        }
      }

      return (
        <View style={[styles.container]}>
          <GiftedChat
            onPress={handleBubblePress}
            onPressAvatar={(user) => {
              navigation.navigate("UserProfile", {username: user.name})
            }}
            showAvatarForEveryMessage={false}
            listViewProps={{style: { marginBottom: 20 }}}
            textInputStyle={{
              backgroundColor: "rgb(50,50,50)",
              color: "white",
              minHeight: 40,
              maxHeight: 200,
              maxLength: 100,
              borderRadius: 25,
              paddingHorizontal: 15,
              paddingVertical: 12
            }}
            placeholder='Send a message'
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
              _id: id,
            }}
            renderAvatar={renderAvatar}
            renderBubble={renderBubble}
            renderInputToolbar={props => <CustomInputToolbar {...props} />}
            textInputProps={{
              placeholderTextColor: 'gray',
              multiline: true,
              textAlignVertical: "top"
            }}
            inverted={false}
          />
        </View>
      );
}
