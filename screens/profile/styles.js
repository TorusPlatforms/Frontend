import { StyleSheet, Platform } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgb(22, 23, 24)",
    },

    torusLogo: {
        width: 150,
        height: 150
    },

    text: {
        color: "white",
    },

    author: {
        color: "white",
        fontWeight: "bold",
    },

  
    displayName: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
    },


    userInfoContainer: {
        flex: 1.5, 
        flexDirection: 'row',
    }, 

    pfpContainer: {
        flex: 1, 
        alignItems: "center", 
        justifyContent: "space-evenly",
        paddingBottom: 30
    },

    userRelationsContainer: {
        flex: 1, 
        right: 20,
        justifyContent: 'space-evenly',
    },
    
    pfp: {
        width: 80, 
        height: 80, 
        borderRadius: 40
    },

    loopPfp: {
        width: 50, 
        height: 50, 
        borderRadius: 25
    },

    followCounts: {
        flexDirection: "row", 
        flex: 0.2, 
        justifyContent: "space-around"
    },

    userDescription: {
        flex: 0.4,
        paddingTop: 10
    },

    item_seperator: {
        backgroundColor: 'gray',
        height: 1,
        width: "100%",
      },

    header: {
        flexDirection: "row", 
        justifyContent: "space-between", 
        flex: 0.25, 
        paddingHorizontal: 30,
        ...Platform.select({
            ios: {
                marginVertical: 10
            },
            android: {
                marginTop: 60
            }
        })
    },

    centerLoop: {
        width: 250,
        height: 250,
        borderRadius: 250 /2,
    },

    centerLoopIcon: {
        width: 80, 
        height: 80, 
        borderRadius: 40, 
        alignSelf: "center", 
        top: 85, 
        zIndex: 1, 
        justifyContent: "center", 
        alignItems: "center"
    },

    torusContainer: {
        flex: 2, 
        justifyContent: "center", 
        alignItems: "center",
    },

    loopContainer: {
        marginVertical: 10, 
        width: "100%", 
        flexDirection: "row", 
        paddingHorizontal: 20
    },

    loopsListContainer: {
        flex: 2, 
        height: "100%", 
        width: "100%", 
        marginTop: 50
    },

    loopText: {
        flexDirection: 'col', 
        marginLeft: 10, 
        flex: 5
    },

    attatchment: {
        aspectRatio: 1,
        maxWidth: 100,
        maxHeight: 100,
        marginVertical: 10,
        borderRadius: 20
    },

    tinyLogo: {
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: "hidden",
      },
    
    verticalLine: {
        width: 1,
        backgroundColor: "gray",
        marginTop: 8,
        marginLeft: 18
    },
    
    stats: {
        color: "gray",
    },

    pingIcon: {
        color: "white",
        marginRight: 10,
    },



})

export default styles;