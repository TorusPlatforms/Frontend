import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: "rgb(22, 23, 24)"
    }, 
    
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
        width: "100%", 
        padding: 10,
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 20
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

    dropdownContainer: {
        borderRadius: 10,
        backgroundColor: "rgb(22, 23, 24)", 
        borderWidth: 1,
        borderColor: "white"
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
    }
})

export default styles;