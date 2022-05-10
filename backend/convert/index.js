const mime = require('mime');
const axios = require('axios').default;
const isUrl = require('is-url');
const { defaults, internal, error, assert } = require('./src/constants');
const createVideo = require('./src/video');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const {
        image,
        width = defaults.resolution.width,
        height = defaults.resolution.height,
        duration = defaults.duration
    } = (req.body || {});

    if (!image) {
        context.res = {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            },
            body: error('Missing "image" body parameter')
        };
        return context.done();
    }

    const imageBuffer = {
        data: null,
        type: null
    };

    if (isUrl(image)) {
        context.log('Downloading image from URL');
        const response = await axios.get(image, {
            responseType: 'arraybuffer'
        });

        imageBuffer.data = response.data;
        imageBuffer.type = mime.getExtension(response.headers['content-type']);
    } else {
        context.log('Parsing inline image');
        const [meta, data] = image.substring(5).split(',');
        const [contentType, encoding] = meta.split(';');

        imageBuffer.data = Buffer.from(data, encoding);
        imageBuffer.type = mime.getExtension(contentType);
    }

    const resolution = { width, height };

    try {
        assert({ duration, resolution });
    } catch (err) {
        context.res = {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            },
            body: error(err.message)
        };
        return context.done();
    }

    let video;

    context.log('Generating video');
    try {
        video = await createVideo(imageBuffer, resolution, duration);
    } catch (err) {
        context.res = {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: error(err.message)
        };
        return context.done();
    }

    context.res = {
        headers: {
            'Content-Type': 'application/json'
        },
        body: video,
        headers: {
            'Content-Type': mime.getType(internal.outputFormat),
            'Content-Length': video.length
        }
    };

    return context.done();
}