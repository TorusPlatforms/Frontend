import { getAuth } from "firebase/auth";
import { config } from "./api.config";

const BASE_URL = config.BASE_URL


async function getToken() {
  const auth = getAuth()
  const token = await auth.currentUser.getIdToken()
  return token;
}

export async function getColleges() {
    const token = await getToken()
  
    let serverUrl = `${BASE_URL}/api/colleges/user`;

    const response = await fetch(serverUrl, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
      throw new Error(`Error getting colleges! Status: ${response.status} Message: ${response.message}`);
    }

    const colleges = await response.json();
  
    return (colleges)
  }

export async function getCollegePings() {
    const token = await getToken()
    
    const serverUrl = `${BASE_URL}/api/posts/college`;

    try {  
      const response = await fetch(serverUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 404) {
        return []
      }

      if (!response.ok) {
        throw new Error(`Error Getting Pings! Status: ${response.status}`);
      }

      const responseData = await response.json();
      return (responseData)

    } catch (error) {
      console.error('Error Getting Pings:', error.message);
    }
}

export async function addCollege(college_id) {
    const token = await getToken()

    let serverUrl = `${BASE_URL}/api/colleges/${college_id}/add`;

    const response = await fetch(serverUrl, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
      throw new Error(`Error adding college! Status: ${response.status} Message: ${response.message}`);
    }

    const result = await response.json();

    return (result)
}

export async function removeCollege(college_id) {
    const token = await getToken()

    let serverUrl = `${BASE_URL}/api/colleges/${college_id}/remove`;

    const response = await fetch(serverUrl, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
      throw new Error(`Error removing college! Status: ${response.status} Message: ${response.message}`);
    }

    const result = await response.json();

    return (result)
}

