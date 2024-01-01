import React, { useState, useRef } from 'react'
import { StyleSheet, Text, View, TextInput, Dimensions, Pressable, FlatList, Image, Animated } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from '@react-navigation/native';

import styles from "./styles";


const examplePing = {isLiked: true, attatchment: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Glazed-Donut.jpg/1200px-Glazed-Donut.jpg", author: 'GrantHough', likes: 20, comments: 30, caption: 'Funny Caption. Hilarious even. My name is Grant Hough and I love dogs!', pfp: 'https://cdn.discordapp.com/attachments/803748247402184714/822541056436207657/kobe_b.PNG?ex=658f138d&is=657c9e8d&hm=37b45449720e87fa714d5a991c90f7fac4abb55f6de14f63253cdbf2da0dd7a4&'}
const data = new Array(6).fill(examplePing);


export default function Feed({ route, navigation }) {
    const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
    const [scrollY] = useState(new Animated.Value(0));
    const [feedType, setFeedType] = useState(null);
    const [isFocus, setIsFocus] = useState(false);

    const headerHeight = scrollY.interpolate({
      inputRange: [0, 70],
      outputRange: [70, 0],
      extrapolate: 'clamp',
    })

    const headerOpacity = scrollY.interpolate({
      inputRange: [0, 70],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    function handleLike() {
      console.log("Liked a post!")
    }

    function feedChange(type) {
      console.log("Feed was changed to" + type)
      setFeedType(type)
    }

    const dropdownData = [
      { label: 'Friends', value: 'friends' },
      { label: 'College', value: 'college' },
    ];
    
    const renderLabel = () => {
      if (value || isFocus) {
        return (
          <Text style={{color: "white", fontSize: 12}}>
            Torus
          </Text>
        );
      }
      return null;
    };


    const Ping = ({data}) => (
      <View style={{marginVertical: 10, width: "95%", flexDirection: "row"}}>
        <View style={{flexDirection: "col"}}>
          <Image
            style={styles.tinyLogo}
            source={{uri: data.pfp,}}
          />

          <View style={styles.verticalLine} />
        </View>

        <View style={{marginLeft: 10}}>
          <Text style={styles.author}>{data.author}</Text>
          <Text style={styles.text}>{data.caption}</Text>

          <Image
            style={[styles.attatchment, {display: data.attatchment ? "flex" : "none"}]}
            source={{uri: data.attatchment}}
            resizeMode='contain'
          />

          <View style={{flexDirection: "row", marginVertical: 5}}>
            <Pressable onPress={handleLike}>
              <Ionicons style={[styles.pingIcon, {color: data.isLiked ? "red" : "white"}]} name={data.isLiked ? "heart" : "heart-outline"} size={20}></Ionicons>
            </Pressable>

            <Pressable>
              <Ionicons style={styles.pingIcon} name="chatbubble-outline" size={20}></Ionicons>
            </Pressable>

            <Pressable>
              <Ionicons style={styles.pingIcon} name="share-social-outline" size={20}></Ionicons>
            </Pressable>

            <Pressable>
              <Ionicons style={styles.pingIcon} name="paper-plane-outline" size={20}></Ionicons>
            </Pressable>
          </View>

          <Text style={styles.stats}>{data.likes} Likes • {data.comments} Replies</Text>
        </View>
      </View>
    );
    


  
    return (
      
        <SafeAreaView style={{flex: 1, backgroundColor: "rgb(22, 23, 24)"}}>
          <Animated.View style={{height: headerHeight, opacity: headerOpacity}}>
              <View style={styles.header}>
                  <View style={{flex: 0.3}}>
                    <Dropdown
                      containerStyle={{borderRadius: 10}}
                      selectedTextStyle={{color: 'white'}}
                      data={dropdownData}
                      placeholder='Torus'
                      placeholderStyle={{color: "white"}}
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      value={feedType}
                      onFocus={() => setIsFocus(true)}
                      onBlur={() => setIsFocus(false)}
                      onChange={item => {
                        feedChange(item.value);
                        setIsFocus(false);
                      }}
                    />
                  </View>

                <View>
                  <Pressable onPress={() => navigation.navigate("Settings")}>
                      <Ionicons name="ios-notifications-outline" size={24} color="white" />
                  </Pressable>
                </View>

              </View>
            </Animated.View>

            <AnimatedFlatList
                  style={{paddingHorizontal: 20}}
                  data={data}
                  renderItem={({item}) => <Ping data={item} />}
                  ItemSeparatorComponent={() => <View style={styles.item_seperator}/>}
                  onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                  )}
                  scrollEventThrottle={16}
              />
        </SafeAreaView>
    )
}