import { configureStore } from '@reduxjs/toolkit';
import documentReducer from './features/documents/documentSlice';

export const store = configureStore({
  reducer: {
    documents: documentReducer,
  },
});
