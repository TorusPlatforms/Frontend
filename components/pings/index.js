import { Text, View, SafeAreaView, Image, Animated, FlatList, Pressable, Alert, Share } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import styles from "./styles";


export const Ping = ({data, setModalVisible, handleLike, handleShare }) => (
    <View style={{marginVertical: 10, width: "95%", flexDirection: "row", padding: 10}}>
      <View style={{flexDirection: "col"}}>
        <Image
          style={styles.tinyLogo}
          source={{uri: data.pfp_url}}
        />
  
        <View style={styles.verticalLine} />
      </View>
  
      <View style={{marginLeft: 10}}>
        <Text style={styles.author}>{data.author}</Text>
        <Text style={styles.text}>{data.content}</Text>
  
        <Image
          style={[styles.attatchment, {display: data.image_url ? "flex" : "none"}]}
          source={{uri: data.image_url}}
          resizeMode='contain'
        />
  
        <View style={{flexDirection: "row", marginVertical: 5}}>
          <Pressable onPress={() => handleLike(data)}>
            <Ionicons style={[styles.pingIcon, {color: data.isLiked ? "red" : "white"}]} name={data.isLiked ? "heart" : "heart-outline"} size={20}></Ionicons>
          </Pressable>
  
          <Pressable onPress={() => setModalVisible(true)}>
            <Ionicons style={styles.pingIcon} name="chatbubble-outline" size={20}></Ionicons>
          </Pressable>
  
          <Pressable onPress={() => handleShare(data.postURL)}>
            <Ionicons style={styles.pingIcon} name="share-social-outline" size={20}></Ionicons>
          </Pressable>
  
          <Pressable>
            <Ionicons style={styles.pingIcon} name="paper-plane-outline" size={20}></Ionicons>
          </Pressable>
        </View>
  
        <Text style={styles.stats}>{data.numberof_likes} Likes • {data.numberof_comments} Comments</Text>
      </View>
    </View>
  );
  
  
  