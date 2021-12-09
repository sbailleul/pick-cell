import {createContext, ReactNode, useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "./hooks";
import {
    _changeNftColorAsync,
    _fetchGridDimAsync,
    _fetchNftListAsync,
    _ownNftAsync, _transferNft,
    ChangeNftColorAsyncPayload,
    OwnNftAsyncPayload, TransferNftPayload
} from "../features/nfts/thunks";
import {PickCell, PickCell__factory} from "../typechain";
import {useChainState, useEthers} from "@usedapp/core";
import {selectPickCellAddress} from "../features/user/etherSlice";
import {changeTokenColor, changeTokenOwnership} from "../features/nfts/nftSlice";
import {numberToCssHex} from "./utils";

const PickCellContext = createContext<PickCellContextValue | undefined>(undefined)

export {PickCellContext}

export interface PickCellContextProb {
    children: ReactNode
    chainReady: () => void
}


interface PickCellContextValue {
    pickCell: PickCell;
    changeNftColorAsync: (payload: Omit<ChangeNftColorAsyncPayload, "pickCell">) => void;
    ownNftAsync: (payload: Omit<OwnNftAsyncPayload, "pickCell">) => void;
    transferNft: (payload: Omit<TransferNftPayload, "pickCell">) => void;
    fetchGridDimAsync: () => void;
    fetchNftListAsync: () => void;
}

export function PickCellContextProvider({children, chainReady}: PickCellContextProb) {
    let {multicallAddress} = useChainState();

    const {library} = useEthers();
    const pickCellAddress = useAppSelector(selectPickCellAddress);
    const [pickCell, setPickCell] = useState<PickCell>();
    const [pc, setPc] = useState<PickCellContextValue>();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (multicallAddress) {
            chainReady();
        }
    })
    useEffect(() => {
        if (!pickCell && library && pickCellAddress) {
            setPickCell(PickCell__factory.connect(pickCellAddress, library.getSigner()));
        }
    }, [pickCell, library, pickCellAddress]);
    useEffect(() => {
        if (!pickCell || !!pc) return;
        pickCell.on(pickCell.filters.ChangeColor(null, null, null), (owner, tokenId, color) => {
            dispatch(changeTokenColor({color: numberToCssHex(color.toNumber()), owner, tokenId: tokenId.toNumber()}))
        })
        pickCell.on(pickCell.filters.Transfer(null, null, null), (from, to, tokenId) => {
            dispatch(changeTokenOwnership({from, to, tokenId: tokenId.toNumber()}))
        })
        setPc({
            pickCell,
            transferNft: (payload: Omit<TransferNftPayload, "pickCell">) => {
                dispatch(_transferNft({pickCell, ...payload}));
            },
            changeNftColorAsync: (payload: Omit<ChangeNftColorAsyncPayload, "pickCell">) => {
                dispatch(_changeNftColorAsync({pickCell, ...payload}));
            },
            ownNftAsync: (payload: Omit<OwnNftAsyncPayload, "pickCell">) => {
                dispatch(_ownNftAsync({pickCell, ...payload}));
            },
            fetchGridDimAsync: () => {
                dispatch(_fetchGridDimAsync(pickCell));
            },
            fetchNftListAsync: () => {
                dispatch(_fetchNftListAsync(pickCell));
            },
        } as PickCellContextValue);
    }, [pickCell, pc, dispatch, library, pickCellAddress])


    return (
        <PickCellContext.Provider value={pc}>
            {children}
        </PickCellContext.Provider>
    )
}
