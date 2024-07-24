import { StyleSheet, Platform } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgb(22, 23, 24)",
    },

    pfp: { 
        width: 50, 
        height: 50, 
        marginLeft: 20, 
        borderRadius: 25 
    },
        
    fullscreenImage: {
        flex: 1,
        resizeMode: "contain"
    },

    footerContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        position: 'absolute', 
        bottom: 10, 
        width: "100%", 
        alignItems: 'center', 
        paddingHorizontal: 10
    },
    
    deleteButton: {
        width: 25, 
        height: 25, 
        borderRadius: 12.5, 
        backgroundColor: "rgb(62, 62, 62)", 
        justifyContent: 'center', 
        alignItems: 'center'
    },

    timePill: {
        borderRadius: 20, 
        paddingVertical: 5, 
        paddingHorizontal: 10,
        height: 30, 
        justifyContent: "center", 
        alignItems: "center",
        flexDirection: 'row'
    },

    timePillText: {
        color: "white", 
        marginLeft: 5,
        fontWeight: "bold"
    }
})

export default styles;