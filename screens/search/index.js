import React, {useEffect, useState} from 'react';
import { View, Image, Text, Animated, Dimensions, Pressable, FlatList, SafeAreaView } from "react-native";
import { SearchBar } from "react-native-elements";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";

import { searchUsers } from '../../components/handlers';
import { Loop, User } from '../../components/loops';
import styles from "./styles"


export default function Search() {
    const navigation = useNavigation()

    const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
    const [scrollY] = useState(new Animated.Value(0));

    const [search, setSearch] = useState(null)

    const [loops, setLoops] = useState([])
    const [users, setUsers] = useState([])
    const [items, setItems] = useState([])

    function getLoops() {
        const exampleLoopData = {
            pfp_url: "https://cdn.discordapp.com/attachments/803748247402184714/822541056436207657/kobe_b.PNG?ex=658f138d&is=657c9e8d&hm=37b45449720e87fa714d5a991c90f7fac4abb55f6de14f63253cdbf2da0dd7a4&",
            display_name: "Grant's Epic Group",
            members: 120,
            interests: ["Golfing", "Frolicking", "Hijinks"]
        }        

        return new Array(20).fill(exampleLoopData)
    }

    async function fetchUsers() {
        if (search) {
            console.log('searching', search)
            const users = await searchUsers(search)
            return users  
        } else {
            return []
        }
    }


    async function fetchSearches() {
        const loops = getLoops()
        setLoops(loops)

        const users = await fetchUsers()
        console.log("users", users)

        const concated = users.concat(loops)
        setItems(concated)
    }

    useEffect(() => {
        console.log("search changed")
       fetchSearches()
      }, [search]);


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

    function renderItem(item) {
        if (item.item.username) {
            return <User data={item.item} navigation={navigation} />
        } else {
            return <Loop data={item.item} goToLoop={goToLoop} />
        }
    }
     
    if (items) {
        return (
            <SafeAreaView style={[styles.container, {paddingTop: 50}]}>
            <Animated.View style={{height: headerHeight, opacity: headerOpacity}}>
                <View style={{padding: 10, flexDirection: 'row', flex: 1, justifyContent: "space-between", alignItems: "center"}}>
                    <View style={{flex: 1}}>
                        <SearchBar 
                            placeholder={"Discover Loops & People"} 
                            containerStyle={{backgroundColor: "rgb(22, 23, 24)", borderTopWidth: 0, borderBottomWidth: 0, color: "rgb(22, 23, 24)"}} 
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
                data={items}
                renderItem={renderItem}
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
    
  
}