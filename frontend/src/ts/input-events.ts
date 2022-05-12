import { EventCallback } from './interfaces';
const imageRegex = /image/i;

export default function createInputEvents(...callbacks: EventCallback[]) {
    async function onPaste(event: ClipboardEvent) {
        const items = (event.clipboardData?.files || []);

        if (!items.length) return;

        const images = [];

        for (let i = 0; i < items.length; i++) {
            const blob = items[i];

            if (!blob || !imageRegex.test(blob.type)) continue;

            images.push(blob);
        }

        for (const image of images) {
            const reader = new FileReader();
            let imageUrl: string;
            try {
                imageUrl = await new Promise<string>((resolve, reject) => {
                    reader.onload = event => {
                        const result = event.target?.result as string;
                        if (!result) return reject(new Error('No result from Image Blob'));

                        return resolve(result);
                    };

                    reader.onerror = event => {
                        const error = event.target?.error;
                        if (!error) return reject(new Error('Unknown error from Image Blob'));

                        return reject(error);
                    }

                    reader.readAsDataURL(image);
                });

                callbacks.map(cb => cb(imageUrl));
            } catch (error) {
                console.error(error);
                continue;
            }
        }
    }

    return {
        onPaste
    };
}