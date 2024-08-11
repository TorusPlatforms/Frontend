import { getAuth } from "firebase/auth";
import { config } from "./api.config";

const BASE_URL = config.BASE_URL


async function getToken() {
  const auth = getAuth()
  const token = await auth.currentUser.getIdToken()
  return token;
}

export async function searchUsers(query, limit = 20) {
    const token = await getToken()
  
    let serverUrl = `${BASE_URL}/api/users?limit=${limit}`;

    if (query) {
      serverUrl += "&query=" + query
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

    let serverUrl = `${BASE_URL}/api/colleges`;

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

