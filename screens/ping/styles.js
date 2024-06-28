import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgb(22, 23, 24)",
    },

    pingIcon: {
        color: "white",
        marginRight: 10,
    },

    stats: {
        color: "gray",
    },

    attatchment: {
        width: 250,
        height: 300,
        borderRadius: 20,
        marginBottom: 20
    },

    tinyLogo: {
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: "hidden",
      },

    text: {
        color: "white",
        marginVertical: 5,
        fontSize: 16
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
})

export default styles;