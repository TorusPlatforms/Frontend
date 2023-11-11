import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgb(22, 23, 24)",
        alignItems: "center",
        justifyContent: "center"
    },

    animation: {
        flex: 0.2,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 75
    },

    loginContainer: {
        flex: 1, 
        alignItems: "center", 
        justifyContent: "center",
    },

    text: {
        color: "white", 
        fontSize: 24, 
        margin: 20
    },

    submissionBox: {
        borderRadius: 10, 
        borderColor: "white", 
        borderWidth: 1, 
        marginBottom: 15, 
        color: "white", 
        padding: 10, 
        fontSize: 16
    },

    verification: {
        padding: 20, 
        alignItems: "center",
        justifyContent: "center"
    },

    signUpButton: {
        paddingVertical: 10, 
        alignItems: "center", 
        justifyContent: "center", 
        flexDirection: "row"
    },

    verificationContainer: {
        flex: 0.5, 
        justifyContent: "flex-end", 
        alignItems: "center",
        marginBottom: 50
    }
})

export default styles;