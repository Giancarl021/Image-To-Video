import { EventCallback } from '../utils/interfaces';
const imageRegex = /image/i;

export default function createInputEvents(...callbacks: EventCallback[]) {
    async function fireCallbacks(image: string) {
        const promises: Promise<void>[] = [];
        for (const callback of callbacks) {
            promises.push(callback(image));
        }

        await Promise.all(promises);
    }

    async function onPaste(event: ClipboardEvent) {
        const [item] = (event.clipboardData?.files || []) as File[];

        if (!item || !imageRegex.test(item.type)) return;

        const imageUrl = await parseImage(item);

        await fireCallbacks(imageUrl);
    }

    async function onInput(this: HTMLInputElement) {
        const [file] = this.files && this.files.length ? Array.from(this.files) : [null]; 

        if (!file) return;

        const $label = this.parentElement?.querySelector('.file-name')! as HTMLSpanElement;

        if (!imageRegex.test(file.type)) {
            $label.style.color = 'hsl(348, 86%, 43%)';
            $label.textContent = 'File is not an image';

            this.files = null;

            return;
        }

        const imageUrl = URL.createObjectURL(file);

        await fireCallbacks(imageUrl);
    }

    async function onDrop(event: DragEvent) {
        preventEvent(event);
        const [file] = (event.dataTransfer?.files || []) as File[];

        if (!file || !imageRegex.test(file.type)) return;

        const imageUrl = await parseImage(file);

        await fireCallbacks(imageUrl);
    }

    async function preventEvent(event: Event) {
        event.stopPropagation();
        event.preventDefault();
    }

    async function parseImage(blob: Blob) {
        const reader = new FileReader();

        return await new Promise<string>((resolve, reject) => {
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

            reader.readAsDataURL(blob);
        });
    }

    return {
        onPaste,
        onInput,
        onDrop,
        preventEvent
    };
}