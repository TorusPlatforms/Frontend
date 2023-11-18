import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    item_seperator: {
        backgroundColor: 'gray',
        height: 1,
        width: "100%",
      },
      
    text: {
        color: "white",
    },

    author: {
        color: "white",
        fontWeight: "bold",
    },

    verticalLine: {
        width: 1,
        backgroundColor: "gray",
        marginTop: 8,
        marginLeft: 18
    },

    tinyLogo: {
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: "hidden",
      },
    
    torusLogo: {
        width: 75,
        height: 50,
        overflow: "hidden",
    },

    pingIcon: {
        color: "white",
        marginRight: 10,
    },

    stats: {
        marginLeft: -20,
        color: "gray",
    },

    attatchment: {
        aspectRatio: 1.5,
        minWidth: 200,
        maxWidth: 500,
        marginVertical: 10,
        borderRadius: 20
    },

    header: {
        flexDirection: "row", 
        justifyContent: "space-evenly", 
        width: "100%", 
        padding: 10
    }
})

export default styles;