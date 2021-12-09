import {status} from "../../app/types";

export interface Nft {
    id: number;
    owner?: string;
    color: string;
    uri?: string;
    editingStatus: status;
}

export interface NftResponse {
    name: string;
    description: string;
    image_data: string;
}

export interface GridDim {
    height: number;
    width: number;
}
