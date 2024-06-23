import React, { useEffect, useState, useRef } from 'react';
import { Text, View, Animated, Image, Keyboard, FlatList, Pressable, Alert, Share, Modal, KeyboardAvoidingView, TextInput, Platform } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';

import { getComments, postComment } from '../handlers';
import { findTimeAgo } from '../utils';
import styles from "./styles";
import SwipeModal from '@birdwingo/react-native-swipe-modal';
import AppleRow from './AppleRow';


export const SwipeableRow = ({ item, handleReply }) => {
  if (item.isAuthor) {
      return (
        <AppleRow comment_id={item.comment_id}>
          <Comment data={item} handleReply={handleReply} />
        </AppleRow>
      );
    } else {
      return <Comment data={item} handleReply={handleReply} />
  }
};


const Comment = ({data, handleReply}) => (
    <View style={styles.commentContainer}>
      <View style={{flex: 0.15, justifyContent: 'center', alignItems: 'center'}}>
        <Image
            style={styles.tinyLogo}
            source={{uri: data.pfp_url}}
          />
      </View>
  
      <View style={styles.commentTextContainer}>
          <View style={{flexDirection: "row", justifyContent: "space-between"}}>
            <Text style={{color: 'white', fontSize: 12}}>{data.author}</Text>
            <Text style={styles.commentTime}>{findTimeAgo((data.created_at))}</Text>
          </View>
        
          <Text style={[styles.text, {maxWidth: 200, marginTop: 2}]}>{data.content}</Text>

  
        {/* <View>
          <Pressable onPress={() => handleReply(data)}>
            <Text style={styles.reply}>Reply</Text>
          </Pressable>
        </View> */}
      </View>
  
      {/* <View style={styles.likeContainer}>
          <Pressable onPress={() => handleCommentLike(data)}>
            <Ionicons style={[styles.pingIcon, {color: data.isLiked ? "red" : "white"}]} name={data.isLiked ? "heart" : "heart-outline"} size={20}></Ionicons>
          </Pressable>
      </View> */}
    </View>
  )
  
