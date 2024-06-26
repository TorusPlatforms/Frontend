import { getAuth } from "firebase/auth";
import { Share, Alert } from 'react-native'
import { combineDateAndTme } from "../utils";
import { AlreadyExistsError } from "../utils/errors";

async function getToken() {
  const auth = getAuth()
  const token = await auth.currentUser.getIdToken()
  return token;
}

export async function searchUsers(query) {
    const token = await getToken()
  
    let serverUrl = `https://hello-26ufgpn3sq-uc.a.run.app/api/users`;

    if (query) {
      serverUrl += "?query=" + query
    }

    const response = await fetch(serverUrl, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
      throw new Error(`Error Searching users! Status: ${response.status} Message: ${response.message}`);
    }

    const users = await response.json();
  
    return (users)
  }

export async function searchColleges(query) {
    const token = await getToken()

    let serverUrl = `https://hello-26ufgpn3sq-uc.a.run.app/api/colleges`;

    if (query) {
      serverUrl += "?query=" + query
    }

    const response = await fetch(serverUrl, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
      throw new Error(`Error Searching colleges! Status: ${response.status} Message: ${response.message}`);
    }

    const colleges = await response.json();

    return (colleges)
}

