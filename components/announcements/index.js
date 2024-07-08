import React from 'react';
import { View, Image, Text, TouchableOpacity, Alert } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

import { deleteAnnouncement } from '../handlers';
import { findTimeAgo } from '../utils';
import styles from "./styles"
import { resendAnnouncement } from '../handlers/notifications';


export const Announcement = ({ data, isOwner }) => {
  const navigation = useNavigation()
  
  function handleAuthorPress() {
      navigation.navigate("UserProfile", {username: data.author});
  }

  async function handleResendPress() {
    Alert.alert("Are you sure you want to resend this announcement?", "This will re-notify everyone in the loop.", [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK', 
        onPress: async () => await resendAnnouncement({announcement_id: data.announcement_id, loop_id: data.loop_id})
      },
    ]);
  }
  async function handleDeletePress() {
    Alert.alert("Are you sure you want to delete this announcement?", "This is a permanent action that cannot be undone.", [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK', 
        onPress: async() => await deleteAnnouncement({ loop_id: data.loop_id, announcement_id: data.announcement_id })
      },
    ]);
  }

  return (
    <View style={{marginVertical: 10, width: "95%", flexDirection: "row", padding: 10}}>
        <View style={{flexDirection: "col", flex: 1}}>
          <Image
            style={styles.tinyLogo}
            source={{uri: data.pfp_url}}
          />
        </View>
    
        <View style={{marginLeft: 20, flex: 6}}>
          <View style={{flex: 1}}>
            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                <TouchableOpacity onPress={handleAuthorPress}>
                    <Text style={styles.author}>{data.author}</Text>
                </TouchableOpacity>

                <Text style={{color: "gray"}}>{findTimeAgo(data.created_at)}</Text>

            </View>

            <View style={{flexDirection: "row", justifyContent: 'space-between' }}>
                <Text style={styles.text}>{data.content}</Text>

                {isOwner && (
                    <View style={{flexDirection: "row"}}>
                      <TouchableOpacity onPress={handleResendPress}>
                        <MaterialCommunityIcons style={[styles.pingIcon, {marginRight: 10}]} name="bell-ring" size={18} color="white" />                  
                      </TouchableOpacity>

                      <TouchableOpacity onPress={handleDeletePress}>
                        <Feather style={styles.pingIcon} name="trash" size={18} />
                      </TouchableOpacity>
                    </View>
                )}
                
            </View>
            
          </View>
        
          <View style={{flex: 2}}>
            { data.image_url && (
              <Image
                style={styles.attatchment}
                source={{uri: data.image_url}}
                resizeMode='cover'
              />
            )}
          </View>


        </View>
    </View>
  );
};