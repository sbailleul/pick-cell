import React, {useEffect, useState} from "react";
import {NftItem} from "./NftItem";
import {Layer, Stage} from "react-konva";
import {GridDim, Nft} from "./models";

export interface NftListProps {
    nftList: Nft[];
    gridDim: GridDim;
    currentAccount?: string;
    openDetail: (nftId: number) => void
}

interface ContainerDim {
    height: number;
    width: number;
}

interface NftDim {
    size: number;
    startX: number;
    startY: number;
}

function NftList({gridDim, nftList, openDetail, currentAccount}: NftListProps): React.ReactElement {
    const [canvaDim, setCanvaDim] = useState<ContainerDim>({width: 0, height: 0});
    const [nftDim, setNftDim] = useState<NftDim>({size: 0, startX: 0, startY: 0});
    const [canvaElement, setCanvaElement] = useState<HTMLDivElement>();
    const nftMargin = 5;

    useEffect(() => {
        if (!canvaElement) return;
        const cDim: ContainerDim = {
            height: window.innerHeight - canvaElement.offsetTop,
            width: canvaElement.offsetWidth
        };
        if (cDim.height !== canvaDim.height || cDim.width !== canvaDim.width) {
            setCanvaDim(cDim)
        }
    }, [canvaElement, canvaDim])
    useEffect(() => {
        function calculateStart(parentAxeSize: number, axeElementCount: number, elementSize: number) {
            return (parentAxeSize - axeElementCount * elementSize) / 2;
        }

        if (canvaDim && gridDim && nftList.length) {
            let size = 0;
            if (gridDim.width > gridDim.height) {
                size = Math.floor(canvaDim.width / gridDim.width) - nftMargin;
            } else {
                size = Math.floor(canvaDim.height / gridDim.height) - nftMargin;
            }
            const startX = Math.floor(calculateStart(canvaDim.width, gridDim.width, size))
            const startY = Math.floor(calculateStart(canvaDim.height, gridDim.height, size + nftMargin))
            if (nftDim.size !== size || nftDim.startY !== startY || nftDim.startX !== startX) {
                setNftDim({startX, startY, size});
            }
        }
    }, [canvaElement, gridDim, nftList.length, nftDim, canvaDim])


    function getColor(nft: Nft) {
        return nft.owner === currentAccount && !!currentAccount ? "red" : "white";
    }

    return (

        <div ref={(divElement) => divElement && setCanvaElement(divElement)}>
            {nftList && gridDim &&
            <Stage width={canvaDim.width} height={canvaDim.height}>
                <Layer>{
                    nftList.map((nft) => <NftItem
                        shadowColor={getColor(nft)}
                        shadowWidth={10}
                        onClick={() => openDetail(nft.id)}
                        key={nft.id}
                        nft={nft}
                        height={nftDim.size}
                        width={nftDim.size}
                        x={(nft.id % gridDim.height) * nftDim.size + nftDim.startX + (nft.id % gridDim.height) * nftMargin}
                        y={(Math.floor(nft.id / gridDim.width) * nftDim.size + nftDim.startY) + Math.floor(nft.id / gridDim.width) * nftMargin}
                        strokeWidth={2}
                        strokeColor={getColor(nft)}
                    />)
                }
                </Layer>
            </Stage>
            }
        </div>
    );
}

export default NftList;
