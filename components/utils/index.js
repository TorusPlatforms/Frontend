import { getAuth } from "firebase/auth";

export async function getUser() {
    const exampleUserData = {
        profile_picture: "https://cdn.discordapp.com/attachments/803748247402184714/822541056436207657/kobe_b.PNG?ex=658f138d&is=657c9e8d&hm=37b45449720e87fa714d5a991c90f7fac4abb55f6de14f63253cdbf2da0dd7a4&",
        display_name: "Grant Hough",
        username: "@granthough",
        following_count: 128,
        follower_count: 259,
        bio: "A pretty funny guy. Has a strong affinity for dogs. \n Stefan Murphy: 'The test is in'"
    }

    const auth = getAuth()
    const token = await auth.currentUser.getIdToken()
    console.log("TOKEN", token)

    const url = `https://backend-26ufgpn3sq-uc.a.run.app/api/user`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const userData = await response.json();
        console.log('User Data:', userData);
     
        return (userData)
    } catch (error) {
        console.error("Error Getting User:", error.message)
    }
   
}

export async function getPings(user) {
    console.log(user.college)

    const auth = getAuth()
    const token = await auth.currentUser.getIdToken()
    console.log("TOKEN", token)
    
    const url = `https://backend-26ufgpn3sq-uc.a.run.app/api/posts/college/${user.college}`;

    try {  
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const responseData = await response.json();
      console.log('Response Data:', responseData);
      return responseData
  
    } catch (error) {
      console.error('Error Getting Pings:', error.message);
    }
  }


export async function createPost(user, content, image = null ) {
    const auth = getAuth()
    const token = await auth.currentUser.getIdToken()
    console.log("TOKEN", token)
    
    const url = `https://backend-26ufgpn3sq-uc.a.run.app/api/posts/add`;

    console.log("HERE", user)
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
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const responseData = await response.json();
      console.log('Response Data:', responseData);
      return responseData
  
    } catch (error) {
      console.error('Error Creating Ping:', error.message);
    }
}

export async function uploadToCDN(image) {
  const serverUrl = 'https://backend-26ufgpn3sq-uc.a.run.app/api/upload'; // Replace with your server's upload endpoint
  
  const formData = new FormData();
  formData.append('image', {
    uri: image.assets[0].uri,
    type: 'image/png', // Adjust the type based on the actual image type
    name: image.assets[0].fileName,
  });

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
  return responseData
}

export async function handleLike(post) {
  try {
    let serverUrl = ''
    if (post.isLiked) {
      serverUrl = 'https://backend-26ufgpn3sq-uc.a.run.app/api/posts/unlike'; 
    } else {
      serverUrl = 'https://backend-26ufgpn3sq-uc.a.run.app/api/posts/like';
    }
    
    const auth = getAuth()
    const token = await auth.currentUser.getIdToken()
    console.log("TOKEN", token)
    
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
      throw new Error(`Failed to unlike post. Status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('Post liked successfully. Server response:', responseData);
  } catch (error) {
    console.error('Error liking post:', error.message);
  }
}