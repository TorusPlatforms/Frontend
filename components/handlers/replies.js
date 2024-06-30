import { getAuth } from "firebase/auth";
import { Share, Alert } from 'react-native'
import { combineDateAndTme } from "../utils";
import { AlreadyExistsError } from "../utils/errors";

async function getToken() {
  const auth = getAuth()
  const token = await auth.currentUser.getIdToken()
  return token;
}

export async function getReplies(comment_id) {
    const token = await getToken()
  
    const serverUrl = `https://hello-26ufgpn3sq-uc.a.run.app/api/comments/${comment_id}/replies`;

    const response = await fetch(serverUrl, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
      throw new Error(`Error getting replies! Status: ${response.status} Message: ${response.message}`);
    }

    const replies = await response.json();
  
    return (replies)
  }


export async function addReply({ post_id, comment_id, content }) {
    const token = await getToken()

    const serverUrl = `https://hello-26ufgpn3sq-uc.a.run.app/api/comments/reply`;

    const requestBody = {
      post_id: post_id,
      parent_comment_id: comment_id,
      content: content
    }

    const response = await fetch(serverUrl, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Error adding reply! Status: ${response.status} Message: ${response.message}`);
    }

    const result = await response.json();
    console.log(result)
    return (result)
}

export async function removeReply(reply_id) {
  const token = await getToken()

  const serverUrl = `https://hello-26ufgpn3sq-uc.a.run.app/api/comments/reply`;

  const requestBody = {
    reply_id: reply_id
  }

  const response = await fetch(serverUrl, {
      method: "DELETE",
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    throw new Error(`Error removing reply! Status: ${response.status} Message: ${response.message}`);
  }

  const result = await response.json();

  return (result)
}