import React from "react";
import {Nft} from "./models";
import {Rect} from "react-konva";

export interface NftItemProps {
    nft: Nft;
    height: number;
    width: number;
    x: number;
    y: number;
    onClick: () => void;
    strokeColor: string;
    strokeWidth: number;
    shadowColor: string;
    shadowWidth: number;
}

export function NftItem({nft, strokeWidth, strokeColor,height,width,x,y,onClick, shadowWidth, shadowColor}: NftItemProps): React.ReactElement {
    return (
        <Rect fill={nft.color} height={height} width={width} x={x} y={y} onClick={onClick} strokeEnabled={true}
              strokeWidth={strokeWidth} shadowEnabled={true}  shadowColor={shadowColor} shadowBlur={shadowWidth}  stroke={strokeColor}/>

    );
}
