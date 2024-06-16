import { getAuth } from "firebase/auth";
import { Share, Alert } from 'react-native'
import { combineDateAndTme } from "../utils";
import { AlreadyExistsError } from "../utils/errors";

async function getToken() {
  const auth = getAuth()
  const token = await auth.currentUser.getIdToken()
  return token;
}


export async function registerUserBackend({username, email, display_name, expo_notification_id}) {
  const token = await getToken();
  const serverUrl = 'https://hello-26ufgpn3sq-uc.a.run.app/api/user/register';

  const data = {
      username: username,
      college_email: email,
      display_name: display_name,
      expo_notification_id: expo_notification_id
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

    const serverUrl = `https://hello-26ufgpn3sq-uc.a.run.app/api/user`;

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

  const serverUrl = `https://hello-26ufgpn3sq-uc.a.run.app/api/user/${username}`;
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
    
    //if college is none, should fetch by location instead
    const serverUrl = `https://hello-26ufgpn3sq-uc.a.run.app/api/posts/college/${user.college}`;

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

export async function getFollowingPings() {
  const token = await getToken()
  console.log(token)
  
  const serverUrl = `https://hello-26ufgpn3sq-uc.a.run.app/api/posts/following`;

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
      throw new Error(`Error Getting Following Pings! Status: ${response.status}`);
    }

    const responseData = await response.json();
    return (responseData)

  } catch (error) {
    console.error('Error Getting Pings:', error.message);
  }
}

export async function getLoopPings(loop_id) {
    const token = await getToken()
    console.log(token)
    
    //if college is none, should fetch by location instead
    const serverUrl = `https://hello-26ufgpn3sq-uc.a.run.app/api/posts/loop/${loop_id}`;

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


export async function getLoopEvents(loop_id) {
  const token = await getToken()
  console.log(token)
  
  //if college is none, should fetch by location instead
  const serverUrl = `https://hello-26ufgpn3sq-uc.a.run.app/api/events/loop/${loop_id}`;

  try {  
    const response = await fetch(serverUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    const responseData = await response.json();
    console.log(response.status, responseData)

    if (response.status === 404) {
      return []
    }
    
    if (!response.ok) {
      throw new Error(`Error Getting Pings! Status: ${response.status}`);
    }

    return (responseData)

  } catch (error) {
    console.error('Error Getting Pings:', error.message);
  }
}

export async function getEvents() {
    const token = await getToken()
    console.log(token)

    const serverUrl = `https://hello-26ufgpn3sq-uc.a.run.app/api/events/get`;

    try {  
      const response = await fetch(serverUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error Getting Events! Status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('Events:', responseData);
      return (responseData)

    } catch (error) {
      console.error('Error Getting Events:', error.message);
    }
}


export async function joinLeaveEvent(event) {
    const token = await getToken()

    let endpoint;
    if (event.isJoined) {
      endpoint = "leave"
    } else {
      endpoint = "join"
    }

    let serverUrl = `https://hello-26ufgpn3sq-uc.a.run.app/api/events/${event.event_id}/${endpoint}`

    try {
      const response = await fetch(serverUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const responseData = await response.json();
      console.log(`Event ${endpoint} successful. Server response:`, responseData);

      if (!response.ok) {
        throw new Error(`Failed to ${endpoint} event. Status: ${response.status}`);
      }

     
      
    } catch (error) {
      console.error('Error event:', error.message);
    }
}


export async function createPost({  content, author, pfp_url, latitude, longitude, college, loop_id, image }) {
    const token = await getToken()
    
    const serverUrl = `https://hello-26ufgpn3sq-uc.a.run.app/api/posts/add`;

    const postData = {
      content: content,
      author: author,
      pfp_url: pfp_url,
      latitude: latitude,
      longitude: longitude,
      college: college,
      loop_id: loop_id
    }

    if (image) {
      const uploadedImage = await uploadToCDN(image)
      postData.image_url = uploadedImage.url
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
      
      const responseData = await response.json();
      console.log('Created Post:', responseData);

      if (!response.ok) {
        throw new Error(`Error Creating Ping! Status: ${response.status}`);
      }
  
  
      return (responseData)
  
    } catch (error) {
      console.error('Error Creating Ping:', error.message);
    }
}


export async function createEvent({name, address, day, time, details, image, isPublic, loop_id}) {
  const token = await getToken()
  
  const serverUrl = `https://hello-26ufgpn3sq-uc.a.run.app/api/events/create`;


  const date = combineDateAndTme(day, time)

  const eventData = {
    name: name,
    time: date.getTime(),
    address: address,
    details: details,  
    public: isPublic,
    loop_id: loop_id
  };

  
  if (image) {
    const uploadedImage = await uploadToCDN(image)
    const image_url = uploadedImage.url
    eventData.image_url = image_url
  }

  console.log(eventData)

  try {  
    const response = await fetch(serverUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });

    const responseData = await response.json();
    console.log('Created Event:', responseData);

    
    if (!response.ok) {
      throw new Error(`Error Creating Event! Status: ${response.status}`);
    }

    return (responseData)

  } catch (error) {
    console.error('Error Creating Event:', error.message);
  }
}


export async function uploadToCDN(image) {
  const serverUrl = 'https://hello-26ufgpn3sq-uc.a.run.app/api/upload';
  
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


export async function handleLike(post) {
  const token = await getToken()

  let endpoint;
  if (post.isLiked) {
    endpoint = "unlike"
  } else {
    endpoint = "like"
  }

  let serverUrl = `https://hello-26ufgpn3sq-uc.a.run.app/api/posts/${endpoint}`

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
    
  } catch (error) {
    console.error('Error liking post:', error.message);
  }
}


export async function getComments(post) {
  const token = await getToken()

  console.log("post", post.post_id)
  const serverUrl = `https://hello-26ufgpn3sq-uc.a.run.app/api/comments/post/${post.post_id}`;

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


export async function updateUser(endpoint, content) {
  const serverUrl = `https://hello-26ufgpn3sq-uc.a.run.app/api/user/update/${endpoint}`;
  
  const token = await getToken()

  const requestBody = {
    value: content
  };

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

export async function updateLoop(loop_id, endpoint, content) {
  const serverUrl = `https://hello-26ufgpn3sq-uc.a.run.app/api/loops/${loop_id}/update/${endpoint}`;
  
  const token = await getToken()

  const requestBody = {
    value: content
  };
  
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
  const token = await getToken()
  
  const serverUrl = `https://hello-26ufgpn3sq-uc.a.run.app/api/comments/add`;

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


export async function getThreads() {
  const token = await getToken()

  const serverUrl = 'https://hello-26ufgpn3sq-uc.a.run.app/api/messages/threads';

  try {
    const response = await fetch(serverUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })

    const responseData = await response.json();
    console.log('Threads:', responseData);

    if (responseData.status === 204) {
      return []
    }
    
    if (!response.ok) {
      throw new Error(`Error getting threads! Status: ${response.status}`);
    }


    return responseData
  } catch (error) {
    console.error("Error getting threads", error.message)
  }
}


export async function getDM(username) {
  const token = await getToken()

  const serverUrl = `https://hello-26ufgpn3sq-uc.a.run.app/api/messages/get/${username}`;

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
    return responseData;

  } catch (error) {
    console.error("Error getting DM", error.message);
  }
}


export async function sendMessage(username, content) {
  const token = await getToken()

  const serverUrl = `https://hello-26ufgpn3sq-uc.a.run.app/api/messages/add`;

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


export async function getLoops(user) {
    const token = await getToken()

    const serverUrl = `https://hello-26ufgpn3sq-uc.a.run.app/api/loops/location/${user.college}`;

    try {  
      const response = await fetch(serverUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const responseData = await response.json();
      console.log('Response Data:', responseData);

      if (!response.ok) {
        throw new Error(`Error Getting Loops! Status: ${response.status}`);
      }
  
  
      return (responseData)
  
    } catch (error) {
      console.error('Error Getting Loops:', error.message);
    }
  }


export async function getLoop(loop_id) {
    const token = await getToken()

    const serverUrl = `https://hello-26ufgpn3sq-uc.a.run.app/api/loops/${loop_id}`;

    try {  
      const response = await fetch(serverUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const responseData = await response.json();
      console.log('Response Data:', responseData);

      if (!response.ok) {
        throw new Error(`Error Getting Loop info! Status: ${response.status}`);
      }


      return (responseData)

    } catch (error) {
      console.error('Error Getting Loops Info:', error.message);
    }
}



export async function createLoop({ name, creator_id, status, location, image, description}) {
    const token = await getToken()

    const serverUrl = `https://hello-26ufgpn3sq-uc.a.run.app/api/loops/add`;

    const loopData = {
      name: name,
      creator_id: creator_id,
      status: status,
      location: location,
      description: description
    }
    
        
    if (image) {
      const uploadedImage = await uploadToCDN(image)
      loopData.pfp_url = uploadedImage.url
    }

    console.log(loopData)

    const response = await fetch(serverUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loopData)
    });

    const responseData = await response.json();
    console.log('Response Data:', responseData);
    
    if (responseData.status === 403) {
      throw new AlreadyExistsError(responseData.message);
    }

    if (!response.ok) {
      throw new Error(`Error Creating Loop! Status: ${response.status}`);
    }

    return (responseData)

}

  
  export async function editLoop(userId, loopId, content) {
    const token = await getToken();
  
    const serverUrl = `https://hello-26ufgpn3sq-uc.a.run.app/api/loops/${loopId}/edit`;
  
    try {
      const response = await fetch(serverUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(content),
      });
  
      if (!response.ok) {
        throw new Error(`Error Editing Loop! Status: ${response.status}`);
      }
  
      const responseData = await response.json();
      console.log('Loop Edited:', responseData);
      return responseData;
  
    } catch (error) {
      console.error('Error Editing Loop:', error.message);
    }
  }


  
  export async function removeLoop(userId, loopId) {
    const token = await getToken();
  
    const serverUrl = `https://hello-26ufgpn3sq-uc.a.run.app/api/loops/${loopId}/delete`;
  
    try {
      const response = await fetch(serverUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error Removing Loop! Status: ${response.status}`);
      }
  
      const responseData = await response.json();
      console.log('Loop Removed:', responseData);
      return (responseData);
  
    } catch (error) {
      console.error('Error Removing Loop:', error.message);
    }
  }



export async function getUserPings(username) {
  const token = await getToken()

  const serverUrl = `https://hello-26ufgpn3sq-uc.a.run.app/api/posts/user/${username}`;

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
    // console.log('User Pings:', responseData);
    return responseData

  } catch(error) {
    console.error("Error getting user pings", error.message)
  }
}

export async function getFollowings(username, type) {
  const token = await getToken()

  const serverUrl = `https://hello-26ufgpn3sq-uc.a.run.app/api/user/${username}/${type}`;

  try {
    const response = await fetch(serverUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    const responseData = await response.json();
    console.log(type, responseData);

    if (!response.ok) {
      throw new Error(`Error getting ${type}! Status: ${response.status}`);
    }

    return responseData

  } catch(error) {
    console.error("Error getting followings", error.message)
  }
}

export async function searchUsers(query) {
  const serverUrl = `https://hello-26ufgpn3sq-uc.a.run.app/api/user/search/${query}`;
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


export async function getLoopOwner(loopId) {
    const token = await getToken()

    const serverUrl = `https://hello-26ufgpn3sq-uc.a.run.app/api/loops/getOwner/${loopId}`;

    try {  
      const response = await fetch(serverUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error Getting Owner info! Status: ${response.status}`);
      }
  
      const responseData = await response.json();
      console.log('Response Data:', responseData);
      return (responseData)
  
    } catch (error) {
      console.error('Error Getting Owner:', error.message);
    }
  }


export async function getMemberStatus(loopId,userId) {
  const token = await getToken()

  const serverUrl = `https://hello-26ufgpn3sq-uc.a.run.app/api/loops/isMember/${loopId}/${userId}`;

  try {  
    const response = await fetch(serverUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Error Getting member info! Status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('Response Data:', responseData);
    return (responseData)

  } catch (error) {
    console.error('Error Getting Member status:', error.message);
  }
}


  export async function joinLoop(loop_id) {
    const token = await getToken()

    const serverUrl = `https://hello-26ufgpn3sq-uc.a.run.app/api/loops/${loop_id}/join`;

    try {  
      const response = await fetch(serverUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }); 

      const responseData = await response.json();
      console.log('Response Data:', responseData);
      
      if (!response.ok) {
        throw new Error(`Error joining loop! Status: ${response.status}`);
      }
      
      return (responseData)
  
    } catch (error) {
      console.error('Error joining loop:', error.message);
    }
  }


  export async function leaveLoop(loop_id) {
    const token = await getToken()

    const serverUrl = `https://hello-26ufgpn3sq-uc.a.run.app/api/loops/${loop_id}/leave`;

    try {  
      const response = await fetch(serverUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const responseData = await response.json();
      console.log('Response Data:', responseData);

      if (!response.ok) {
        throw new Error(`Error leaving loop! Status: ${response.status}`);
      }
  
      return (responseData)
  
    } catch (error) {
      console.error('Error leaving loop:', error.message);
    }
  }


  export async function getLoopMembers(loopId) {
    const token = await getToken()

    const serverUrl = `https://hello-26ufgpn3sq-uc.a.run.app/api/loops/${loopId}/members`;

    try {  
      const response = await fetch(serverUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error getting members! Status: ${response.status}`);
      }
  
      const responseData = await response.json();
      console.log('Response Data:', responseData);
      return (responseData)
  
    } catch (error) {
      console.error('Error getting loop members:', error.message);
    }
  }

export async function follow(username) {
    const serverUrl = `https://hello-26ufgpn3sq-uc.a.run.app/api/user/${username}/follow`;
    const token = await getToken()
    console.log(serverUrl)
  
    try {
      const response = await fetch(serverUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
      })
      
      const responseData = await response.json();
      console.log("Following: ", responseData);

      if (!response.ok) {
        throw new Error(`Error following! Status: ${response.status}`);
      }

      return responseData
  
    } catch(error) {
      console.error("Error following", error.message)
    }
  }


export async function unfollow(username) {
    const serverUrl = `https://hello-26ufgpn3sq-uc.a.run.app/api/user/${username}/unfollow`;
    const token = await getToken()
    console.log(serverUrl)

    try {
      const response = await fetch(serverUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
      })
      
      const responseData = await response.json();
      console.log("Following: ", responseData);

      
      if (!response.ok) {
        throw new Error(`Error unfollowing! Status: ${response.status}`);
      }


      return responseData

    } catch(error) {
      console.error("Error unfollowing", error.message)
    }
}


  export async function followCheck(username) {
    const serverUrl = `https://hello-26ufgpn3sq-uc.a.run.app/api/followings/isFollowing/${username}`;
    const token = await getToken()
    console.log(serverUrl)
  
    try {
      const response = await fetch(serverUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
      })
  
      if (!response.ok) {
        throw new Error(`Error followcheck status! Status: ${response.status}`);
      }
  
      const responseData = await response.json();
      console.log("is following: ", responseData);
      return responseData
  
    } catch(error) {
      console.error("Error followcheck", error.message)
    }
  }

export async function getAnnouncements(loop_id) {
  
  const token = await getToken()

  const serverUrl = `https://hello-26ufgpn3sq-uc.a.run.app/api/loops/${loop_id}/announcements`;

  try {
    const response = await fetch(serverUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    const responseData = await response.json();
    console.log('announcements:', responseData);

    if (!response.ok) {
      throw new Error(`Error getting announcement! Status: ${response.status}`);
    }

    return responseData;

  } catch (error) {
    console.error("Error getting announcement", error.message);
  }
}


export async function sendAnnouncement({loop_id, content, image}) {
  const token = await getToken()

  const serverUrl = `https://hello-26ufgpn3sq-uc.a.run.app/api/loops/${loop_id}/createAnnouncement`;

  const announcementData = {
    content: content,
  }

  if (image) {
    const uploadedImage = await uploadToCDN(image)
    announcementData.image_url = uploadedImage.url
  }

  console.log(announcementData)
  try {
    const response = await fetch(serverUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(announcementData)
    })


    const responseData = await response.json();
    console.log('Sent announcement:', responseData);


    if (!response.ok) {
      throw new Error(`Error cereating cannoucnemtn! Status: ${response.status}`);
    }

    return responseData

  } catch(error) {
    console.error("Error sending announcement", error.message)
  }
}


export async function getChats(loopId) {
  
  const token = await getToken()

  const serverUrl = `https://hello-26ufgpn3sq-uc.a.run.app/api/loops/${loopId}/messages`;

  try {
    const response = await fetch(serverUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Error getting chat! Status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('chats:', responseData);
    return responseData;

  } catch (error) {
    console.error("Error getting chat", error.message);
  }
}


export async function sendChat(loopId, content) {
  const token = await getToken()

  const serverUrl = `https://hello-26ufgpn3sq-uc.a.run.app/api/loops/createMessage`;

  try {
    const response = await fetch(serverUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        loop_id: loopId, 
        content: content
      })
    })

    if (!response.ok) {
      throw new Error(`Error cereating chat! Status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('Sent chat:', responseData);
    return responseData

  } catch(error) {
    console.error("Error sending chat", error.message)
  }
}


export async function kickUser(loop_id, username) {
  const token = await getToken()

  const serverUrl = `https://hello-26ufgpn3sq-uc.a.run.app/api/loops/${loop_id}/kick/${username}`;

  try {
    const response = await fetch(serverUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    const responseData = await response.json();
    console.log('key:', responseData);

    if (!response.ok) {
      throw new Error(`Error getting key! Status: ${response.status}`);
    }
  
    return responseData;

  } catch (error) {
    console.error("Error getting key", error.message);
  }
}


export async function getGoogleMapsKey() {

  const token = await getToken()

  const serverUrl = `https://hello-26ufgpn3sq-uc.a.run.app/api/googlemaps`;

  try {
    const response = await fetch(serverUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Error getting key! Status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('key:', responseData);
    return responseData;

  } catch (error) {
    console.error("Error getting key", error.message);
  }
}


export async function getJoinedLoops(n) {
  
  const token = await getToken()

  const serverUrl = `https://hello-26ufgpn3sq-uc.a.run.app/api/loops/joined/${n}`;

  try {
    const response = await fetch(serverUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    const responseData = await response.json();
    console.log('recent ' + n + ' loops:', responseData);


    if (!response.ok) {
      throw new Error(`Error getting msgs! Status: ${response.status}`);
    }

   
    return responseData;

  } catch (error) {
    console.error("Error getting loops", error.message);
  }
}
