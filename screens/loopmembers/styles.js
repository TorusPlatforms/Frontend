import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgb(22, 23, 24)",
    },

    item_seperator: {
        backgroundColor: 'gray',
        height: 1,
        width: "100%",
      },

    userContainer: {
        marginVertical: 10, 
        width: "100%", 
        flexDirection: "row", 
        paddingHorizontal: 20, 
    },

    pfp: {
        width: 50, 
        height: 50, 
        borderRadius: 25
    },
    
    text: {
        color: "white"
    },

    button: {
        borderRadius: 20, 
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center", 
        padding: 5
    },

    followRequests: {
        flexDirection: "row", 
        paddingHorizontal: 20, 
        marginVertical: 10, 
        alignItems: 'center'
    },

    followRequestText: {
        marginLeft: 20, 
        maxWidth: "80%", 
        flex: 2
    }

})

export default styles;