import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';


export async function requestPhotoLibraryPerms() {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    console.error('Permission to access camera roll was denied');
  }
}

// request camera permission
export async function requestCameraPerms() {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    console.error('Permission to access camera was denied');
  }
}

export async function pickImage(handleImage) {
  try {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log("Selected Image in ImagePicker:", result);
      handleImage(result);
    }
  } catch (error) {
    console.error("Error picking an image", error);
  }

};

export async function openCamera(handleImage) {
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        console.log('Selected Image from Camera:', result);
        console.log(result.assets[0].uri)
        const compressedImage = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } // Adjust the compression level as needed
        );
        console.log("made it!", compressedImage)
        handleImage(compressedImage);
      }
    } catch (error) {
      console.error('Error opening the camera', error);
    }
};

