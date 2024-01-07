import axios from 'axios';

export const GET_POSTS = 'GET_POSTS';
export const CREATE_POST = 'CREATE_POST'

const API_URL = 'https://backend-26ufgpn3sq-uc.a.run.app/api';


async function getPost(id) {
    try {
        const res = await axios.get(API_URL + "/posts/" + id);
        if (res.data) {
            return res.data
        }
    } catch (error) {
        console.log(error)
    }
};


export function getPosts(location) {
    try {
      return async dispatch => {
        const res = await axios.get(API_URL + "/posts/Location/" + location);
        if (res.data) {
            console.log(JSON.parse(res.data))
            const postIds = JSON.parse(res.data).map((post) => post.post_id);
            console.log(postIds)

            const postsData = await Promise.all(postIds.map((postId) => getPost(postId)));
            
            console.log(postsData)
            dispatch({
                type: GET_POSTS,
                payload: postsData,
            });
        } else {
          console.log('Unable to fetch');
        }
      };
    } catch (error) {
      console.log(error)
    }
  };