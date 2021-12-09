import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {ChainId, Config, DAppProvider} from "@usedapp/core";
import "bootstrap/dist/css/bootstrap.min.css";
import {Provider} from "react-redux";
import {store} from "./app/store";
import {BrowserRouter} from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css'
import {PickCellContextProvider} from "./app/PickCellContext";

const config: Config = {
    readOnlyChainId: ChainId.Hardhat,
    readOnlyUrls: {
        [ChainId.Hardhat]: process.env.REACT_APP_NETWORK_HOST as string
    }
};

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
