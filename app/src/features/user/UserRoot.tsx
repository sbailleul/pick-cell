import React, {ReactElement, useEffect} from "react";
import {Button, Image} from "react-bootstrap";
import {formatEther} from "ethers/lib/utils";
import {useEtherBalance, useEthers} from "@usedapp/core";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {selectAccount, setAccount} from "./etherSlice";
import {FaEthereum, FiUser} from "react-icons/all";


export function UserRoot(): ReactElement {
    const {activateBrowserWallet, deactivate, account} = useEthers();
    const etherBalance = useEtherBalance(account);
    const dispatch = useAppDispatch();
    const sliceAccount = useAppSelector(selectAccount);
    useEffect(() => {
        if (account !== sliceAccount) {
            dispatch(setAccount(account ?? undefined));
        }
    })
    return (
        <div className={"bg-dark text-white container-fluid d-flex align-items-center mb-3 p-3"}>
            <div className={"col-3 d-flex justify-content-center"}>
                {!sliceAccount ?
                    <Button onClick={() => activateBrowserWallet()}>Connect</Button>
                    : <Button onClick={() => deactivate()}>Disconnect</Button>}
            </div>
            {etherBalance &&
            <div className={"col-4 d-flex align-items-center justify-content-center"}>
                <FaEthereum/>
                <span className={"mx-2"}>{formatEther(etherBalance)}</span>
            </div>
            }
            {account &&
            <div className={"col-5 d-flex align-items-center justify-content-center"}>
                <FiUser className={"mx-2"}/>
                <span>{account}</span>
            </div>
            }
        </div>
    )
}
