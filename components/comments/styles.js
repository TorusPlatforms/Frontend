import { StyleSheet, Platform } from "react-native";

const styles = StyleSheet.create({
    text: {
        color: "white"
    },

    commentContainer: {
        marginVertical: 10, 
        width: "95%", 
        flexDirection: "row", 
        justifyContent: "flex-start", 
        paddingHorizontal: 10, 
        height: 60, 
        flex: 1
    },

    commentTextContainer: {
        flexDirection: "column", 
        marginLeft: 10, 
        justifyContent: "space-around", 
        flex: 1
    },

    commentContent: {
        color: "white", 
        fontSize: 12
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

    addCommentContainer: {
        alignItems: "center", 
        marginTop: 20, 
        flexDirection: "row", 
        paddingHorizontal: 10, 
        paddingRight: 30
    },

    addCommentInput: {
        marginLeft: 20, 
        paddingHorizontal: 10, 
        color: "white", 
        borderRadius: 10, 
        borderWidth: 1, 
        borderColor: "gray", 
        width: "75%"
    },

    addCommentButton: {
        alignItems: 'center', 
        backgroundColor: "rgb(0, 114, 160)", 
        borderRadius: 30, 
        width: 50, 
        height: 30, 
        justifyContent: "center" 
    },

    tinyLogo: {
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: "hidden",
      },


})

export default styles;