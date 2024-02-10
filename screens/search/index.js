
import React, { useState, useEffect } from "react";
import { View, RefreshControl } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { getLoops, getUser } from "../../components/handlers";
import { LoopsComponent } from "../../components/loops";

export default function Search({ route, navigation }) {
  const [loops, setLoops] = useState([]);

  const fetchLoops = async () => {
    try {
      const user = await getUser();
      const fetchedLoopsString = await getLoops(user);
      const fetchedLoops = JSON.parse(fetchedLoopsString);
      console.log("Fetched Loops:", fetchedLoops);
      setLoops(fetchedLoops);
    } catch (error) {
      console.error("Error fetching loops:", error);
    }
  };

  useEffect(() => {
    fetchLoops();
  }, []);


  const onRefresh = async () => {
    await fetchLoops();
  };

  useFocusEffect(
    React.useCallback(() => {
      console.log("search focused");
      fetchLoops(); 
    }, [])
  );

  return (
    <LoopsComponent
      paddingTop={50}
      loops={loops}
      searchBarPlaceholder={"Discover Loops & People"}
      onRefresh={onRefresh}
    />
  );
}



/*const exampleLoopData = {
            pfp: "https://cdn.discordapp.com/attachments/803748247402184714/822541056436207657/kobe_b.PNG?ex=658f138d&is=657c9e8d&hm=37b45449720e87fa714d5a991c90f7fac4abb55f6de14f63253cdbf2da0dd7a4&",
            displayName: "Grant's Epic Group",
            members: 120,
            interests: ["Golfing", "Frolicking", "Hijinks"]
        }   */     

