import React, { useState, useEffect } from "react";
import { Text, View, SafeAreaView, Image, Share, TextInput, Pressable, Alert, Modal, TouchableOpacity } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from "@expo/vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import * as Linking from 'expo-linking';
import RNPoll from "react-native-poll";

import { handleLike, deletePost, vote } from "../handlers";
import { findTimeAgo } from "../utils";
import styles from "./styles";


// import { LinkPreview } from '@flyerhq/react-native-link-preview'

export const Ping = ({ data, showLoop = true }) => {
    const navigation = useNavigation()
    const [isLiked, setIsLiked] = useState(null)
    const [numOfLikes, setNumOfLikes] = useState(null)
    const [choices, setChoices] = useState()
    //by some cruel trick by the Gods this is the only way to get choices persist as gracefully as possible between Ping screen and Ping component - although it is possible to have the checkmark on a different option
    async function handleLikePress() {
      if (isLiked) {
        setNumOfLikes(Math.max(0, numOfLikes - 1))
      } else {
        setNumOfLikes(numOfLikes + 1)
      }
      
      const newLiked = (!isLiked)
      setIsLiked(previousState => !previousState)
      await handleLike({post_id: data.post_id, endpoint: newLiked ? "like" : "unlike"})
    }

    function handleAuthorPress({ prioritizeUser }) {
        //When we click on the PFP we ALWAYS want to go to the users profile even if its a loop event
        if ((data.loop_id && (data.public || !prioritizeUser))) {
          navigation.push("Loop", {loop_id: data.loop_id, initialScreen: "Pings"})
        } else {
          navigation.push("UserProfile", {username: data.author})
        }
    }

    async function handleComment() {
      navigation.navigate("Comments", {post_id: data.post_id})
    }

    function handleDeletePress() {
      Alert.alert("Are you sure you want to delete this Ping?", "This is a permanent action that cannot be undone.", [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: async() => await deletePost(data.post_id)},
      ]);
    }

    async function handleVote(selectedChoice) {
      await vote({poll_id: data.poll.poll_id, choice: selectedChoice.id})
    }
    
    async function handleShare() {
      const prefix = Linking.createURL('/');

      await Share.share({
        title: 'Shared Ping',
        message: prefix + "ping/" + data.post_id, 
        url: prefix + "ping/" + data.post_id
       });
    }

    useEffect(() => {
      setIsLiked(data.isLiked)
      setNumOfLikes(data.numberof_likes)
      
      if (data.poll?.choices) {
        const mappedChoices = data.poll.choices.map((choice, index) => ({
          id: index,
          choice: choice,
          votes: data.poll.votes_array[index]
        }));

        setChoices(mappedChoices)
      }
    }, [data])


    return (
      <TouchableOpacity onPress={() => navigation.push("Ping", {post_id: data.post_id})} style={{marginVertical: 10, width: "95%", flexDirection: "row", padding: 10, paddingHorizontal: 20}}>
        <View style={{flexDirection: "col", flex: 1}}>
          <Pressable onPress={() => handleAuthorPress({prioritizeUser: true})}>
              <Image style={styles.tinyLogo} source={{ uri: data.pfp_url }} />
          </Pressable>
        </View>
    
        <View style={{marginLeft: 10, flex: 6}}>
          <View style={{flex: 1}}>
              <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                  <TouchableOpacity onPress={handleAuthorPress}>
                      <Text style={styles.author}>
                        {(data.loop_id && data.public) ? `[LOOP] ` : ""}
                        {data.author}

                        { data.loop_id && !data.public && showLoop && (
                          <Text style={{fontWeight: "400", color: "lightgray", fontSize: 14}}>{` (${data.loop_name})`}</Text>
                        )}
                      </Text>
                  </TouchableOpacity>
              </View>
      

              <TextInput multiline scrollEnabled={false} editable={false} style={[styles.text, {paddingVertical: 2}]} value={data.content}></TextInput>
              {/* <LinkPreview text={data.content.toString()}  /> */}
            </View>
        
          <View style={{flex: 2}}>
            { data.image_url && (
              <Image
                style={styles.attatchment}
                source={{uri: data.image_url}}
              />
           )}

            { data.poll && choices && (
              <View>

                <RNPoll
                    totalVotes={data.poll.user_vote != null ? data.poll.total_votes : data.poll.total_votes + 1}
                    choices={choices}
                    onChoicePress={handleVote}
                    hasBeenVoted={data.poll.user_vote != null}
                    votedChoiceByID={data.poll.user_vote}
                    choiceTextStyle={{color: "white", fontWeight: "bold"}}
                    percentageTextStyle={{color: "white"}}
                    fillBackgroundColor="rgb(47, 139, 128)"
                    checkMarkImageStyle={{tintColor: "white"}}
                    selectedChoiceBorderWidth={2}
                    defaultChoiceBorderWidth={1}
                    borderColor="white"
                    style={{marginBottom: 10}}
                />

                <Text style={[styles.stats, {alignSelf: "flex-end"}]}>{data.poll.total_votes} {data.poll.total_votes == 1 ? "Vote" : "Votes"}</Text>

              </View>
            )}
          </View>
        
    
          <View style={{flexDirection: "row", flex: 1, marginVertical: 5}}>
            <Pressable onPress={handleLikePress}>
              <Ionicons style={[styles.pingIcon, {color: isLiked ? "red" : "white"}]} name={isLiked ? "heart" : "heart-outline"} size={20}></Ionicons>
            </Pressable>
    
            <TouchableOpacity onPress={handleComment}>
              <Ionicons style={styles.pingIcon} name="chatbubble-outline" size={20}></Ionicons>
            </TouchableOpacity>
    
            <TouchableOpacity onPress={handleShare}>
              <Ionicons style={styles.pingIcon} name="share-social-outline" size={20}></Ionicons>
            </TouchableOpacity>
    
            {data.isAuthor && (
                <TouchableOpacity onPress={handleDeletePress}>
                  <Feather style={styles.pingIcon} name="trash" size={20}></Feather>
                </TouchableOpacity>
            )}
            {/* <Pressable>
              <Ionicons style={styles.pingIcon} name="paper-plane-outline" size={20}></Ionicons>
            </Pressable> */}
          </View>

          <View style={{flex: 1, marginTop: 5, justifyContent: 'space-between', flexDirection: "row"}}>
            <Text style={styles.stats}>{numOfLikes} Likes • {data.numberof_comments} Comments</Text>
            <Text style={{color: "gray"}}>{findTimeAgo(data.created_at)}</Text>
          </View>
        </View>

      </TouchableOpacity>
  );
}
  
  
  