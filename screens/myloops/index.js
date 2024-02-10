import React, {useEffect, useState} from 'react';
import { View, Image, Text, Animated, Dimensions, Pressable, FlatList, SafeAreaView } from "react-native";
import { SearchBar } from "react-native-elements";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";

import { Loop } from "../../components/loops";
import styles from "./styles"


export default function MyLoops() {
    const navigation = useNavigation()

    const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
    const [scrollY] = useState(new Animated.Value(0));

    const [loops, setLoops] = useState([])

    const [search, setSearch] = useState("")


    async function getLoops() {
        const exampleLoopData = {
            pfp: "https://cdn.discordapp.com/attachments/803748247402184714/822541056436207657/kobe_b.PNG?ex=658f138d&is=657c9e8d&hm=37b45449720e87fa714d5a991c90f7fac4abb55f6de14f63253cdbf2da0dd7a4&",
            displayName: "Grant's Not Epic Group",
            members: 120,
            interests: ["Golfing", "Frolicking", "Hijinks"]
        }        

        return (new Array(20).fill(exampleLoopData))
    }

    useEffect(() => {
        setLoops(getLoops())
      }, []);


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
        <SafeAreaView style={styles.container}>
        <Animated.View style={{height: headerHeight, opacity: headerOpacity}}>
            <View style={{padding: 10, flexDirection: 'row', flex: 1, justifyContent: "space-between", alignItems: "center"}}>
                <View style={{flex: 1}}>
                    <SearchBar 
                        placeholder={"Search Your Loops"} 
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
            renderItem={({item}) => <Loop data={item} goToLoop={goToLoop}/>}
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