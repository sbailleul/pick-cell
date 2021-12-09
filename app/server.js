require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');
app.use(cors());
app.use(bodyParser.json())
const httpStatus = require('http-status-codes');

const getTokenFileName = (tokenId, extension) => {
    return `${tokenId}${extension}`
}
const getTokenPath = (tokenId, extension) => {
    return `./public/${getTokenFileName(tokenId, extension)}`
}


app.post(`/${process.env.REACT_APP_FILE_SERVER_JSON_PATH}/:tokenId`, async function (req, res) {
    try {
        await fs.promises.writeFile(getTokenPath(req.params.tokenId, '.json'), JSON.stringify(req.body),{flag: 'w'})
    } catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err)
    }
    return res.status(httpStatus.CREATED).json({filename: getTokenFileName(req.params.tokenId, '.json')});
});

app.delete(`/${process.env.REACT_APP_FILE_SERVER_JSON_PATH}/:tokenId`, async function (req, res) {
    try {
        await fs.promises.rm(getTokenPath(req.params.tokenId, '.json'));
    } catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err)
    }
    return res.sendStatus(httpStatus.NO_CONTENT);
});

app.post(`/${process.env.REACT_APP_FILE_SERVER_IMAGE_PATH}/:tokenId`, async function (req, res) {
    try {
        await fs.promises.writeFile(getTokenPath(req.params.tokenId, process.env.REACT_APP_TOKEN_IMAGE_EXTENSION), req.body.image)
    } catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err)
    }
    return res.status(httpStatus.CREATED).json({fileName: getTokenFileName(req.params.tokenId,  process.env.REACT_APP_FILE_SERVER_IMAGE_PATH)});
});

app.delete(`/${process.env.REACT_APP_FILE_SERVER_IMAGE_PATH}/:tokenId`, async function (req, res) {
    try {
        await fs.promises.rm(getTokenPath(req.params.tokenId, process.env.REACT_APP_TOKEN_IMAGE_EXTENSION));
    } catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err)
    }
    return res.sendStatus(httpStatus.NO_CONTENT);
});

app.listen(process.env.REACT_APP_FILE_SERVER_PORT, () => {
    console.log(`File server listen on port : ${process.env.REACT_APP_FILE_SERVER_PORT}`);
})
