const { execSync } = require('child_process');
const ffmpegPath = require('ffmpeg-static');
const { internal } = require('./constants');
const Temp = require('./temp');

const temp = Temp();

const ffmpeg = command => execSync(`${ffmpegPath} ${command}`, {
    stdio: 'inherit',
    encoding: 'utf8'
});

module.exports = async function ({ data, type }, resolution, duration) {
    const inputId = temp.createFile(data, type);
    const outputId = temp.createFileId(internal.outputFormat);

    if (resolution.width % 2 !== 0) {
        resolution.width++;
    }

    if (resolution.height % 2 !== 0) {
        resolution.height++;
    }

    try {
        ffmpeg(`-loop 1 -i "${inputId}" -c:v "${internal.videoCodec}" -t "${duration}" -pix_fmt "${internal.pixelFormat}" -vf "scale=${resolution.width}:${resolution.height}" "${outputId}"`);
    } catch (err) {
        temp.deleteFile(inputId);
        temp.deleteFile(outputId);

        throw err;
    }

    const output = temp.getFile(outputId);

    temp.deleteFile(inputId);
    temp.deleteFile(outputId);

    return output;
}