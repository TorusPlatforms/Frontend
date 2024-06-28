import { StyleSheet, Platform } from "react-native";

const styles = StyleSheet.create({
    text: {
        color: "white"
    },

    container: {
        flex: 1,
        backgroundColor: "rgb(22, 23, 24)",
    },

    commentContainer: {
        marginVertical: 10, 
        width: "95%", 
        flexDirection: "row", 
        paddingHorizontal: 10, 
        minHeight: 60, 
        flex: 1,
        alignItems: "flex-start"
    },

    commentTextContainer: {
        flexDirection: "column", 
        marginLeft: 10,  
        flex: 1,
    },

    commentTime: {
        marginLeft: 7, 
        color: "gray", 
        fontSize: 12
    },

    reply: {
        fontWeight: "bold", 
        color: "gray"
    },

    likeContainer: {
        flex: 1, 
        alignItems: "flex-end", 
        justifyContent: "center"
    },

    modalContainer: {
        flex: 1, 
        backgroundColor: "rgb(22, 23, 24)", 
        ...Platform.select({
            android: {
                marginTop: 100
            },
            ios: {
                marginTop: 30
            }
        })
    },

    modalHeader: {
        alignItems: "center", 
        flex: 0.2, 
        justifyContent: 'space-evenly'
    },

    modalDismissBar: {
        backgroundColor: "gray", 
        height: 3, 
        width: "10%", 
        borderRadius: 10, 
        marginTop: 20
    },

    tinyLogo: {
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: "hidden",
      },

})

export default styles;