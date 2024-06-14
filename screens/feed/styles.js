import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: "rgb(22, 23, 24)"
    }, 
    
    item_seperator: {
        backgroundColor: 'gray',
        height: 1,
        width: "100%",
      },
      
    text: {
        color: "white",
        minWidth: 120,
    },

    torusLogo: {
        width: 75,
        height: 50,
        overflow: "hidden",
    },

    header: {
        flexDirection: "row", 
        width: "100%", 
        padding: 10,
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },

   
    dropdownContainer: {
        borderRadius: 10,
        backgroundColor: "rgb(22, 23, 24)", 
        borderWidth: 1,
        borderColor: "white",
        width: 125,
    },


})

export default styles;