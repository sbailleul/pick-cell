import {configureStore} from "@reduxjs/toolkit";
import etherReducer from "../features/user/etherSlice";
import nftReducer from "../features/nfts/nftSlice";
import counterReducer from "../features/counter/counterSlice";

export const store = configureStore({
  reducer: {
    ether: etherReducer,
    nft: nftReducer,
    counter: counterReducer
  }
});
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store;
