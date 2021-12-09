import {createAsyncThunk} from "@reduxjs/toolkit";
import {PickCell} from "../../typechain";
import {GridDim, Nft} from "./models";
import {RootState} from "../../app/store";
import {NftState, pickCellSliceName} from "./state";
import {deleteTokenImage, deleteTokenJson, setTokenImage, setTokenJson} from "./fileServerAPI";
import {EtherState} from "../user/etherSlice";
import {cssHexToNumber, numberToCssHex} from "../../app/utils";

export interface SetTokenJsonRequest {
    name: string,
    description: string,
    image: string,
}

export interface SetTokenImageRequest {
    image: string;
}

export interface SetTokenFileResponse {
    filename: string;
}

export interface OwnNftAsyncPayload {
    pickCell: PickCell;
    token: Nft;
}

export const _fetchGridDimAsync = createAsyncThunk(
    `${pickCellSliceName}/fetchGridDim`,
    async (pickCell: PickCell): Promise<GridDim> => {
        const height = await pickCell.gridHeight();
        const width = await pickCell.gridHeight();
        return {height, width};
    }
);

export const _fetchNftListAsync = createAsyncThunk(
    `${pickCellSliceName}/fetchNftList`,
    async (pickCell: PickCell, thunkAPI): Promise<Nft[]> => {
        const tokensList: Nft[] = []
        const nft = (thunkAPI.getState() as RootState).nft;
        if (!nft.gridWidth || !nft.gridHeight) {
            throw new Error("Cannot fetch nft list without grid dimensions");
        }
        for (let i = 0; i < nft.gridWidth * nft.gridHeight; i++) {
            const tokenExists = await pickCell.exists(i);
            if (tokenExists) {
                const tokenUri = await pickCell.tokenURI(i);
                const tokenColor = await pickCell.getColor(i);
                const owner = await pickCell.ownerOf(i);
                tokensList.push({
                    id: i,
                    color: numberToCssHex(tokenColor.toNumber()),
                    owner,
                    uri: tokenUri,
                    editingStatus: "idle"
                });
            } else {
                tokensList.push({id: i, color: "#000000", editingStatus: "idle"})
            }
        }
        return tokensList;
    });

export interface OwnNftAsyncResult {
    tokenId: number;
    tokenURI: string;
    owner: string;
}

export const _ownNftAsync = createAsyncThunk(
    `${pickCellSliceName}/ownNft`,
    async (payload: OwnNftAsyncPayload, thunkAPI): Promise<OwnNftAsyncResult> => {
        const {token, pickCell} = payload;
        const nftState = (thunkAPI.getState() as RootState).nft as NftState;
        const etherState = (thunkAPI.getState() as RootState).ether as EtherState;
        const jsonFileName = await setTokenJson(token.id, nftState.fileServerHost, nftState.fileServerJsonPath, nftState.currentHost, nftState.tokenImageExtension);
        try {
            await setTokenImage(token, nftState.fileServerHost, nftState.fileServerImagePath);
        } catch (err) {
            await deleteTokenJson(token.id, nftState.fileServerHost, nftState.fileServerJsonPath);
            throw new Error(`Cannot create token ${token.id} metadata`);
        }
        const tokenURI = `/${jsonFileName}`;
        try {
            const result = await pickCell.safeMint(token.id, tokenURI);
            console.log(result)
        } catch (e) {
            await deleteTokenJson(token.id, nftState.fileServerHost, nftState.fileServerJsonPath);
            await deleteTokenImage(token.id, nftState.fileServerHost, nftState.fileServerImagePath);
            throw new Error(`Cannot own token ${token.id}`);
        }
        return {tokenId: token.id, tokenURI: `${nftState.currentHost}${tokenURI}`, owner: etherState.account!};
    });

export interface ChangeNftColorAsyncPayload {
    pickCell: PickCell;
    id: number;
    color: string;
}

export interface ChangeNftColorAsyncResult {
    id: number;
    color: string;
}

export const _changeNftColorAsync = createAsyncThunk(
    `${pickCellSliceName}/changeNftColor`,
    async (payload: ChangeNftColorAsyncPayload, thunkAPI): Promise<ChangeNftColorAsyncResult> => {
        const {color, id, pickCell} = payload;
        try {
            await pickCell.setColor(id, cssHexToNumber(color));
        } catch (e) {
            throw new Error(`Cannot set color ${color} for token ${id}`);
        }
        return {id, color};
    });

export interface TransferNftPayload {
    pickCell: PickCell;
    tokenId: number;
    destination: string;
}

export const _transferNft = createAsyncThunk(
    `${pickCellSliceName}/transferNft`,
    async ({destination, pickCell, tokenId}: TransferNftPayload, thunkAPI): Promise<any> => {
        const ether = (thunkAPI.getState() as RootState).ether as EtherState;
        if (!ether.account) {
            throw new Error(`Cannot transfer without connected account`);
        }
        try {
            await pickCell.approve(destination, tokenId);
        } catch (e) {
            throw new Error(`Cannot approve ${destination} for token ${tokenId} transfer`);
        }
        try {
            await pickCell["safeTransferFrom(address,address,uint256)"](ether.account, destination, tokenId);
        } catch (e) {
            throw new Error(`Cannot transfer token ${tokenId} from ${ether.account} to ${destination}`);
        }
    });

