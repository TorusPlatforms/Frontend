import React, { useState, useRef, useEffect } from "react";
import { View, Image, Text, Animated, Dimensions, Pressable, TextInput, KeyboardAvoidingView, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SearchBar } from "react-native-elements";
import Ionicons from '@expo/vector-icons/Ionicons';
import Icon from '@expo/vector-icons/Ionicons';

import styles from "./styles";

export default function Loops({ route, navigation }) {
    const [loops, setLoops] = useState([])
    const [search, setSearch] = useState("")

    function getLoops() {
        //handle getting discover/main feed

        const exampleLoopData = {
            pfp: "https://cdn.discordapp.com/attachments/803748247402184714/822541056436207657/kobe_b.PNG?ex=658f138d&is=657c9e8d&hm=37b45449720e87fa714d5a991c90f7fac4abb55f6de14f63253cdbf2da0dd7a4&",
            displayName: "Grant's Epic Group",
            members: 120,
            interests: ["Golfing", "Frolicking", "Hijinks"]
        }        

        return new Array(20).fill(exampleLoopData)
    }

    
    const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
    const [scrollY] = useState(new Animated.Value(0));

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


    const Loop = ({data}) => (
        <TouchableOpacity onPress={goToLoop}>
           <View style={{marginVertical: 20, width: "100%", flexDirection: "row", paddingHorizontal: 20}}>
            <Image style={{width: 100, height: 100, borderRadius: 50}} source={{uri: data.pfp}}/>
            <View style={{flex: 3, left: 20}}>
                <Text style={{color: "white", fontWeight: "bold"}}>{data.displayName}</Text>
                <Text style={{color: "white"}}>{data.members} Members</Text>
                <Text style={{color: "white"}}>{data.interests.join(", ")}</Text>
            </View>
        </View> 
        </TouchableOpacity>
        
      );
        

    useEffect(() => {
        setLoops(getLoops())
      }, []);


      const createLoop = () => {
        navigation.navigate('CreateLoop'); 
      };

      const goToLoop = () => {
        navigation.navigate('Loop'); 
      };


    return (
            <SafeAreaView style={styles.container}>
                <Animated.View style={{height: headerHeight, opacity: headerOpacity}}>
                    <View style={{padding: 10, flexDirection: 'row', flex: 1, justifyContent: "space-between", alignItems: "center"}}>
                        <View style={{flex: 1}}>
                            <SearchBar 
                                placeholder="Discover Loops & People..." 
                                containerStyle={{backgroundColor: "rgb(22, 23, 24)", borderTopWidth: 0,  borderBottomWidth: 0, color: "rgb(22, 23, 24)"}} 
                                onChangeText={setSearch}
                                value={search}
                            />
                        </View>
                       

                        <View style={{flex: 0.1}}>
                            <Pressable onPress={() => navigation.navigate("CreateLoop")}>
                                <Ionicons name="add" size={24} color="white" />
                            </Pressable>
                        </View>
                    </View>

                    {/* <TouchableOpacity style={{justifyContent:"center"}} onPress={createLoop}>
                      <Icon name="add-circle-outline" size={30} color="#ffffff" style={{  }} />
                    </TouchableOpacity> */}
                   
                </Animated.View>


                <AnimatedFlatList
                    style={{paddingHorizontal: 20}}
                    data={loops}
                    renderItem={({item}) => <Loop data={item} />}
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