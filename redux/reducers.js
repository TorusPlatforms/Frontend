import { GET_POSTS, CREATE_POST } from './actions';

const initialState = {
  posts: [],
};

function postsReducer(state = initialState, action) {
  switch (action.type) {
    case GET_POSTS:
      return {
        ...state, 
        posts: [...state.posts, ...action.payload],
        };
    
    case CREATE_POST:
        return {
            ...state,
            posts: [...action.payload, ...state.posts]
        }
    default:
      return state;
  }
}
export default postsReducer;