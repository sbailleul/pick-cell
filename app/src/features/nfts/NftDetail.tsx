import React, {ReactElement, useState} from "react";
import {Button, Form, Modal, ModalDialog} from "react-bootstrap";
import {Nft} from "./models";
import {ColorResult, MaterialPicker, SketchPicker, SliderPicker} from 'react-color';

export interface NftDetailProps {
    nft: Nft;
    editing: boolean;
    onClose: () => void;
    onOwn: () => void;
    onTransfer: (destination: string) => void;
    onColorChange: (color: string) => void;
    currentAccount: string | undefined;
}


export function CustomDialog(props: NftDetailProps): ReactElement {
    let {currentAccount, editing, nft, onClose, onColorChange, onOwn, onTransfer} = props;
    const [editedColor, setEditedColor] = useState<string>(nft.color);
    const [destination, setDestination] = useState<string>();
    let ownStatus: OwnStatus;
    if (nft.owner === currentAccount && currentAccount) {
        ownStatus = 'selfOwned'
    } else if (!nft.owner) {
        ownStatus = 'notOwned'
    } else {
        ownStatus = 'ownedByOther'
    }
    console.log(ownStatus)

    const handleChangeComplete = (color: ColorResult) => {
        console.log(color)
        if (ownStatus === 'selfOwned') {
            setEditedColor(color.hex)
        }
    }
    return (<ModalDialog {...props} style={{
        boxShadow: `inset  0px 0px 0px 10px ${editedColor}`,
        border: `ridge  ${editedColor} 0.6em `,
        borderRadius: '10px'
    }}>
        <Modal.Header closeButton>
            <Modal.Title>Nft #{nft.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body className={"p-3"}>
            <div className={"row my-3 align-items-center"}>
                <div className={"col"}>
                    {ownStatus === 'selfOwned' && "I'm owner of this nft"}
                    {ownStatus === 'notOwned' && !!currentAccount &&
                    <div className={"d-flex justify-content-center"}><Button disabled={editing} className={"w-100"}
                                                                             onClick={onOwn}>Own this Nft</Button>
                    </div>}
                    {ownStatus === 'ownedByOther' && `Nft is owned by ${nft.owner}`}
                </div>
                <div className={"col p-0 d-flex justify-content-center"}>
                    <MaterialPicker className={"p-0"} color={editedColor} onChangeComplete={handleChangeComplete}/>
                    {ownStatus === 'selfOwned' &&
                    <Button disabled={editedColor === nft.color} onClick={() => onColorChange(editedColor)}>Save
                        color</Button>}
                </div>
                {ownStatus === 'selfOwned' &&
                <div className={"row align-items-center"}>
                    <div className={"col-9"}>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Destination address</Form.Label>
                                <Form.Control type="text" aria-multiline={true} placeholder="Enter destination address"
                                              disabled={editing}
                                              onChange={(event) => setDestination(event.target.value)}/>
                                <Form.Text className="text-muted">
                                    The destination address of futur owner
                                </Form.Text>
                            </Form.Group>
                        </Form>
                    </div>
                    <div className={"col-3"}>
                        <Button disabled={editing || !destination}
                                onClick={event => destination && onTransfer(destination)}>Transfer</Button>
                    </div>
                </div>}
                {nft.uri &&
                <div className={"d-flex align-items-center"}>
                    <span className={"me-2"}>Token uri : </span>
                    <a href={nft.uri}>{nft.uri}</a>
                </div>
                }


            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={onClose}>
                Close
            </Button>
        </Modal.Footer>

    </ModalDialog>)
}

declare type OwnStatus = 'selfOwned' | 'notOwned' | 'ownedByOther';

export function NftDetail(props: NftDetailProps): ReactElement {
    return (
        <Modal show={true} onHide={props.onClose} dialogAs={(modalProps) => CustomDialog({...modalProps, ...props})}/>
    );
}
