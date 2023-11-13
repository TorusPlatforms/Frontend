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
        textAlign: "center"
    },

    userInfoContainer: {
        flex: 1.75, 
        justifyContent: "center", 
        flexDirection: 'row'
    }, 

    displayName: {
        color: "white",
        fontSize: 25,
        fontWeight: "bold"
    },

    pfpContainer: {
        flex: 1, 
        alignItems: "center", 
        justifyContent: 'center'
    },

    userRelationsContainer: {
        flex: 1, 
        right: 20, 
        justifyContent: 'center'
    },
    
    pfp: {
        width: 100, 
        height: 100, 
        borderRadius: 50
    },

    followCounts: {
        flexDirection: "row", 
        flex: 0.3, 
        justifyContent: "space-around"
    },

    userDescription: {
        justifyContent: "flex-end",
        ...Platform.select({
            ios: {flex: 0.5},
            android: {flex: 0.4} 
        })
    },

    item_seperator: {
        backgroundColor: 'gray',
        height: 1,
        width: "100%",
      },

    header: {
        flexDirection: "row", 
        justifyContent: "space-between", 
        flex: 0.3, 
        paddingHorizontal: 30,
        ...Platform.select({
            android: {
                marginTop: 50
            }
        })
    },

    centerLoop: {
        borderColor: "gold",
        borderWidth: 1,
        width: 250,
        height: 250,
        borderRadius: 250 / 2,
        justifyContent: "center",
        alignItems: 'center'
    },

    torusContainer: {
        flex: 3, 
        justifyContent: "center", 
        alignItems: "center"
    },

    loopsContainer: {
        flex: 2, 
        height: "100%", 
        width: "100%", 
        marginTop: 20
    }
})

export default styles;