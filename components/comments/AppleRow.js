import React, { Component } from 'react';
import { Animated, StyleSheet, Alert, View, I18nManager } from 'react-native';
import { RectButton, Swipeable } from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons';

import { deleteComment } from '../handlers';
import { removeReply } from '../handlers/replies';

export default class AppleRow extends Component {
    renderRightAction = (text, color, x, progress) => {
      const trans = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [x, 0],
      });

      const pressHandler = async() => {
        Alert.alert("Are you sure you want to delete this comment?", "This is a permanent action that cannot be undone.", [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', onPress: async() => {
            if (this.props.comment_id) {
              await deleteComment(this.props.comment_id)
            } else if (this.props.reply_id) {
              await removeReply(this.props.reply_id)
            } else {
              throw new Error("No ID supplied to delete in SwipeableRow")
            }
            }
          },
        ]);
        
        this.close()
      };

      return (
        <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
          <RectButton style={{ backgroundColor: color, justifyContent: 'center', alignItems: "center", flex: 1 }} onPress={pressHandler}>
              <Ionicons name={"trash"} color={"red"} size={20}></Ionicons>
          </RectButton>
        </Animated.View>
      );
    };

    //support for multiple actions
    renderRightActions = (progress, _dragAnimatedValue) => (
      <View
        style={{
          width: 94,
          flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        }}
      >
        {this.renderRightAction('Delete', 'rgb(22, 23, 24)', 64, progress)}
      </View>
    );

  updateRef = (ref) => {
    this.swipeableRow = ref;
  };

  close = () => {
    this.swipeableRow?.close();
  };

  render() {
    const { children } = this.props;

    return (
      <Swipeable
        ref={this.updateRef}
        friction={2}
        enableTrackpadTwoFingerGesture
        rightThreshold={40}
        renderRightActions={this.renderRightActions}
      >
        {children}
      </Swipeable>
    );
  }
}
