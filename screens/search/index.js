import React, { useState, useRef, useEffect } from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { getLoops,getUser } from "../../components/handlers";
import { LoopsComponent } from "../../components/loops";





export default function Search({ route, navigation }) {
    const [loops, setLoops] = useState([]);

  async function fetchLoops() {
    const user = await getUser();
    const fetchedLoops = await getLoops(user);
    setLoops(fetchedLoops);
    console.log("Loops updated:", fetchedLoops);
  }

  useEffect(() => {
    fetchLoops();
  }, []);

    return (
        <LoopsComponent paddingTop={50} loops={loops} searchBarPlaceholder={"Discover Loops & People"}/>
    )
  
}



/*const exampleLoopData = {
            pfp: "https://cdn.discordapp.com/attachments/803748247402184714/822541056436207657/kobe_b.PNG?ex=658f138d&is=657c9e8d&hm=37b45449720e87fa714d5a991c90f7fac4abb55f6de14f63253cdbf2da0dd7a4&",
            displayName: "Grant's Epic Group",
            members: 120,
            interests: ["Golfing", "Frolicking", "Hijinks"]
        }   */     

        //setLoops(Array(20).fill(exampleLoopData))