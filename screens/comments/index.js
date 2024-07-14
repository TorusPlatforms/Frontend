import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Text, View, Animated, Image, Keyboard, FlatList, Pressable, SafeAreaView, Share, TouchableOpacity, KeyboardAvoidingView, TextInput, Platform } from 'react-native'

import { Comments } from '../../components/comments';
import styles from "./styles";


export default function CommentsScreen({ route }) {
    const { post_id } = route.params

    return (
      <SafeAreaView style={styles.container}>
          <Comments 
            post_id={post_id}
          />
             
        </SafeAreaView>
    )
}





  