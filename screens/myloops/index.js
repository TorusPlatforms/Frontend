import React, { useState, useRef, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

import { LoopsComponent } from "../../components/loops";


export default function MyLoops({ route, navigation }) {
    const [loops, setLoops] = useState([])


    async function getLoops() {
        //handle getting discover/main feed

        const exampleLoopData = {
            pfp: "https://cdn.discordapp.com/attachments/803748247402184714/822541056436207657/kobe_b.PNG?ex=658f138d&is=657c9e8d&hm=37b45449720e87fa714d5a991c90f7fac4abb55f6de14f63253cdbf2da0dd7a4&",
            displayName: "Grant's Not Epic Group",
            members: 120,
            interests: ["Golfing", "Frolicking", "Hijinks"]
        }        

        setLoops(Array(20).fill(exampleLoopData))
    }

    useEffect(() => {
        getLoops()
      }, []);

    console.log(loops)
    
    return (
        <LoopsComponent paddingTop={0} loops={loops} searchBarPlaceholder={"Search Your Loops"} />
    )
  
}