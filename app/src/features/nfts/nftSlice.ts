import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../app/store";
import {status} from "../../app/types";
import {GridDim, Nft} from "./models";
import {_changeNftColorAsync, _fetchGridDimAsync, _fetchNftListAsync, _ownNftAsync, _transferNft} from "./thunks";
import {NftState, pickCellSliceName} from "./state";
import {setAccount} from "../user/etherSlice";

export const initialState: NftState = {
    tokenImageExtension: process.env.REACT_APP_TOKEN_IMAGE_EXTENSION as string,
    currentHost: `${window.location.protocol}//${window.location.host}`,
    nftList: [],
    nftLoadingStatus: "idle",
    dimLoadingStatus: "idle",
    fileServerHost: `${window.location.protocol}//${process.env.REACT_APP_FILE_SERVER_HOSTNAME}:${process.env.REACT_APP_FILE_SERVER_PORT}`,
    fileServerJsonPath: process.env.REACT_APP_FILE_SERVER_JSON_PATH as string,
    fileServerImagePath: process.env.REACT_APP_FILE_SERVER_IMAGE_PATH as string
}

export interface ChangeTokenColorPayload {
    owner: string;
    tokenId: number,
    color: string
}

export interface ChangeTokenOwnershipPayload {
    from: string,
    to: string;
    tokenId: number;
}

export const nftSlice = createSlice({
    name: pickCellSliceName,
    initialState,
    reducers: {
        resetTokenEditingStatus: (state, action: PayloadAction<number>) => {
            state.nftList[action.payload].editingStatus = "idle"
        },
        changeTokenColor: (state, action: PayloadAction<ChangeTokenColorPayload>) => {
            let {color, tokenId, owner} = action.payload;
            const nft = state.nftList[tokenId];
            if (!nft) {
                return;
            }
            if (state.account !== owner) {
                state.event = `Token ${tokenId} color has been changed from ${nft.color} to ${color} by ${nft.owner}`;
            }
            nft.color = color
        },
        changeTokenOwnership: (state, action: PayloadAction<ChangeTokenOwnershipPayload>,) => {
            let {from, to, tokenId} = action.payload;
            const nft = state.nftList[tokenId];
            if (!nft) {
                return;
            }
            nft.owner = to;
            if (from === state.account) {
                return;
            } else if (from.match(/0x0*$/) && to !== state.account) {
                state.event = `Token ${tokenId} has been owned by ${to}`;
            } else {
                state.event = `Token ${tokenId} has been transferred from ${from} to ${to === state.account ? 'you' : to}`;
            }
        }

    },
    extraReducers: builder => builder
        .addCase(setAccount, (state, action) => {
            state.account = action.payload;
        })
        .addCase(_fetchGridDimAsync.pending, state => {
            state.dimLoadingStatus = "loading";
        })
        .addCase(_fetchGridDimAsync.fulfilled, (state, action) => {
            state.gridHeight = action.payload.height;
            state.gridWidth = action.payload.width;
            state.dimLoadingStatus = "loaded";
        })
        .addCase(_fetchNftListAsync.pending, (state, action) => {
            state.nftLoadingStatus = "loading";
        })
        .addCase(_fetchNftListAsync.fulfilled, (state, action) => {
            state.nftList = action.payload;
            state.nftLoadingStatus = "loaded";
        })
        .addCase(_ownNftAsync.pending, (state, action) => {
            const nftId = action.meta.arg.token.id
            state.nftChangingStatusId = nftId;
            state.nftList[nftId].editingStatus = "loading";
        })
        .addCase(_ownNftAsync.rejected, (state, action) => {
            const nftId = action.meta.arg.token.id
            state.nftChangingStatusId = nftId;
            state.nftList[nftId].editingStatus = "failed";
        })
        .addCase(_ownNftAsync.fulfilled, (state, action) => {
            const nft = state.nftList.find(n => n.id === action.payload.tokenId);
            if (nft) {
                nft.uri = action.payload.tokenURI;
                nft.owner = action.payload.owner;
                nft.editingStatus = "loaded";
            } else {
                throw new Error(`Cannot update missing nft ${action.payload.tokenId}`)
            }
        })
        .addCase(_transferNft.pending, (state, action) => {
            const nftId = action.meta.arg.tokenId
            state.nftChangingStatusId = nftId;
            state.nftList[nftId].editingStatus = "loading";
        })
        .addCase(_transferNft.rejected, (state, action) => {
            const nftId = action.meta.arg.tokenId
            state.nftChangingStatusId = nftId;
            state.nftList[nftId].editingStatus = "failed";
        })
        .addCase(_transferNft.fulfilled, (state, action) => {
            const nft = state.nftList.find(n => n.id ===  action.meta.arg.tokenId);
            if (nft) {
                nft.owner = action.meta.arg.destination;
                nft.editingStatus = "loaded";
            } else {
                throw new Error(`Cannot update missing nft ${action.payload.tokenId}`)
            }
        })
        .addCase(_changeNftColorAsync.pending, (state, action) => {
            const nftId = action.meta.arg.id
            state.nftList[nftId].editingStatus = "loading";
            state.nftChangingStatusId = nftId;
        })
        .addCase(_changeNftColorAsync.fulfilled, (state, action) => {
            const nft = state.nftList.find(n => n.id === action.payload.id);
            if (nft) {
                nft.color = action.payload.color;
                nft.editingStatus = "loaded";
                state.nftChangingStatusId = nft.id;
            } else {
                throw new Error(`Cannot update missing nft ${action.payload.id}`)
            }
        })
        .addCase(_changeNftColorAsync.rejected, (state, action) => {
            const nftId = action.meta.arg.id
            state.nftChangingStatusId = nftId;
            state.nftList[nftId].editingStatus = "failed";

        })


});
export const selectGridDim = (state: RootState): GridDim | undefined => state.nft.gridWidth && state.nft.gridHeight ? {
    height: state.nft.gridHeight,
    width: state.nft.gridWidth
} : undefined
const currentState = (state: RootState): NftState => state.nft;
export const selectNftList = (state: RootState): Nft[] => currentState(state).nftList
export const selectNftLoadingStatus = (state: RootState): status => currentState(state).nftLoadingStatus;
export const selectGridDimLoadingStatus = (state: RootState): status => currentState(state).dimLoadingStatus;
export const selectNftChangingStatusId = (state: RootState): number | undefined => currentState(state).nftChangingStatusId;
export const selectEvent = (state: RootState): string | undefined => currentState(state).event;

export const {resetTokenEditingStatus, changeTokenColor, changeTokenOwnership} = nftSlice.actions;
export default nftSlice.reducer;

