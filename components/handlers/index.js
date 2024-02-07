import { getAuth } from "firebase/auth";
import { Share, Alert } from 'react-native'

async function getToken() {
  const auth = getAuth()
  const token = await auth.currentUser.getIdToken()
  return token
}

export async function registerUserBackend(username, email, display_name) {
  const token = await getToken();
  const serverUrl = 'https://backend-26ufgpn3sq-uc.a.run.app/api/user/register';

  const data = {
      username: username,
      college_email: email,
      display_name: display_name
  };
  
  console.log(JSON.stringify(data))
  const response = await fetch(serverUrl, {
  method: 'POST',
  headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify(data),
  });

  const responseData = await response.json();
  console.log('Response:', responseData);
  return responseData
}

export async function getUser() {
    const token = await getToken()

    const serverUrl = `https://backend-26ufgpn3sq-uc.a.run.app/api/user`;

    try {
        const response = await fetch(serverUrl, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
    
        if (!response.ok) {
          throw new Error(`Error Getting User! Status: ${response.status}`);
        }
    
        const userData = await response.json();
        console.log('User Data:', userData);
     
        return (userData)
    } catch (error) {
        console.error("Error Getting User:", error.message)
    }
   
}

export async function getUserByUsername(username) {
  const token = await getToken()

  const serverUrl = `https://backend-26ufgpn3sq-uc.a.run.app/api/user/${username}`;
  console.log(serverUrl)
  try {
      const response = await fetch(serverUrl, {
          method: "GET",
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
          },
      });
  
      if (!response.ok) {
        throw new Error(`Error Getting User! Status: ${response.status}`);
      }
  
      const userData = await response.json();
      console.log('User Data:', userData);
   
      return (userData)
  } catch (error) {
      console.error("Error Getting User:", error.message)
  }
 
}

export async function getPings(user) {
    const token = await getToken()
    console.log(token)

    const serverUrl = `https://backend-26ufgpn3sq-uc.a.run.app/api/posts/college/${user.college}`;

    try {  
      const response = await fetch(serverUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error Getting Pings! Status: ${response.status}`);
      }
  
      const responseData = await response.json();
      console.log('Pings:', responseData);
      return (responseData)
  
    } catch (error) {
      console.error('Error Getting Pings:', error.message);
    }
  }


export async function createPost(user, content, image = null ) {
    const token = await getToken()
    
    const serverUrl = `https://backend-26ufgpn3sq-uc.a.run.app/api/posts/add`;

    const postData = {
      content: content,
      college: user.college,
      pfp_url: user.profile_picture,    
    };

    if (image) {
      const uploadedImage = await uploadToCDN(image)
      const image_url = uploadedImage.url
      postData["image_url"] = image_url
    }

    try {  
      const response = await fetch(serverUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
  
      if (!response.ok) {
        throw new Error(`Error Creating Ping! Status: ${response.status}`);
      }
  
      const responseData = await response.json();
      console.log('Created Post:', responseData);
      return (responseData)
  
    } catch (error) {
      console.error('Error Creating Ping:', error.message);
    }
}

export async function uploadToCDN(image) {
  const serverUrl = 'https://backend-26ufgpn3sq-uc.a.run.app/api/upload';
  
  const formData = new FormData();
  formData.append('image', {
    uri: image.assets[0].uri,
    type: 'image/png', // Adjust the type based on the actual image type
    name: image.assets[0].fileName,
  });

  try {
    const response = await fetch(serverUrl, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  
    if (!response.ok) {
      throw new Error(`Failed to upload image. Status: ${response.status}`);
    }
  
    const responseData = await response.json();
    console.log('Upload successful. Server response:', responseData);
    return (responseData)
  } catch (error) {
    console.error('Failed to upload image:', error.message)
  }
  
}

export async function handleLike(post, updateLike) {
  const token = await getToken()

  let endpoint;
  if (post.isLiked) {
    endpoint = "unlike"
  } else {
    endpoint = "like"
  }

  let serverUrl = `https://backend-26ufgpn3sq-uc.a.run.app/api/posts/${endpoint}`

  try {
    const response = await fetch(serverUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        post_id: post.post_id,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to ${endpoint} post. Status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log(`Post ${endpoint} successfully. Server response:`, responseData);

    updateLike()

  } catch (error) {
    console.error('Error liking post:', error.message);
  }
}

export async function getComments(post) {
  const token = await getToken()

  console.log("post", post.post_id)
  const serverUrl = `https://backend-26ufgpn3sq-uc.a.run.app/api/comments/post/${post.post_id}`;

  try {
    const response = await fetch(serverUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get comments. Status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('Opened comments successfully. Server response:', responseData);

    return responseData

  } catch (error) {
    console.error('Error getting comments:', error.message);
  }
}

export async function handleShare(postURL) {
  try {
    const result = await Share.share({
      url: postURL
    });
    return result
  } catch (error) {
    Alert.alert(error.message);
  }
}

export async function updateUser(endpoint, varName, content) {
  const serverUrl = `https://backend-26ufgpn3sq-uc.a.run.app/api/user/update/${endpoint}`;
  
  const token = await getToken()

  const requestBody = {};
  requestBody[varName] = content

  try {
    const response = await fetch(serverUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Failed to update. Status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('Updated succesfully. Server response:', responseData);

  } catch (error) {
    console.error('Error updating:', error.message);
  }
}

export async function postComment(post, content) {
  console.log("HERE", post, content)
  const token = await getToken()
  
  const serverUrl = `https://backend-26ufgpn3sq-uc.a.run.app/api/comments/add`;

  try {  
    const response = await fetch(serverUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        post_id: post.post_id,
        content: content
      }),
    });

    if (!response.ok) {
      throw new Error(`Error posting comment! Status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('Posted Comment:', responseData);
    return responseData

  } catch (error) {
    console.error('Error posting comment:', error.message);
  }
}

export async function updateUserProfilePicture(profilePictureURL) {
  const serverUrl = 'https://backend-26ufgpn3sq-uc.a.run.app/api/user/update/profilepicture';

  const requestBody = {
    token: auth.currentUser.uid,
    pfp_url: profilePictureURL,
  };

  try {
    const response = await fetch(serverUrl, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      });
    
      if (!response.ok) {
        throw new Error(`Failed to update profile picture. Status: ${response.status}`);
      }
    
      console.log('Profile picture update successful');
  } catch (error) {
    console.error("Error uploading", error.message)
  }
 
}


export async function getThreads() {
  const token = await getToken()

  const serverUrl = 'https://backend-26ufgpn3sq-uc.a.run.app/api/messages/threads';

  try {
    const response = await fetch(serverUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      throw new Error(`Error getting threads! Status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('Threads:', responseData);
    return responseData
  } catch (error) {
    console.error("Error getting threads", error.message)
  }
}

export async function getDM(username) {
  const token = await getToken()

  const serverUrl = `https://backend-26ufgpn3sq-uc.a.run.app/api/messages/get/${username}`;

  try {
    const response = await fetch(serverUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Error getting DM! Status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('DMs:', responseData);
    return responseData

  } catch (error) {
    console.error("Error getting DM", error.message)
  }
}

export async function sendMessage(username, content) {
  const token = await getToken()

  const serverUrl = `https://backend-26ufgpn3sq-uc.a.run.app/api/messages/add`;

  try {
    const response = await fetch(serverUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        receiver_username: username, 
        content: content
      })
    })

    if (!response.ok) {
      throw new Error(`Error getting DM! Status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('Sent Message:', responseData);
    return responseData

  } catch(error) {
    console.error("Error sending DM", error.message)
  }
}

export async function getUserPings(username) {
  const token = await getToken()

  const serverUrl = `https://backend-26ufgpn3sq-uc.a.run.app/api/posts/user/${username}`;

  console.log("HEREEEE", serverUrl)

  try {
    const response = await fetch(serverUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Error getting user pings! Status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('User Pings:', responseData);
    return responseData

  } catch(error) {
    console.error("Error getting user pings", error.message)
  }
}

export async function getFollowings(username, type) {
  const token = await getToken()

  const serverUrl = `https://backend-26ufgpn3sq-uc.a.run.app/api/followings/${type}/${username}`;

  console.log("HEREEEE", serverUrl)

  try {
    const response = await fetch(serverUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Error getting ${type}! Status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log(type, responseData);
    return responseData

  } catch(error) {
    console.error("Error getting followings", error.message)
  }
}

export async function searchUsers(query) {
  const serverUrl = `https://backend-26ufgpn3sq-uc.a.run.app/api/user/search/${query}`;
  console.log(serverUrl)

  try {
    const response = await fetch(serverUrl, {
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error(`Error searching! Status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log("Searched Users", responseData);
    return responseData

  } catch(error) {
    console.error("Error searching", error.message)
  }
}