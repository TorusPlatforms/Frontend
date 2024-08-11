import { getAuth } from "firebase/auth";
import { config } from "./api.config";

const BASE_URL = config.BASE_URL


async function getToken() {
  const auth = getAuth()
  const token = await auth.currentUser.getIdToken()
  return token;
}

export async function getNotifications() {
    const token = await getToken()
  
    const serverUrl = `${BASE_URL}/api/notifications/get`;

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
        
        return (notifications)
    } catch (error) {
        console.error(error.message)
    }
   
  }

export async function markNotificationAsRead(notification_id) {
  const token = await getToken()

  const serverUrl = `${BASE_URL}/api/notifications/${notification_id}/read`;

  try {
      const response = await fetch(serverUrl, {
          method: "POST",
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
          },
      });
  
      if (!response.ok) {
        throw new Error(`Error Marking Notifs As Read! Status: ${response.status}`);
      }
  
      const responseData = await response.json();
      
      console.log("Marked as read", responseData)
      return (responseData)
  } catch (error) {
      console.error(error.message)
  }
}


export async function getJoinRequests(loop_id) {
    const token = await getToken()
    
    let serverUrl = `${BASE_URL}/api/loops/requests/get`;

    if (loop_id) {
      serverUrl += "?loop_id=" + loop_id
    }

    const response = await fetch(serverUrl, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
      throw new Error(`Error Getting Requests! Status: ${response.status}`);
    }

    const notifications = await response.json();

    return (notifications)

}

export async function approveRequest(data) {
  const token = await getToken()
  
  const serverUrl = `${BASE_URL}/api/loops/${data.loop_id}/approve`;

  try {
      const response = await fetch(serverUrl, {
          method: "POST",
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            request_id: data.request_id
          })
      });
  
      if (!response.ok) {
        throw new Error(`Error Approving Request! Status: ${response.status}`);
      }
  
      const status = await response.json();
  
      return (status)
  } catch (error) {
      console.error(error.message)
  }  
}


export async function rejectRequest(data) {
  const token = await getToken()
  
  const serverUrl = `${BASE_URL}/api/loops/${data.loop_id}/reject`;

  try {
      const response = await fetch(serverUrl, {
          method: "POST",
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            request_id: data.request_id
          })
      });
  
      if (!response.ok) {
        throw new Error(`Error Rejecting Request! Status: ${response.status}`);
      }
  
      const status = await response.json();
  
      return (status)
  } catch (error) {
      console.error(error.message)
  }  
}

export async function resendAnnouncement({announcement_id, loop_id}) {
  const token = await getToken()
  
  const serverUrl = `${BASE_URL}/api/loops/${loop_id}/announcements/${announcement_id}/resend`;

  try {
      const response = await fetch(serverUrl, {
          method: "POST",
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
          },
      });
  
      if (!response.ok) {
        throw new Error(`Error Resending ANnouncement! Status: ${response.status}`);
      }
  
      const status = await response.json();
  
      return (status)
  } catch (error) {
      console.error(error.message)
  }  
}
