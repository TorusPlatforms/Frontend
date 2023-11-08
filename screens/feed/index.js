import React, { useState, useRef } from 'react'
import { StyleSheet, Text, View, TextInput, Dimensions, Pressable, FlatList, Image, Animated } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import styles from "./styles";

export default function Feed() {
    const [text, onChangeText] = useState();

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const scrollY = new Animated.Value(0);
    const diffClamp = Animated.diffClamp(scrollY, 0, 100);
    const translateY = diffClamp.interpolate({
      inputRange: [0, 100],
      outputRange: [0, -100],
    });
 

    function handleScroll(e) {
      scrollY.setValue(e.nativeEvent.contentOffset.y);
      
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
            <Ionicons style={styles.pingIcon} name="heart-outline" size={20}></Ionicons>
            <Ionicons style={styles.pingIcon} name="chatbubble-outline" size={20}></Ionicons>
            <Ionicons style={styles.pingIcon} name="share-social-outline" size={20}></Ionicons>
            <Ionicons style={styles.pingIcon} name="paper-plane-outline" size={20}></Ionicons>
          </View>

          <Text style={styles.stats}>{data.likes} Likes • {data.comments} Replies</Text>

        </View>
      </View>
    );
    
    const examplePing = {attatchment: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Glazed-Donut.jpg/1200px-Glazed-Donut.jpg", author: 'GrantHough', likes: 20, comments: 30, caption: 'Funny Caption. Hilarious even. My name is Grant Hough and I love dogs!', pfp: 'https://cdn.discordapp.com/avatars/393834794057728000/661f702722649b4aeb5a660c295d1ee3.webp?size=96'}
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

          <Animated.View style={{transform: [{translateY: translateY}], marginTop: 5, flex: 0.5}}>
              <View style={{flex: 0.5, justifyContent: 'center', alignItems: "center"}}>
                <Image
                  style={styles.torusLogo}
                  source={require('../../assets/torus.png')}
                />
              </View>
              <View style={{flex : 0.5, flexDirection: "row", justifyContent: "space-evenly", width: "100%", padding: 10}}>
                <Pressable>
                  <Text style={{color: "white", textDecorationLine: "underline", fontWeight: "bold", fontSize: 15}}>For You</Text>
                </Pressable>

                <Pressable>
                  <Text style={{color: "white", textDecorationLine: "underline", fontWeight: "bold", fontSize: 15}}>Friends</Text>
                </Pressable>
              </View>
            </Animated.View>

            <Animated.View style={{flex: 6}}>
              <FlatList
                    style={{paddingHorizontal: 20}}
                    data={data}
                    renderItem={({item}) => <Ping data={item} />}
                    ItemSeparatorComponent={() => <View style={styles.item_seperator}/>}
                    onScroll={handleScroll}
                />
            </Animated.View>
        </SafeAreaView>
    )
}