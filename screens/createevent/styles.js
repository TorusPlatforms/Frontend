import { StyleSheet, Platform } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgb(22, 23, 24)",
    },

    pfp: { 
        width: 50, 
        height: 50, 
        borderRadius: 25 
    },

    item_seperator: {
        width: "100%",
        backgroundColor: "gray",
        height: 2,
    },

    fullscreenImage: {
        flex: 1,
        resizeMode: "contain"
    },
})

export default styles;