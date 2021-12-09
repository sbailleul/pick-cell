import {Nft} from "./models";
import {status} from "../../app/types";

export const pickCellSliceName = "pickCell";

export interface NftState {
    account?: string,
    nftList: Nft[];
    gridWidth?: number;
    gridHeight?: number;
    nftLoadingStatus: status
    dimLoadingStatus: status,
    nftChangingStatusId?: number,
    fileServerHost: string,
    fileServerJsonPath: string,
    fileServerImagePath: string,
    tokenImageExtension: string,
    currentHost: string;
    event?: string;
}

