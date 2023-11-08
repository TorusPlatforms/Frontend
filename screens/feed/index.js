import React, { useState, useRef } from 'react'
import { StyleSheet, Text, View, TextInput, Dimensions, Pressable, FlatList, Image, Animated } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FontAwesome5 } from '@expo/vector-icons'; 

import styles from "./styles";

export default function Feed() {
    //const [text, onChangeText] = useState();

    // const scrollY = new Animated.Value(0);
    // const diffClamp = Animated.diffClamp(scrollY, 0, 150);
    // const translateY = diffClamp.interpolate({
    //   inputRange: [0, 150],
    //   outputRange: [0, -150],
    // });
 

    // function handleScroll(e) {
    //   scrollY.setValue(e.nativeEvent.contentOffset.y);
    // }
    
    const scrollY = useRef(new Animated.Value(0)).current;

    const headerHeight = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [100, 70], 
        extrapolate: 'clamp',
    });

    const logoSize = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [75, 50],
        extrapolate: 'clamp',
    });

    const textSize = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [15, 10], 
        extrapolate: 'clamp',
    });



    function handleLike() {
      console.log("Liked a post!")
    }

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
    
    const examplePing = {isLiked: true, attatchment: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Glazed-Donut.jpg/1200px-Glazed-Donut.jpg", author: 'GrantHough', likes: 20, comments: 30, caption: 'Funny Caption. Hilarious even. My name is Grant Hough and I love dogs!', pfp: 'https://cdn.discordapp.com/avatars/393834794057728000/661f702722649b4aeb5a660c295d1ee3.webp?size=96'}
    const data = new Array(6).fill(examplePing);
    
  
    return (
        <SafeAreaView style={{flex: 1, alignItems: "center", backgroundColor: "rgb(22, 23, 24)"}}>

            {/* <View style={{flex: 1, borderWidth: 1, borderRadius: 10, borderColor: 'white', minHeight: 30, width: windowWidth - 50, padding: 5, justifyContent: "space-between"}}>
              <TextInput
                  maxLength={250}
                  multiline
                  onChangeText={onChangeText}
                  value={text}
                  style={{color: "white"}}
                  placeholder='Start pinging your community'
                  placeholderTextColor={"white"}
                />

                <Pressable style={{alignSelf: "flex-end", padding: 5}}>
                  <Ionicons name="send" size={20} color="white" />
                </Pressable>
            </View> */}

          <Animated.View style={{ height: headerHeight, marginTop: 5, justifyContent: 'center', alignItems: "center" }}>
                <Animated.Image
                    style={[styles.torusLogo, { width: logoSize, height: logoSize }]}
                    source={require('../../assets/torus.png')}
                />
                <Animated.View style={{ flexDirection: "row", justifyContent: "space-evenly", width: "100%", padding: 10 }}>
                    <Pressable>
                        <Animated.Text style={{color: "white", textDecorationLine: "underline", fontWeight: "bold", fontSize: textSize}}>For You</Animated.Text>
                    </Pressable>
                    <Pressable>
                        <Animated.Text style={{color: "white", textDecorationLine: "underline", fontWeight: "bold", fontSize: textSize}}>Friends</Animated.Text>
                    </Pressable>
                </Animated.View>
            </Animated.View>


            <View style={{flex: 6}}>
              <FlatList
                    style={{paddingHorizontal: 20}}
                    data={data}
                    renderItem={({item}) => <Ping data={item} />}
                    ItemSeparatorComponent={() => <View style={styles.item_seperator}/>}
                    //onScroll={handleScroll}
                    onScroll={Animated.event(
                      [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                      { useNativeDriver: false } // Set to true if only animating opacity or transform
                  )}
                  scrollEventThrottle={16}
                />
            </View>
        </SafeAreaView>
    )
}