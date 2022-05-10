const fs = require('fs');
const { resolve } = require('path');
const { randomBytes } = require('crypto');
const TEMP_PATH = resolve(__dirname, '..', 'data', 'temp');

module.exports = function () {
    if (!fs.existsSync(TEMP_PATH)) fs.mkdirSync(TEMP_PATH, { recursive: true });

    function createFileId(extension) {
        return `${TEMP_PATH}/${randomBytes(32).toString('hex')}-${Date.now()}.tmp.${extension}`;
    }

    function createFile(data, extension) {
        const file = createFileId(extension);

        fs.writeFileSync(file, data);

        return file;
    }

    function writeToFile(id, data) {
        if (!fs.existsSync(id)) throw new Error(`File ${id} does not exist`);

        fs.writeFileSync(id, data);
    }

    function getFile(id) {
        if (!fs.existsSync(id)) throw new Error('File not found');

        return fs.readFileSync(id);
    }

    function deleteFile(id) {
        if (!fs.existsSync(id)) throw new Error('File not found');

        fs.unlinkSync(id);
    }

    return {
        createFileId,
        createFile,
        getFile,
        writeToFile,
        deleteFile
    };
}