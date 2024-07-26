import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Image, Text, Pressable, Alert, ActivityIndicator, RefreshControl, FlatList, KeyboardAvoidingView, Platform, TextInput, Keyboard, Share } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import * as Linking from "expo-linking";
import Lightbox from 'react-native-lightbox-v2';
import RNPoll from "react-native-poll";
// import { LinkPreview } from '@flyerhq/react-native-link-preview';

import { findTimeAgo } from '../../components/utils';
import { getPing, deletePost, handleLike, vote } from "../../components/handlers";
import { Comments } from '../../components/comments';
import styles from "./styles"


export default function Ping({ route }) {
  const navigation = useNavigation()
  const { post_id, scrollToComment, showReplies } = route.params

  const [post, setPost] = useState();
  const [isLiked, setIsLiked] = useState()
  const [numOfLikes, setNumOfLikes] = useState()
  const [numOfVotes, setNumOfVotes] = useState()
  const [choices, setChoices] = useState()

  async function fetchPost() {
    const fetchedPost = await getPing(post_id)
    console.log("Fetched post: ", fetchedPost)

    if (fetchedPost) {
      setPost(fetchedPost)
      setIsLiked(fetchedPost.isLiked)
      setNumOfLikes(fetchedPost.numberof_likes)
      
      if (fetchedPost.poll?.choices) {
        setNumOfVotes(fetchedPost.poll.total_votes)

        const mappedChoices = fetchedPost.poll.choices.map((choice, index) => ({
          id: index,
          choice: choice,
          votes: fetchedPost.poll.votes_array[index]
        }));

        setChoices(mappedChoices)
      }

    } else {
      navigation.goBack()
    }
  }


  async function handleLikePress() {
      if (isLiked) {
        setNumOfLikes(Math.max(0, numOfLikes - 1))
      } else {
        setNumOfLikes(numOfLikes + 1)
      }

      const newLiked = (!isLiked)
      setIsLiked(previousState => !previousState)
      await handleLike({post_id: post_id, endpoint: newLiked ? "like" : "unlike"})
  }

  function handleAuthorPress({ prioritizeUser }) {
    //When we click on the PFP we ALWAYS want to go to the users profile even if its a loop event
    if ((post.loop_id && (post.public || !prioritizeUser))) {
      navigation.push("Loop", {loop_id: post.loop_id, initialScreen: "Pings"})
    } else {
      navigation.push("UserProfile", {username: post.author})
    }
  }

  async function handleVote(selectedChoice) {
    await vote({poll_id: post.poll.poll_id, choice: selectedChoice.id})
  }

  function handleDeletePress() {
    Alert.alert("Are you sure you want to delete this Ping?", "This is a permanent action that cannot be undone.", [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: async() => await deletePost(post.post_id)},
    ]);
  }

  async function handleShare() {
    const prefix = Linking.createURL('/');

    await Share.share({
      title: 'Shared Ping',
      message: prefix + "ping/" + post.post_id, 
      url: prefix + "ping/" + post.post_id
     });
  }


  useEffect(() => {
    fetchPost()
  }, []);

  if (!post) {
      return (
        <View style={{flex: 1, backgroundColor: "rgb(22, 23, 24)", justifyContent: "center", alignItems: "center"}}>
            <ActivityIndicator />
        </View>
      )
  }

  const header = (
    <View style={{marginBottom: 20}}>
        <View style={{marginVertical: 10, width: "95%", flexDirection: "row", padding: 10, paddingHorizontal: 20, minHeight: 60}}>
              <Pressable onPress={() => handleAuthorPress({prioritizeUser: true})}>
                <Image
                  style={styles.tinyLogo}
                  source={{uri: post.pfp_url}}
                />
              </Pressable>
        
              <View style={{marginLeft: 20, flex: 6}}>
                    <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                        <TouchableOpacity onPress={handleAuthorPress}>
                          <Text style={styles.author}>
                            {(post.loop_id && post.public) ? `[LOOP] ` : ""}
                            {post.author}

                            { post.loop_id && !post.public && (
                              <Text style={{fontWeight: "400", color: "lightgray", fontSize: 14}}>{` (${post.loop_name})`}</Text>
                            )}
                          </Text>
                      </TouchableOpacity>
                          
                    </View>
            

                    <TextInput multiline editable={false} style={[styles.text, {padding: 2}]} value={post.content}></TextInput>

                    {/* <LinkPreview 
                      text={post.content.toString()}  
                      renderText={(text) => {
                        return <Text style={{color: "white", fontSize: 16}}>{text}</Text>
                      }}  
                      containerStyle={{padding: 2}}
                    /> */}
       
 
                    { post.image_url && (
                      <Lightbox navigator={navigation} activeProps={{style: styles.fullscreenImage}}>

                          <Image
                            style={styles.attatchment}
                            source={{uri: post.image_url}}
                          />
                      </Lightbox>
                    )}

                    { post.poll && choices && (
                        <View>

                            <RNPoll
                                totalVotes={post.poll.user_vote != null ? numOfVotes : numOfVotes + 1}
                                choices={choices}
                                onChoicePress={handleVote}
                                hasBeenVoted={post.poll.user_vote != null}
                                votedChoiceByID={post.poll.user_vote}
                                choiceTextStyle={{color: "white", fontWeight: "bold"}}
                                percentageTextStyle={{color: "white"}}
                                fillBackgroundColor="rgb(47, 139, 128)"
                                checkMarkImageStyle={{tintColor: "white"}}
                                selectedChoiceBorderWidth={2}
                                defaultChoiceBorderWidth={1}
                                borderColor="white"
                                style={{marginBottom: 10}}
                            />

                            <TouchableOpacity onPress={() => navigation.navigate("VotedUsers", { poll_id: post.poll.poll_id})}>
                              <Text style={{alignSelf: "flex-end", color: "gray"}}>{numOfVotes} {numOfVotes == 1 ? "Vote" : "Votes"}</Text>
                            </TouchableOpacity>

                        </View>
                      )}
              </View>
        </View>

        <View style={{height: 50, justifyContent: 'space-between', flexDirection: "col", paddingHorizontal: 20, marginBottom: 15}}>
            <View style={{flexDirection: "row", marginLeft: 20}}>
              <Pressable onPress={handleLikePress}>
                <Ionicons style={[styles.pingIcon, {color: isLiked ? "red" : "white"}]} name={isLiked ? "heart" : "heart-outline"} size={20}></Ionicons>
              </Pressable>

              <TouchableOpacity onPress={handleShare}>
                <Ionicons style={[styles.pingIcon, {color: "white"}]} name={"share-social"} size={20}></Ionicons>
              </TouchableOpacity>

              { post.isAuthor && (
                <TouchableOpacity onPress={handleDeletePress} style={styles.pingIcon}>
                  <Feather name="trash" size={20} color="white" />
                </TouchableOpacity>
              )}
        
            </View>
            
            <View style={{flexDirection: 'row', justifyContent: "space-between", paddingVertical: 15, height: 100}}>
                <TouchableOpacity onPress={() => navigation.navigate("LikedUsers", {post_id: post.post_id})}>
                  <Text style={styles.stats}>{numOfLikes} Likes • {post.numberof_comments} Comments</Text>
                </TouchableOpacity>

                <Text style={{color: "gray"}}>{findTimeAgo(post.created_at)}</Text>

            </View>

        </View>

        <View style={styles.item_seperator} />


      </View>
  )
  
  return (
    <View style={styles.container}>      
        <Comments 
          post_id={post_id}
          headerComponent={header}
          scrollToCommentID={scrollToComment}
          showReplies={showReplies}
        />

    </View>
  )
}
