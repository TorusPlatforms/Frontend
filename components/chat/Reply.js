import React, { Component } from 'react';
import { Animated, StyleSheet, Alert, View, I18nManager } from 'react-native';
import { RectButton, Swipeable } from 'react-native-gesture-handler';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default class Reply extends Component {
    renderRightAction = (color, progress) => {
      return (
        <Animated.View style={{ flex: 1, opacity: progress, justifyContent: "center", backgroundColor: color, marginRight: 8, marginLeft: 4 }}>
            <FontAwesome name={"reply"} color={"white"} size={20} />
        </Animated.View>
      );
    };

    renderRightActions = (progress, _dragAnimatedValue) => (
      <View
        style={{
          width: 40,
          flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        }}
      >
        {this.renderRightAction('rgb(22, 23, 24)', progress)}
      </View>
    );

  updateRef = (ref) => {
    this.swipeableRow = ref;
  };

  close = () => {
    this.swipeableRow?.close();
  };

  handleSwipeableOpen = (direction) => {
    this.setReplying(this.props.message)
    this.close()
  };

  render() {
    const { children, setReplying, direction } = this.props;

    this.setReplying = setReplying

    return (
      <Swipeable
        ref={this.updateRef}
        friction={2}
        enableTrackpadTwoFingerGesture
        rightThreshold={40}
        leftThreshold={40}
        renderLeftActions={direction == "left" ? this.renderRightActions : null}
        renderRightActions={direction == "right" ? this.renderRightActions : null}
        onSwipeableOpen={this.handleSwipeableOpen}
      >
        {children}
      </Swipeable>
    );
  }
}
