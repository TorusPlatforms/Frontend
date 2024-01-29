import { View, Image, Text, Animated, Dimensions, Pressable, FlatList, SafeAreaView } from "react-native";


export const Loop = ({data, goToLoop}) => (
    <Pressable onPress={() => goToLoop()}>
       <View style={{marginVertical: 20, width: "100%", flexDirection: "row", paddingHorizontal: 20}}>
        <Image style={{width: 50, height: 50, borderRadius: 25}} source={{uri: data.pfp_url}}/>
        <View style={{flex: 3, left: 20}}>
            <Text style={{color: "white", fontWeight: "bold"}}>{data.display_name}</Text>
            <Text style={{color: "white"}}>{data.members} Members • {data.interests.slice(0, 2).join(", ")}...</Text>
        </View>
    </View> 
    </Pressable>
  );

export const User = ({data, navigation}) => (
    <Pressable onPress={() => navigation.navigate("UserProfile", {username: data.username})}>
        <View style={{marginVertical: 20, width: "100%", flexDirection: "row", paddingHorizontal: 20}}>
        <Image style={{width: 50, height: 50, borderRadius: 25}} source={{uri: data.pfp_url}}/>
        <View style={{flex: 3, left: 20}}>
            <Text style={{color: "white", fontWeight: "bold"}}>{data.display_name}</Text>
            <Text style={{color: "white"}}>{data.username}</Text>
        </View>
    </View> 
    </Pressable>
);

