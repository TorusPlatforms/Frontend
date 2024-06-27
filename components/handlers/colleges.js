import { getAuth } from "firebase/auth";
import { Share, Alert } from 'react-native'
import { combineDateAndTme } from "../utils";
import { AlreadyExistsError } from "../utils/errors";

async function getToken() {
  const auth = getAuth()
  const token = await auth.currentUser.getIdToken()
  return token;
}

export async function getColleges() {
    const token = await getToken()
  
    let serverUrl = `https://hello-26ufgpn3sq-uc.a.run.app/api/colleges/user`;

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


export async function addCollege(college_id) {
    const token = await getToken()

    let serverUrl = `https://hello-26ufgpn3sq-uc.a.run.app/api/colleges/${college_id}/add`;

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

    let serverUrl = `https://hello-26ufgpn3sq-uc.a.run.app/api/colleges/${college_id}/remove`;

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

