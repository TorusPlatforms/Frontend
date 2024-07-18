import { StyleSheet, Dimensions } from "react-native";

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 0,
      width: screenWidth,
      alignItems: 'center',
    },
    pillButton: {
      position: 'absolute',
      height: 60,
      width: 60,
      borderRadius: 30,
      padding: 10,
      backgroundColor: 'rgb(40, 40, 40)',
      justifyContent: 'center',
      alignItems: 'center',
      left: (screenWidth / 2) - 30,
      bottom: 100
    },
    pillText: {
      color: 'white',
      fontSize: 16,
    },
  });

export default styles;