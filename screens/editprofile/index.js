import React, { useState } from 'react';
import { View, Text, TextInput} from 'react-native';

import { ImagePickerComponent } from '../../components/imagepicker';
import styles from './styles'

export default function EditProfile() {
    const [displayName, setDisplayName] = useState(null)
    const [bio, setBio] = useState(null)

    const handleImageSelect = (image) => {
        setSelectedImage(image);
        console.log("Selected Image in CreatePing:", image);
      };

      
    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Enter Display Name"
                value={displayName}
                onChangeText={(text) => setDisplayName(text)}
                style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
            />

            <TextInput
                placeholder="Enter Bio"
                value={bio}
                onChangeText={(text) => setBio(text)}
                multiline
                numberOfLines={4}
                style={{ borderBottomWidth: 1, marginBottom: 10, padding: 8 }}
            />    

            <ImagePickerComponent setSelectedImage={handleImageSelect} /> 
            
        </View>
    )
}

