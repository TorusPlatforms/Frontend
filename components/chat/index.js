import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity, Image, Pressable, Keyboard } from "react-native";
import { GiftedChat, Bubble, InputToolbar , Avatar, Send, MessageImage } from 'react-native-gifted-chat';
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from "@expo/vector-icons/Feather"
import _ from 'lodash';
import { openCamera, pickImage } from '../imagepicker';
import { getMemberStatus, uploadToCDN } from '../handlers';
import Reply from "./Reply"

const CustomInputToolbar = props => {
  return (
      <InputToolbar
          {...props}
          containerStyle={{
            backgroundColor: 'transparent', 
            borderTopWidth: 0, 
            paddingHorizontal: 10,
            alignItems: 'center',
          }}
          textInputStyle={[
            {paddingVertical: 10},
            props.textInputStyle,
          ]}
        />  
  );
};


export const ChatComponent = ({ messages, onSend, id, loop, route }) => {
      const navigation = useNavigation()
      const [image, setImage] = useState()
      const flatListRef = useRef()

      const [replyingMessage, setReplyingMessage] = useState()

      

      function isNewAuthor(props) {
        return props.previousMessage?.user?._id != props.currentMessage?.user?._id
      }
      
      const handleImageSelect = (fetchedImage) => {
        if (!fetchedImage.canceled) {
          setImage(fetchedImage)
        }
      };
      
      const renderChatFooter = useCallback(() => {
        if (replyingMessage) {
            setImage(null)
            return (
              <View style={{backgroundColor: "transparent", height: 60, paddingHorizontal: 25, paddingVertical: 10, flexDirection: 'row', alignItems: "center", justifyContent: "space-between", borderTopColor: "gray", borderTopWidth: 1}}>
                <View>
                    <Text style={{color: "gray", marginBottom: 5}}>Replying To: {replyingMessage.user.name}</Text>
                    <Text style={{color: "white"}}>{replyingMessage.text?.length > 0 ? replyingMessage.text.slice(0, 45).replace(/(\r\n|\n|\r)/gm, " ") : "Image"}</Text>
                </View>

                <View>
                    <TouchableOpacity onPress={() => setReplyingMessage(null)}>
                        <Feather name="x" size={18} color="gray" />
                    </TouchableOpacity>
                </View>
              </View>
            )
        }

        if (image) {
            setReplyingMessage(null)
            return (
              <View style={{paddingHorizontal: 20, marginBottom: 20}}>
                <View>
                  <Image source={{uri: image.uri || image.assets[0].uri}} style={{height: 250, width: 250, borderRadius: 10}} />
                  
                  <Pressable onPress={() => setImage(null)} style={{position: "absolute", left: -10, top: -10}} >
                      <MaterialIcons name="cancel" size={32} color="gray" />
                    </Pressable>

                </View>
                
              </View>
            );
        }
      }, [image, replyingMessage]);

      async function handleAttatchment({ defaultMessage }) {
        if (loop && route?.name != "LoopChat") {
            navigation.navigate("LoopChat", {loop: loop, fullScreen: true, defaultMessage: defaultMessage})
        } else {
            pickImage(handleImageSelect)
        }
      }

      async function handleCamera({ defaultMessage }) {
        if (loop && route?.name != "LoopChat") {
            navigation.navigate("LoopChat", {loop: loop, fullScreen: true, defaultMessage: defaultMessage})
        } else {
            openCamera(handleImageSelect)
        }
      }

      const renderSend = (props) => {
        return (
            <View style={{ flexDirection: 'row', alignItems: "center", marginBottom: 2 }}>
              <TouchableOpacity disabled={replyingMessage} onPress={() => handleCamera({ defaultMessage: props.text })}>
                
                <Ionicons
                    name="camera-outline"
                    style={{
                      marginLeft: 5,
                      transform: [{rotateY: '180deg'}],
                    }}
                    size={28}
                    color={replyingMessage ? "gray" : "white"}
                />
              </TouchableOpacity>

              <TouchableOpacity disabled={replyingMessage} onPress={() => handleAttatchment({ defaultMessage: props.text })}>
                  <Ionicons
                      name="image-outline"
                      style={{
                        marginLeft: 8,
                        transform: [{rotateY: '180deg'}],
                      }}
                      size={28}
                      color={replyingMessage ? "gray" : "white"}
                  />
              </TouchableOpacity>

              <Send {...props}>
                  <View style={{ alignItems: 'center', backgroundColor:  props.text ? "rgb(47, 139, 128)" : "gray", borderRadius: 30, width: 40, height: 30, justifyContent: "center", marginBottom: 8 }}>
                      <Ionicons style={{color: "white"}} name="arrow-up" size={20}></Ionicons>
                  </View>
              </Send>

            </View>
        );
      };

 

      function findMessage(message_id) {
          return messages.find(message => message._id == message_id);
      }

      const renderBubble = (props) => {
          if (props.currentMessage.reply_id) {
            props.replyMessage = {
              ...findMessage(props.currentMessage.reply_id),
              scroll_to_reply_id: props.currentMessage.reply_id //this allows the scoll function to function properly
            }

            if (props.replyMessage.text?.length > 50) {
              props.replyMessage.text = props.replyMessage.text.slice(0, 50) + "..."
            }
          }

          return (
            <Reply setReplying={setReplyingMessage} direction={props.currentMessage.user._id == props.user._id ? "right" : "left"} message={props.currentMessage}>
                  
                  {((props.user._id != props.currentMessage.user._id) && (isNewAuthor(props) || props.replyMessage)) && (
                    <TouchableOpacity onPress={() => navigation.navigate("UserProfile", {username: props.currentMessage.user.name})}>
                      <Text style={{color: "lightgray", marginBottom: 4, marginLeft: 2, marginTop: props.replyMessage ? 20 : 0}}>{props.currentMessage.user.name} {props.replyMessage && `replied to ${props.replyMessage.user.name}`}</Text>
                    </TouchableOpacity>
                  )}
                  
                  {(props.replyMessage && props.user._id == props.currentMessage.user._id) && (
                    <TouchableOpacity style={{ marginTop: 20, marginRight: 10, alignSelf: "flex-end"}} onPress={() => navigation.navigate("UserProfile", {username: props.replyMessage.user.name})}>
                      <Text style={{color: "lightgray"}}>{`You replied to ${props.replyMessage.user.name}`}</Text>
                    </TouchableOpacity>
                  )}

                  {props.replyMessage && (

                      <Bubble 
                        {...props}
                        currentMessage={props.replyMessage}
                        wrapperStyle={{
                          left: {
                            backgroundColor: 'rgb(60, 60, 60)',
                            opacity: 0.4,
                            marginBottom: 10,
                          },
                          right: {
                            backgroundColor: 'rgb(60, 60, 60)',
                            opacity: 0.4,
                            marginTop: 10,
                            marginBottom: 5
                          }
                        }} 
                        textStyle={{left: {color: "white"}}}       
                      />
                  )}

                  <Bubble
                      {...props}
                      wrapperStyle={{
                        left: {
                          backgroundColor: 'rgb(40, 40, 40)',
                        },
                        right: {
                          backgroundColor: props.currentMessage.image ? 'rgb(22, 23, 24)' : '#0084ff',
                        }
                      }}         
                      textStyle={{left: {color: "white"}}}       
                    />

            </Reply>
          );
      }
      
      const renderImage = props => {
        return (
          <MessageImage 
            {...props}
            imageStyle={[props.imageStyle, { height: 300, width: 200, margin: 0 }]}
          />
        )
      }

      const renderAvatar = (props) => {
        if (props.currentMessage.reply_id || isNewAuthor(props)) {
            return (
              <Avatar 
                  {...props} 
              />
            )
        } else {
          return <Avatar /> //blank avatar
        }
        
      }

      function getMessageIndex(message_id) {
        return messages.findIndex(obj => obj._id === message_id);
      }

      function handleBubblePress(context, message) {
        if (message.scroll_to_reply_id) {

          const index = getMessageIndex(message.scroll_to_reply_id)
          console.log(index)
          
          if (index != -1) {
              flatListRef.current?.scrollToIndex({
                animated: true,
                index: index,
                viewPosition: 0.5
              });
          }

        } else {
          if (loop && route?.name != "LoopChat") {
            navigation.navigate("LoopChat", {loop: loop, fullScreen: true})
          }
        }
      }

      async function handleSend(messages) {
          setImage(null)
          setReplyingMessage(null)
          
          let uploadedImage

          if (image) {
            uploadedImage = await uploadToCDN(image)
            console.log("Uploaded", JSON.stringify(uploadedImage))
          }

          console.log("Sending reply data:", replyingMessage?._id)
          await onSend(messages, {image_url: uploadedImage?.url, reply_id: replyingMessage?._id})
      }

      return (
          <GiftedChat
            messageContainerRef={flatListRef}
            onPress={handleBubblePress}
            onPressAvatar={(user) => {
              navigation.navigate("UserProfile", {username: user.name})
            }}
            showAvatarForEveryMessage={false}
            listViewProps={{
              style: { marginBottom: 20 },
              onScrollToIndexFailed: (error) => {
                flatListRef.current.scrollToOffset({ offset: error.averageItemLength * error.index, animated: true });
                setTimeout(() => {
                  if (messages.length !== 0 && flatListRef !== null) {
                    flatListRef.current?.scrollToIndex({ index: error.index, animated: true });
                  }
                }, 100)
              }
            }}
            alwaysShowSend
            textInputStyle={{
              backgroundColor: "rgb(50,50,50)",
              color: "white",
              minHeight: 40,
              maxLength: 100,
              borderRadius: 25,
              lineHeight: 20,
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}
            placeholder='Send a message'
            messages={messages}
            user={{
              _id: id,
            }}
            scrollToBottom={true}
            renderChatFooter={renderChatFooter}
            onSend={handleSend}
            renderSend={renderSend}
            renderAvatar={renderAvatar}
            renderBubble={renderBubble}
            renderInputToolbar={props => <CustomInputToolbar {...props} />}
            renderMessageImage={renderImage}
            textInputProps={{
              keyboardAppearance: 'dark',
              placeholderTextColor: 'gray',
              multiline: true,
              textAlignVertical: "top",
              value: undefined,
              defaultValue: route?.params?.defaultMessage,
            }}
          />
      );
}
