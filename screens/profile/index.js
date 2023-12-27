import React, { useState, useEffect, useRef} from 'react'
import { StyleSheet, Text, View, SafeAreaView, Image, Animated, Easing, FlatList, Pressable, TouchableOpacity } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Clipboard from 'expo-clipboard';
import { useNavigation } from "@react-navigation/native";

import styles from "./styles";

const exampleUserData = {
    pfp: "https://cdn.discordapp.com/attachments/803748247402184714/822541056436207657/kobe_b.PNG?ex=658f138d&is=657c9e8d&hm=37b45449720e87fa714d5a991c90f7fac4abb55f6de14f63253cdbf2da0dd7a4&",
    displayName: "Grant Hough",
    username: "@granthough",
    following: 128,
    followers: 259,
    description: "A pretty funny guy. Has a strong affinity for dogs. \n Stefan Murphy: 'The test is in'"
}

const exampleLoopsData = {name: "Dorm", pfp: "https://icons.iconarchive.com/icons/graphicloads/100-flat/256/home-icon.png"}

const exampleLoopsArray = new Array(6).fill(exampleLoopsData)


export default function Profile() {
    const navigation = useNavigation()

    const movingLine = useRef(new Animated.Value(0)).current;

    async function copyUsernameToClipboard() {
        await Clipboard.setStringAsync(exampleUserData.username);
      };

      const goToLoop = () => {
        navigation.navigate('Loop'); 
      };


    const Loop = ({data}) => (
        <View style={{marginVertical: 10, width: "100%", flexDirection: "row", paddingHorizontal: 20}}>
            <Image style={{width: 50, height: 50, borderRadius: 25, flex: 1}} source={{uri: data.pfp}}/>

            <View style={{flexDirection: 'col', marginLeft: 10, flex: 5}}>
                <TouchableOpacity onPress={goToLoop}>
                <Text style={{color: 'white', fontWeight: "bold"}}>Example Loop</Text>
                <Text style={{color: 'white'}}>GrantHough said "my last message"</Text>
                </TouchableOpacity>
                
            </View>
            
            <View style={{flex: 1}}>
                <Text style={{color: 'gray', alignSelf: "flex-end"}}>12h</Text>
            </View>
        </View>
      );
    
    
    function renderNotification(item, index) {
        //figure out if loop has a notification
        const unread = true

        if (unread) {
            return <View style={{width: 15, height: 15, borderRadius: 7.5, backgroundColor: 'red', bottom: 30, position: 'absolute', alignSelf: 'flex-end', zIndex: 1}}/>
        }
    };

    const symbolSize = 50;
    const radius = 125 
    const center = 125

    function degToRad(deg) {
        return deg * Math.PI / 180
    }

    const iconStyles = [
        {left: radius * Math.cos(degToRad(90)) + center - symbolSize / 2, bottom: radius * Math.sin(degToRad(90)) + center - symbolSize / 2}, 
        {left: radius * Math.cos(degToRad(150)) + center - symbolSize / 2, bottom: radius * Math.sin(degToRad(150)) + center - symbolSize / 2},
        {left: radius * Math.cos(degToRad(50)) + center - symbolSize / 2, bottom: radius * Math.sin(degToRad(50)) + center - symbolSize / 2},
        {left: radius * Math.cos(degToRad(215)) + center - symbolSize / 2, bottom: radius * Math.sin(degToRad(215)) + center - symbolSize / 2},
        {left: radius * Math.cos(degToRad(330)) + center - symbolSize / 2, bottom: radius * Math.sin(degToRad(330)) + center - symbolSize / 2},
        {left: radius * Math.cos(degToRad(275)) + center - symbolSize / 2, bottom: radius * Math.sin(degToRad(275)) + center - symbolSize / 2}
    ]
    
    const x = movingLine.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 80],
        });

          
    const lineStyles = [{top: 50}, {right: -25, top: 25, transform: [{rotate: "-50deg"}]}, {top: 40, left: 0, transform: [{rotate: "35deg"}]}, {transform: [{rotate: "60deg"}], right: -10, bottom: 0}, {left: -15, bottom: 0, transform: [{rotate: "-60deg"}]}, {bottom: 20, transform: [{rotate: "-10deg"}]}]

    function renderLoops() {
        return exampleLoopsArray.map((item, index) => {
        
          return (
            <View key={index} style={ [iconStyles[index], {justifyContent: "center", position: "absolute"}] }>
                  <Image
                      style={{
                          width: symbolSize,
                          height: symbolSize,
                          borderRadius: symbolSize / 2,
                          zIndex: 1
                      }}
                      source={{ uri: 'https://icons.iconarchive.com/icons/graphicloads/100-flat/256/home-icon.png' }} />

                  {renderNotification()}

                  <Animated.View style={[lineStyles[index], { backgroundColor: "gray", width: 2, height: x, alignSelf: "center", position: "absolute"}]} />

              </View>
          );
        });
      }

    useEffect(() => {
        Animated.sequence([
        Animated.delay(300),
        Animated.timing(movingLine, {
            toValue: 1, // 1 represents the final angle
            duration: 1000,
            useNativeDriver: false
          })
        ]).start();
    
      }, [movingLine]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Pressable>
                    <Ionicons name="notifications-outline" size={24} color="white" />
                </Pressable>

                <Pressable onPress={() => navigation.navigate("Settings")}>
                    <Ionicons name="ios-settings-outline" size={24} color="white" />
                </Pressable>
            </View>

            <View style={styles.userInfoContainer}>
                <View style={styles.pfpContainer}>
                    <Image style={styles.pfp} source={{uri: exampleUserData.pfp}}/>
                    <Text style={styles.displayName}>{exampleUserData.displayName}</Text>
                    <Pressable onPress={copyUsernameToClipboard}>
                        {({pressed}) => (
                            <Text style={{color: pressed ? "gray": "white"}}>{exampleUserData.username}</Text>
                        )}
                    </Pressable>
                </View>

                <View style={styles.userRelationsContainer}>
                    <View style={styles.followCounts}>
                        <Pressable onPress={() => navigation.navigate("MutualUserLists", {name: exampleUserData.username})}>
                            <Text style={{color: "white", fontWeight: "bold", textAlign: "center"}}>{exampleUserData.followers}</Text>
                            <Text style={{color: "white", textAlign: "center"}}>Followers</Text>
                        </Pressable>

                        <Pressable onPress={() => navigation.navigate("MutualUserLists", {name: exampleUserData.username})}>
                            <Text style={{color: "white", fontWeight: "bold", textAlign: "center"}}>{exampleUserData.following}</Text>
                            <Text style={{color: "white", textAlign: "center"}}>Following</Text>
                        </Pressable>
                    </View>

                    <View style={styles.item_seperator}/>

                    <View style={styles.userDescription}>
                        <Text style={{color: "white", textAlign: "center"}}>{exampleUserData.description}</Text>
                    </View>
                </View>
            
            </View>
            

            <View style={styles.torusContainer}>
                <View style={styles.centerLoop}>
                    <View style={{width: 80, height: 80, borderRadius: 80, alignSelf: "center", top: 100, zIndex: 1, justifyContent: "center", alignItems: "center"}}>
                        <MaterialCommunityIcons name="google-circles-communities" color={"gray"} size={60}/>
                    </View>
                    {renderLoops()}
                </View>
            </View>

            <View style={styles.loopsContainer}>
                <View style={styles.item_seperator} />
                <FlatList
                        data={exampleLoopsArray}
                        renderItem={({item}) => <Loop data={item} />}
                        ItemSeparatorComponent={() => <View style={styles.item_seperator}/>}
                    />
            </View>        
    </SafeAreaView>
    )
}