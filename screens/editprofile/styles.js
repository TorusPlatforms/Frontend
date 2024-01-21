import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgb(22, 23, 24)",
    },

    pfp: {
        width: 80, 
        height: 80, 
        borderRadius: 40
    },

    updateField: {
        borderColor: "white", 
        borderBottomWidth: 1, 
        padding: 15, 
        flexDirection: "row", 
    }
})

export default styles;