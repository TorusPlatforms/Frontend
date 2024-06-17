import { getAuth } from "firebase/auth";
import { Share, Alert } from 'react-native'
import { combineDateAndTme } from "../utils";
import { AlreadyExistsError } from "../utils/errors";

async function getToken() {
  const auth = getAuth()
  const token = await auth.currentUser.getIdToken()
  return token;
}

export async function getNotifications() {
    const token = await getToken()
  
    const serverUrl = `https://hello-26ufgpn3sq-uc.a.run.app/api/notifications/get`;

    try {
        const response = await fetch(serverUrl, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
    
        if (!response.ok) {
          throw new Error(`Error Getting Notifs! Status: ${response.status}`);
        }
    
        const notifications = await response.json();
        console.log('notifications :', notifications);
     
        return (notifications)
    } catch (error) {
        console.error("Error Getting notifications:", error.message)
    }
   
  }
  