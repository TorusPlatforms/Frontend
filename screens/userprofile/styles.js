import { StyleSheet, Platform } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgb(22, 23, 24)",
    }, 

   

    item_seperator: {
        backgroundColor: 'gray',
        height: 1,
        width: "100%",
        marginVertical: 10
      },

    followButton: {
        alignItems: "center",
        height: 40,
        borderRadius: 25, 
        justifyContent: "center",
        width: 150
    },

    followButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center', 
    }


})

export default styles;