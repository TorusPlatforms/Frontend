import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgb(22, 23, 24)",
    },

    item_seperator: {
        backgroundColor: 'gray',
        height: 1,
        width: "100%",
      },

    requestContainer: {
        marginVertical: 20, 
        width: "100%", 
        flexDirection: "row", 
        paddingHorizontal: 20, 
        alignItems: "center", 
        justifyContent: "space-between"
    },

    pfp: {
        width: 50, 
        height: 50, 
        borderRadius: 25
    },

    username: {
        color: "white", 
        fontWeight: "bold", 
        marginLeft: 10
    },
    
    deleteButton: {
        backgroundColor: "gray",
        padding: 5, 
        borderRadius: 10, 
        width: 75
    },

    //plus the delete button style
    confirmButton: {
        backgroundColor: "rgb(0, 114, 160)", 
        marginRight: 5, 
    }
})

export default styles;