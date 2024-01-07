import { StyleSheet, Platform } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgb(22, 23, 24)",
        ...Platform.select({
            android: {
                paddingTop: 50
            },
            ios: {
                paddingTop: 30
            }
        })
    },
    pfp: { 
        width: 50, 
        height: 50, 
        marginLeft: 20, 
        borderRadius: 25 
    }
})

export default styles;