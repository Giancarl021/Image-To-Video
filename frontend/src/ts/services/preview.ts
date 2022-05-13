import { PreviewService, SequenceServiceInstance } from '../utils/interfaces';
import constants from '../utils/constants';

export default (function (sequence: SequenceServiceInstance) {
    let _image: string | null;
    const $container = document.getElementById('image-preview')! as HTMLDivElement;

    async function previewImage(image: string) {
        _image = image;

        const imgHtml = generatePreviewImage(image);

        $container.innerHTML = imgHtml;

        sequence.goTo('preview');
        sequence.onIndex(0, setDefaultPreviewDimension);
    }
    
    function generatePreviewImage(image: string) {
        return `<img src="${image}" class="preview-img">`;
    }

    function setPreviewDimension(width: number, height: number) {
        $container.style.aspectRatio = `${width} / ${height}`;
    }

    function setDefaultPreviewDimension() {
        setPreviewDimension(constants.defaults.width, constants.defaults.height);
    }

    function getImage() {
        if (_image === null) throw new Error('No image has been set');

        return _image;
    }

    return {
        getImage,
        previewImage,
        setPreviewDimension
    };
}) as PreviewService;