import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../app/store";

export interface EtherState {
    account?: string;
    pickCellAddress: string;
    balance: number;

}

const initialState: EtherState = {
    pickCellAddress: process.env.REACT_APP_PICKCELL_ADDRESS as string,
    balance: 0
};

export const etherSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        setAccount: (state, action: PayloadAction<string |  undefined>) => {
            state.account = action.payload;
        }
    }
});

export const {setAccount} = etherSlice.actions;
export default etherSlice.reducer;
export const selectPickCellAddress = (state: RootState): string => state.ether.pickCellAddress;
export const selectAccount = (state: RootState): string | undefined => state.ether.account;
