import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity, Image, Pressable } from "react-native";
import { GiftedChat, Bubble, InputToolbar , Avatar,  Send, ActionsProps, MessageImage } from 'react-native-gifted-chat';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import Ionicons from '@expo/vector-icons/Ionicons';
import { pickImage } from '../imagepicker';
import { uploadToCDN } from '../handlers';


const CustomInputToolbar = props => {
  return (
    <InputToolbar
      {...props}
      containerStyle={{
        backgroundColor: 'transparent', 
        borderTopWidth: 0, 
        paddingHorizontal: 10,
        alignItems: 'center'
      }}
    />
  );
};


export const ChatComponent = ({ messages, onSend, id, loop, route }) => {
      const navigation = useNavigation()
      const [image, setImage] = useState()

      function isNewAuthor(props) {
        return props.previousMessage?.user?._id != props.currentMessage?.user?._id
      }
      
      const handleImageSelect = (fetchedImage) => {
        if (!fetchedImage.canceled) {
          setImage(fetchedImage)
        }
      };
      
      const renderChatFooter = useCallback(() => {
        if (image) {
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
      }, [image]);

      async function handleAttatchment({ defaultMessage }) {
        if (loop && route?.name != "LoopChat") {
          navigation.navigate("LoopChat", {loop: loop, fullScreen: true, defaultMessage: defaultMessage})
        } else {
          pickImage(handleImageSelect, false)
        }
      }

      const renderSend = (props) => {
        return (
            <View style={{ flexDirection: 'row', alignItems: "center", marginBottom: 2 }}>
              <TouchableOpacity onPress={() => handleAttatchment({ defaultMessage: props.text })}>
                <FontAwesome
                    name="image"
                    style={{
                      marginLeft: 5,
                      transform: [{rotateY: '180deg'}],
                    }}
                    size={24}
                    color='white'
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

      const renderBubble = (props) => {
          return (
            <View>
                {(props.user._id != props.currentMessage.user._id) && isNewAuthor(props) && (
                  <TouchableOpacity onPress={() => navigation.navigate("UserProfile", {username: props.currentMessage.user.name})}>
                    <Text style={{color: "lightgray", marginBottom: 4, marginLeft: 2}}>{props.currentMessage.user.name}</Text>
                  </TouchableOpacity>
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

            </View>
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
        if (isNewAuthor(props)) {
            return (
              <Avatar 
                  {...props} 
                  containerStyle={{
                    left: {
                      marginBottom: props.currentMessage.image ? 300 : 20
                    },
                  }}
              />
            )
        } else {
          return <Avatar /> //blank avatar
        }
        
      }

      function handleBubblePress() {
        if (loop) {
          navigation.navigate("LoopChat", {loop: loop, fullScreen: true})
        }
      }

      async function handleSend(messages) {
          setImage(null)

          let uploadedImage

          if (image) {
            uploadedImage = await uploadToCDN(image)
            console.log("Uploaded", JSON.stringify(uploadedImage))
          }

          await onSend(messages, uploadedImage?.url)
      }

      return (
          <GiftedChat
            onPress={handleBubblePress}
            onPressAvatar={(user) => {
              navigation.navigate("UserProfile", {username: user.name})
            }}
            showAvatarForEveryMessage={false}
            listViewProps={{style: { marginBottom: 20 }}}
            alwaysShowSend
            textInputStyle={{
              backgroundColor: "rgb(50,50,50)",
              color: "white",
              minHeight: 40,
              maxHeight: 200,
              maxLength: 100,
              borderRadius: 25,
              lineHeight: 20,
              paddingHorizontal: 20,
              paddingTop: 10,
            }}
            placeholder='Send a message'
            messages={messages}
            user={{
              _id: id,
            }}
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
