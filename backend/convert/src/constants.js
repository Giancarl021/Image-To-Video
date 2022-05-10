const data = {
    defaults: {
        resolution: {
            width: 1920,
            height: 1080
        },
        duration: 15
    },

    maximum: {
        duration: 60,
        resolution: {
            width: 3840,
            height: 2160
        }
    },

    minimum: {
        duration: 1,
        resolution: {
            width: 480,
            height: 360
        }
    },
    internal: {
        outputFormat: 'mp4',
        videoCodec: 'libx264',
        pixelFormat: 'yuv420p'
    }
};

module.exports = {
    ...data,
    error(message) {
        return {
            error: message
        };
    },
    assert({ duration, resolution }) {
        if (duration < data.minimum.duration || duration > data.maximum.duration)
            throw new Error(`Duration must be between ${data.minimum.duration} and ${data.maximum.duration}`);

        if (resolution.width < data.minimum.resolution.width || resolution.width > data.maximum.resolution.width)
            throw new Error(`Width must be between ${data.minimum.resolution.width} and ${data.maximum.resolution.width}`);

        if (resolution.height < data.minimum.resolution.height || resolution.height > data.maximum.resolution.height)
            throw new Error(`Height must be between ${data.minimum.resolution.height} and ${data.maximum.resolution.height}`);
    }
};