import React, { useRef } from "react";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect } from "@react-navigation/native";
import { View, TouchableOpacity, Animated } from "react-native";

import styles from "./styles"


export default function CreatePill({ setModalVisible, navigation }) {
  const animation = useRef(new Animated.Value(0)).current;
  const radius = 80;

  function getXCoordinate(fraction) {
    //left:
    return (radius * Math.cos(Math.PI * fraction));
  }

  function getYCoordinate(fraction) {
    //bottom:
    return -((radius * Math.sin(Math.PI * fraction))) / 3;
  }

  const x1 = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [getXCoordinate(0), getXCoordinate(1 / 2)],
  });

  const y1 = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [getYCoordinate(0), getYCoordinate(1 / 4), getYCoordinate(1 / 2)],
  });

  const x2 = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [getXCoordinate(0), getXCoordinate(1)],
  });

  const y2 = animation.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [getYCoordinate(0), getYCoordinate(1 / 4), getYCoordinate(1 / 2), getYCoordinate(3 / 4), getYCoordinate(1)],
  });

  useFocusEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();

    return () => {
      setModalVisible(false);
    };
  });

 

  const pills = [
    { text: 'Loop', navigateTo: 'CreateLoop', x: getXCoordinate(0), y: getYCoordinate(0), icon: "group-add" },
    { text: 'Ping', navigateTo: 'Create', x: x1, y: y1, icon: "create" },
    { text: 'Event', navigateTo: 'CreateEvent', x: x2, y: y2, icon: "calendar-month" }
  ];

  return (
    <View style={styles.container}>
      {pills.map((pill, index) => {
        return (
          <TouchableOpacity
            key={index}
            style={[styles.pillButton, { transform: [{ translateX: pill.x }, { translateY: pill.y }] }]}
            onPress={() => {
              setModalVisible(false);
              navigation.navigate(pill.navigateTo);
            }}
          >
            <MaterialIcons name={pill.icon} color={"white"} size={24} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

