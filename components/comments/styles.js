import { StyleSheet, Platform } from "react-native";

const styles = StyleSheet.create({
    text: {
        color: "white"
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
        paddingRight: 30,
    },

    addCommentInput: {
        marginLeft: 20, 
        paddingHorizontal: 10, 
        color: "white", 
        borderRadius: 10, 
        borderWidth: 1, 
        borderColor: "gray", 
        width: "90%",
        padding: 10,
        height: 50
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

    leftAction: {
        flex: 1,
        backgroundColor: '#497AFC',
        justifyContent: 'center',
    },
    actionText: {
        color: 'white',
        fontSize: 16,
        backgroundColor: 'transparent',
        padding: 10,
    },
    rectButton: {
        flex: 1,
        height: 80,
        paddingVertical: 10,
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        flexDirection: 'column',
        backgroundColor: 'white',
      },
      separator: {
        backgroundColor: 'rgb(200, 199, 204)',
        height: StyleSheet.hairlineWidth,
      },
      fromText: {
        fontWeight: 'bold',
        backgroundColor: 'transparent',
      },
      messageText: {
        color: '#999',
        backgroundColor: 'transparent',
      },
      dateText: {
        backgroundColor: 'transparent',
        position: 'absolute',
        right: 20,
        top: 10,
        color: '#999',
        fontWeight: 'bold',
      },
})

export default styles;