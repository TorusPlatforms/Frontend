import React, { useState, useCallback, useEffect, useRef } from 'react';

import { View } from "react-native";
import { GiftedChat, Bubble, InputToolbar,  } from 'react-native-gifted-chat';
import styles from "./styles"




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
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            marginBottom: 2
          },
        }}
      />
    );
  }


export const ChatComponent = ({ messages, onSend, id }) => {
      return (
        <View style={[styles.container]}>
          <GiftedChat
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
