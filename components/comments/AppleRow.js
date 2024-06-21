import React, { Component } from 'react';
import { Animated, StyleSheet, Text, View, I18nManager } from 'react-native';
import { RectButton, Swipeable } from 'react-native-gesture-handler';

import { deleteComment } from '../handlers';

export default class AppleRow extends Component {
    renderRightAction = (text, color, x, progress) => {
      const trans = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [x, 0],
      });
      const pressHandler = async() => {
        this.close()
        await deleteComment(this.props.comment_id)
      };

      return (
        <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
          <RectButton
            style={[styles.rightAction, { backgroundColor: color }]}
            onPress={pressHandler}
          >
            <Text style={styles.actionText}>{text}</Text>
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
        {this.renderRightAction('Delete', '#dd2c00', 64, progress)}
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

const styles = StyleSheet.create({
  actionText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'transparent',
    padding: 10,
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
