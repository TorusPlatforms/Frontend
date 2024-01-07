import { configureStore } from '@reduxjs/toolkit'

import postsReducer from './reducers'

export const store = configureStore({
  reducer: {
    postsReducer: postsReducer,
  }
})