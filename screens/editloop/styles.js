import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgb(22, 23, 24)",
    },

    pfp: {
        width: 100, 
        height: 100, 
        borderRadius: 50
    },

    updateField: {
        borderColor: "white", 
        borderBottomWidth: 1, 
        padding: 15, 
        flexDirection: "row", 
    },

    updateToggle: { 
        marginHorizontal: 15, 
        borderColor: "white", 
        borderWidth: 1, 
        padding: 15, 
        flexDirection: "row", 
        justifyContent: "space-between", 
        alignItems: "center",
        borderRadius: 20, 
        marginTop: 20
    }
})

export default styles;