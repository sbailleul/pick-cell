import React, {ReactElement, useContext, useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {
    resetTokenEditingStatus, selectEvent,
    selectGridDim,
    selectGridDimLoadingStatus,
    selectNftChangingStatusId,
    selectNftList,
    selectNftLoadingStatus
} from "./nftSlice";
import {_changeNftColorAsync, _fetchGridDimAsync, _fetchNftListAsync, _ownNftAsync} from "./thunks";
import {NftDimensions} from "./NftDimensions";
import NftList from "./NftList";
import {NftDetail} from "./NftDetail";
import {selectAccount} from "../user/etherSlice";
import {toast} from 'react-toastify';
import {status} from "../../app/types";
import {PickCellContext} from "../../app/PickCellContext";

export interface TreatedNftStatus {
    status: status,
    id: number
}

export function NftRoot(): ReactElement {
    const gridDim = useAppSelector(selectGridDim)
    const account = useAppSelector(selectAccount)
    const pickCellContext = useContext(PickCellContext)
    const gridDimLoadingStatus = useAppSelector(selectGridDimLoadingStatus)
    const svgLoadingStatus = useAppSelector(selectNftLoadingStatus);
    const nftList = useAppSelector(selectNftList);
    const dispatch = useAppDispatch();
    const [nftDetailTargetId, setNftDetailTargetId] = useState<number | null>()
    const nftChangingStatusId = useAppSelector(selectNftChangingStatusId);
    const event = useAppSelector(selectEvent);
    const [treatedNftStatus, setTreatedNftStatus] = useState<TreatedNftStatus>();
    const [treatedEvent, setTreatedEvent] = useState<string>();
    useEffect(() => {
        if (event === treatedEvent) {
            return;
        }
        toast(event, {type: "info", bodyStyle: {width: 300}});
        setTreatedEvent(event);
    }, [event, treatedEvent])
    useEffect(() => {
        if (!nftChangingStatusId) return;
        const nft = nftList[nftChangingStatusId];
        console.log("NFT_STATUS", nft.editingStatus);
        if (nft.id === treatedNftStatus?.id && nft.editingStatus === treatedNftStatus.status) {
            return;
        }
        if (nft.editingStatus === "loading") {
            toast(`Editing token ${nft.id}...`, {type: "info"})
        } else if (nft.editingStatus === "failed") {
            toast(`Token ${nft.id} edition failed`, {type: "error"});
            dispatch(resetTokenEditingStatus(nft.id))
        } else if (nft.editingStatus === "loaded") {
            toast(`Token ${nft.id} edition succeed `, {type: "success"});
            dispatch(resetTokenEditingStatus(nft.id))
        }
        setTreatedNftStatus({id: nft.id, status: nft.editingStatus});
    }, [nftChangingStatusId, nftList, treatedNftStatus, dispatch])


    useEffect(() => {
        if (gridDimLoadingStatus === "idle") {
            pickCellContext?.fetchGridDimAsync();
        }
    })
    useEffect(() => {
        if (gridDim && svgLoadingStatus === "idle") {
            pickCellContext?.fetchNftListAsync()
        }
    })

    return (
        <div>
            {nftList && gridDim &&
            <NftList nftList={nftList} gridDim={gridDim} currentAccount={account}
                     openDetail={nftId => setNftDetailTargetId(nftId)}/>}
            {nftDetailTargetId && <NftDetail
                onTransfer={(destination => pickCellContext?.transferNft({destination, tokenId: nftDetailTargetId}))}
                editing={nftList[nftDetailTargetId].editingStatus === "loading"}
                nft={nftList[nftDetailTargetId]}
                onClose={() => setNftDetailTargetId(null)}
                currentAccount={account}
                onColorChange={color => pickCellContext?.changeNftColorAsync({id: nftDetailTargetId, color})}
                onOwn={() => pickCellContext?.ownNftAsync({token: nftList[nftDetailTargetId]})}
            />}

        </div>

    )
}
