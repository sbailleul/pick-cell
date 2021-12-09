import React, {ReactElement, useState} from "react";
import "./App.css";
import {NftRoot} from "./features/nfts/NftRoot";
import {UserRoot} from "./features/user/UserRoot";
import {Navigate, Outlet, Route, Routes} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import {ChainId, Config, useChainState, DAppProvider} from "@usedapp/core";
import Loader from "react-loader-spinner";
import {PickCellContextProvider} from "./app/PickCellContext";

const config: Config = {
    readOnlyChainId: ChainId.Hardhat,
    readOnlyUrls: {
        [ChainId.Hardhat]: process.env.REACT_APP_NETWORK_HOST as string
    }
};

function Layout(): ReactElement {
    return (
        <div>
            <UserRoot/>
            <div className={"container"}>
                <Outlet/>
            </div>
        </div>

    )
}

function App(): ReactElement {
    const [ready, setReady] = useState(false)
    return (
        <div>
            <ToastContainer
                position="top-left"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                theme={"dark"}
                rtl={false}
                pauseOnFocusLoss
                draggable
                style={{width: "25vw"}}
                pauseOnHover
            />
            {!ready &&
            <div className={"loader-overlay"}>
              <div className={"loader"}>
                <Loader  type={"BallTriangle"} color="cyan"/>
              </div>
            </div>}
            <DAppProvider config={config}>
                <PickCellContextProvider chainReady={() => !ready && setReady(true)}>
                    <Routes>
                        <Route path="/" element={<Navigate replace to="/tokens"/>}/>
                        <Route path={"/"} element={<Layout/>}>
                            <Route path={"/tokens"} element={<NftRoot/>}/>
                        </Route>
                    </Routes>
                </PickCellContextProvider>
            </DAppProvider>
        </div>
    );
}

export default App;
