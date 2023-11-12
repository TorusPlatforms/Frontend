import React, { useState, useEffect, useRef} from 'react'
import { StyleSheet, Text, View, SafeAreaView, Image, Animated, Easing, FlatList, Pressable } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Clipboard from 'expo-clipboard';
import { useNavigation } from "@react-navigation/native";

import styles from "./styles";

const exampleUserData = {
    pfp: "https://cdn.discordapp.com/avatars/393834794057728000/661f702722649b4aeb5a660c295d1ee3.webp?size=128",
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

    const symbolSize = 50;
    const radius = 125 
    const center = 125

    const circleAngleOrder = [0, 180, 270, 90, 45, 135, 225, 315]
    const movingAngleUnit = useRef(new Animated.Value(0)).current;

    async function copyUsernameToClipboard() {
        await Clipboard.setStringAsync(exampleUserData.username);
      };

    const Loop = ({data}) => (
        <View style={{marginVertical: 10, width: "100%", flexDirection: "row", paddingHorizontal: 20}}>
            <Image style={{width: 50, height: 50, borderRadius: 25, flex: 1}} source={{uri: data.pfp}}/>

            <View style={{flexDirection: 'col', marginLeft: 10, flex: 5}}>
                <Text style={{color: 'white', fontWeight: "bold"}}>Example Loop</Text>
                <Text style={{color: 'white'}}>GrantHough said "my last message"</Text>
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
            return <View style={{width: 15, height: 15, borderRadius: 7.5, backgroundColor: 'red', position: 'absolute', alignSelf: 'flex-end', justifyContent: "center", alignItems: "center"}}/>
        }
    };


    function renderLoops() {
        return exampleLoopsArray.map((item, index) => {
          const angle = circleAngleOrder[index] * (Math.PI / 180);

          const x = movingAngleUnit.interpolate({
            inputRange: [0, 1],
            easing: Easing.sin,
            outputRange: [radius * 1 + center - symbolSize / 2, radius * Math.cos(angle) + center - symbolSize / 2],
          });
      
          const y = movingAngleUnit.interpolate({
            inputRange: [0, 1],
            outputRange: [center - symbolSize / 2, radius * Math.sin(angle) + center - symbolSize / 2],
          });
      
          return (
            <Animated.View
              key={index}
              style={{
                position: "absolute",
                left: x,
                top: y
              }}
            >
                <Image
                    style={{
                    width: symbolSize,
                    height: symbolSize,
                    borderRadius: symbolSize / 2,
                    }}
                    source={{ uri: 'https://icons.iconarchive.com/icons/graphicloads/100-flat/256/home-icon.png' }}
                />

                {renderNotification()}
                
            </Animated.View>
          );
        });
      }

    useEffect(() => {
        Animated.sequence([
        Animated.delay(300),
        Animated.timing(movingAngleUnit, {
            toValue: 1, // 1 represents the final angle
            duration: 1000,
            useNativeDriver: false, 
          })
        ]).start();
    
      }, [movingAngleUnit]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="notifications-outline" size={24} color="white" />
                <Ionicons name="ios-settings-outline" size={24} color="white" />
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
                        <Pressable onPress={() => navigation.navigate("MutualUserLists", {name: exampleUserData.username, users: new Array(10).fill(exampleUserData)})}>
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