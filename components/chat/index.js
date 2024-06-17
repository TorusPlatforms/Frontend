import React, { useState, useCallback, useEffect, useRef } from 'react';

import { View, ActivityIndicator } from "react-native";
import { GiftedChat, Bubble, InputToolbar, Avatar, MAX_COMPOSER_HEIGHT } from 'react-native-gifted-chat';
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


export const ChatComponent = ({ messages, onSend, id }) => {

        
      return (
        <View style={[styles.container]}>
          <GiftedChat
            // listViewProps={{style: {marginBottom: 20}}}
            textInputStyle={{
              backgroundColor: "rgb(50,50,50)",
              color: "white",
              minHeight: 50,
              maxHeight: 200,
              maxLength: 100,
              borderRadius: 25,
              padding: 15,
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
            renderAvatar={renderAvatar}
            inverted={false}
          />
        </View>
      );
}
