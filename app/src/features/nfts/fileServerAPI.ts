import axios from "axios";
import {Nft} from "./models";
import {SetTokenFileResponse, SetTokenImageRequest, SetTokenJsonRequest} from "./thunks";


function getTokenImageUrl(fileServerHost: string, fileServerImagePath: string, nftId: number) {
    return `${fileServerHost}/${fileServerImagePath}/${nftId}`;
}

function getTokenJsonUrl(fileServerHost: string, fileServerJsonPath: string, nftId: number) {
    return `${fileServerHost}/${fileServerJsonPath}/${nftId}`;
}

export async function setTokenImage(nft: Nft, fileServerHost: string, fileServerImagePath: string): Promise<string> {
    const tokenData: SetTokenImageRequest = {
        image: `<svg viewBox="0 0 220 100" xmlns="http://www.w3.org/2000/svg" fill="${nft.color}">
                    <rect x="120" y="0" width="100" height="100" rx="15" ry="15" />
                </svg>`,
    }
    const tokenImageUrl = getTokenImageUrl(fileServerHost, fileServerImagePath, nft.id);
    const res = await axios.post<SetTokenFileResponse>(tokenImageUrl, tokenData);
    if (res.status !== 201) {
        throw new Error(`Cannot create image for token ${nft.id}`);
    }
    return res.data.filename;
}

export async function setTokenJson(tokenId: number, fileServerHost: string, fileServerJsonPath: string, tokenImagePath: string, tokenImageExtension: string): Promise<string> {
    const tokenData: SetTokenJsonRequest = {
        name: `Token #${tokenId}`,
        image: `${tokenImagePath}/${tokenId}${tokenImageExtension}`,
        description: `A PickCell token`
    }
    const tokenJsonUrl = getTokenJsonUrl(fileServerHost, fileServerJsonPath, tokenId);
    const res = await axios.post<SetTokenFileResponse>(tokenJsonUrl, tokenData);
    if (res.status !== 201) {
        throw new Error(`Cannot create json for token ${tokenId}`);
    }
    return res.data.filename;
}

export async function deleteTokenJson(tokenId: number, fileServerHost: string, fileServerJsonPath: string) {
    const tokenJsonUrl = getTokenJsonUrl(fileServerHost, fileServerJsonPath, tokenId);
    await axios.delete(tokenJsonUrl);
}

export async function deleteTokenImage(tokenId: number, fileServerHost: string, fileServerImagePath: string) {
    const tokenImageUrl = getTokenImageUrl(fileServerHost, fileServerImagePath, tokenId);
    await axios.delete(tokenImageUrl);
}
