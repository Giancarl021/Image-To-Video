import Sequence from './sequence';

export default function () {
    const sequence = Sequence();
    const $container = document.getElementById('image-preview')! as HTMLElement;

    async function previewImage(image: string) {
        const imgHtml = generatePreviewImage(image);

        $container.innerHTML = imgHtml;

        sequence.goTo('preview');
    }
    
    function generatePreviewImage(image: string) {
        return `<img src="${image}" class="preview-img">`;
    }

    return {
        previewImage
    };
}