import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgb(22, 23, 24)",
        alignItems: "center",
        justifyContent: "center"
    },

    input: {
        borderRadius: 10, 
        borderColor: "white", 
        borderWidth: 1, 
        minWidth: "80%", 
        marginVertical: 10, 
        color: "white", 
        padding: 20, 
        fontSize: 16
    },

    signUpContainer: {
        justifyContent: "center", 
        alignItems: "center", 
        marginTop: 50, 
        flex: 0.2
    },

    policy: {
        color: "white", 
        textAlign: "center", 
        marginHorizontal: 10, 
        marginBottom: 20
    }
})

export default styles;