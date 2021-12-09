import React, {ReactElement} from "react";
import {GridDim} from "./models";

export interface NftDimensionsProps {
    gridDim: GridDim;
}

export function NftDimensions(props: NftDimensionsProps): ReactElement {
    let {gridDim} = props;
    return (
        <div>
            {gridDim && gridDim.height}, {gridDim && gridDim.width}
        </div>
    )
}
