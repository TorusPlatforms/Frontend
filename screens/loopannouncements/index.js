import React, { useState, useCallback, useEffect } from 'react';
import { View } from "react-native";
import { GiftedChat, Bubble, InputToolbar, Avatar } from 'react-native-gifted-chat';
import styles from "./styles";


const exampleLoopData = {
    pfp: "https://cdn.discordapp.com/attachments/803748247402184714/822541056436207657/kobe_b.PNG?ex=658f138d&is=657c9e8d&hm=37b45449720e87fa714d5a991c90f7fac4abb55f6de14f63253cdbf2da0dd7a4&",
    displayName: "Grant's Group",
    memberCount: 30,
    description: "A place for Grants and Hoes to chill",
    chatCount:1,
    chats: ['Chat 1', 'Chat 2', 'Chat 3', 'Chat 4', 'Chat 5','Chat 6', 'Chat 7', 'Chat 8', 'Chat 9'],
    recentAnnouncement: "Grant becomes world's first trillionaire after buying every single realfeel dumpad and selling them for billions each",
    recentAnnouncementUser:"@stefan",
    users: ["DrumDogLover","TanujBeatMaster","GrantPawRhythms", "DogGrooveMaster","GrantAndTanujJams","RhythmHound","DrumBeatsWithTanuj","GrantCanineGrooves","TanujDogDrummer","BarkingBeatsGrant","DrummingTanujPaws","GrantAndDogRhythms","TanujDrumTails","PuppyGroovesGrant","BeatBuddyTanuj","WoofingRhythmsGrant","DrummingPawsTanuj","GrantGroovePup","TanujAndTheBeat","DoggyDrummingGrant","RhythmTanujTail","GrantPercussionPup","TanujDoggieBeats","PawsAndSnaresGrant","DrummingDogTanuj","GrantBeatsHowl","TanujRhythmBuddy","DogBeatHarmonyGrant","DrumPawsTanujGroove","GrantAndTanujRhythmic",]
}

const exampleUserData = {
    admin: true,
}

export default function LoopAnnouncements() {
    const [messages, setMessages] = useState([])

    useEffect(() => {
        setMessages([
            {
                _id: 1,
                text: exampleLoopData.recentAnnouncement,
                createdAt: new Date(),
                user: {
                    __id: 2,
                    name: 'React Native',
                    avatar: 'https://cdn.discordapp.com/attachments/803748247402184714/822541056436207657/kobe_b.PNG?ex=658f138d&is=657c9e8d&hm=37b45449720e87fa714d5a991c90f7fac4abb55f6de14f63253cdbf2da0dd7a4&',
                },
            },
        ])
    }, [])

    async function fetchAnnouncement() {
        console.log(route.params.username);
        const dm = await getDM(route.params.username);
        console.log("FETCH DM DM: ")
        console.log(dm);
        console.log("dm messsages" + dm[0].messages);
        setMessages(dm[0].messages);
      }

    const onSend = useCallback((messages = []) => {
        if (exampleUserData.admin) {
            setMessages(previousMessages =>
                GiftedChat.append(previousMessages, messages),
            );
        } else {
            // Handle the case where the user is not an admin
            console.log("You do not have permission to send messages.");
        }
    }, [])

    const CustomInputToolbar = props => {
        if (exampleUserData.admin) {
            return (
                <InputToolbar
                    {...props}
                    containerStyle={{
                        backgroundColor: 'transparent',
                        borderTopWidth: 0,
                        paddingHorizontal: 10,
                        marginBottom: 25
                    }}
                />
            );
        } else {
            return null; // Return null if the user is not an admin
        }
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
            <View style={{ marginBottom: 20 }}>
                <Avatar
                    {...props}
                    containerStyle={{ marginLeft: 10, marginRight: 10 }}
                    imageStyle={{ borderRadius: 20 }}
                />
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <GiftedChat
                textInputStyle={{
                    backgroundColor: "rgb(50,50,50)",
                    color: "white",
                    marginLeft: 5,
                    marginTop: 10,
                    paddingLeft: 10,
                    borderRadius: 25
                }}
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: 1,
                }}
                renderBubble={renderBubble}
                renderInputToolbar={CustomInputToolbar}
                textInputProps={{
                    placeholderTextColor: 'gray',
                    multiline: false,
                }}
                renderAvatar={renderAvatar}
            />
        </View>
    );
}


export async function getAnnouncements() {
  
    const serverUrl = `https://backend-26ufgpn3sq-uc.a.run.app/api/loops/getAnnouncements/${loopId}`;
  
    try {
      const response = await fetch(serverUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
  
      if (!response.ok) {
        throw new Error(`Error getting DM! Status: ${response.status}`);
      }
  
      const responseData = await response.json();
      console.log('DMs:', responseData);
      return responseData;
  
    } catch (error) {
      console.error("Error getting DM", error.message);
    }
  }
  