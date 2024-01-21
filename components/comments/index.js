import { Text, View, SafeAreaView, Image, Animated, FlatList, Pressable, Alert, Share, Modal, KeyboardAvoidingView, TextInput } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import styles from "./styles";


const Comment = ({data, handleReply, handleCommentLike}) => (
    <View style={styles.commentContainer}>
      <View style={{flex: 0.3}}>
        <Image
            style={styles.tinyLogo}
            source={{uri: data.pfp}}
          />
      </View>
  
      <View style={styles.commentTextContainer}>
        <View style={{flexDirection: "row"}}>
          <Text style={styles.commentContent}>{data.author}</Text>
          <Text style={styles.commentTime}>3h</Text>
        </View>
  
        <View>
          <Text style={styles.text}>{data.content}</Text>
        </View>
  
        <View>
          <Pressable onPress={() => handleReply(data)}>
            <Text style={styles.reply}>Reply</Text>
          </Pressable>
        </View>
      </View>
  
      <View style={styles.likeContainer}>
          <Pressable onPress={() => handleCommentLike(data)}>
            <Ionicons style={[styles.pingIcon, {color: data.isLiked ? "red" : "white"}]} name={data.isLiked ? "heart" : "heart-outline"} size={20}></Ionicons>
          </Pressable>
      </View>
    </View>
  )
  
  
  export const CommentModal = ({ modalVisible, setModalVisible, commentData, onChangeComment, comment, postComment, ref_input, handleCommentLike, handleReply }) => (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
  
        <View style={styles.modalContainer}>
          <Pressable onPress={() => setModalVisible(false)} style={styles.modalHeader}>
            <View style={styles.modalDismissBar} />
  
            <View style={{marginVertical: 10}}>
              <Text style={{color: "white"}}>Comments</Text>
            </View>
  
            <View style={styles.item_seperator} />
  
          </Pressable>
        
          <View style={{flex: 1}}>
            <FlatList
              data={commentData}
              renderItem={({item}) => <Comment data={item} handleReply={handleReply} handleCommentLike={handleCommentLike} />}
            />
          </View>
  
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={80}  style={{flex: 0.1, marginBottom: 30}}>
            <View style={styles.item_seperator} />
  
            <View style={styles.addCommentContainer}>
              <View style={{flexDirection: "row", flex: 2}}>
                <Image
                  style={styles.tinyLogo}
                  source={{uri: "https://cdn.discordapp.com/attachments/803748247402184714/822541056436207657/kobe_b.PNG?ex=658f138d&is=657c9e8d&hm=37b45449720e87fa714d5a991c90f7fac4abb55f6de14f63253cdbf2da0dd7a4  &"}}
                />
  
                <TextInput 
                  placeholderTextColor="white" 
                  style={styles.addCommentInput} 
                  onChangeText={onChangeComment} 
                  value={comment} 
                  placeholder='Add a comment'
                  ref={ref_input}  
                />
              </View>
            
              <View style={styles.addCommentButton}>
                <Pressable onPress={postComment}>
                  <Ionicons style={styles.text} name="arrow-up" size={20}></Ionicons>
                </Pressable>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
  )
  