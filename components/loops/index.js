import React, {useEffect, useState} from 'react';
import { View, Image, Text, Animated, Dimensions, Pressable, FlatList, SafeAreaView } from "react-native";
import { SearchBar } from "react-native-elements";
import Ionicons from '@expo/vector-icons/Ionicons';

import styles from "./styles"


const Loop = ({data, goToLoop}) => (
    <Pressable onPress={() => goToLoop()}>
       <View style={{marginVertical: 20, width: "100%", flexDirection: "row", paddingHorizontal: 20}}>
        <Image style={{width: 100, height: 100, borderRadius: 50}} source={{uri: data.pfp}}/>
        <View style={{flex: 3, left: 20}}>
            <Text style={{color: "white", fontWeight: "bold"}}>{data.displayName}</Text>
            <Text style={{color: "white"}}>{data.members} Members</Text>
            <Text style={{color: "white"}}>{data.interests.join(", ")}</Text>
        </View>
    </View> 
    </Pressable>
  );

export const LoopsComponent = ({navigation, loops, searchBarPlaceholder, paddingTop}) => {
    console.log("HERE", loops)
    const [search, setSearch] = useState("")

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

    const createLoop = () => {
        navigation.navigate('CreateLoop'); 
      };

    const goToLoop = () => {
    navigation.navigate('Loop'); 
    };

    return (
        <SafeAreaView style={[styles.container, {paddingTop: paddingTop}]}>
        <Animated.View style={{height: headerHeight, opacity: headerOpacity}}>
            <View style={{padding: 10, flexDirection: 'row', flex: 1, justifyContent: "space-between", alignItems: "center"}}>
                <View style={{flex: 1}}>
                    <SearchBar 
                        placeholder={searchBarPlaceholder} 
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