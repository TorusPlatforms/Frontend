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

    addCommentInput: {
        marginLeft: 20, 
        color: "white", 
        borderRadius: 10, 
        borderWidth: 1, 
        borderColor: "gray", 
        width: "70%",
        padding: 10,
        minHeight: 30,
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
    rightAction: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
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