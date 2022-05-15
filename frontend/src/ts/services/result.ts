import { SequenceServiceInstance } from './../utils/interfaces';

export default function (sequence: SequenceServiceInstance) {
    const $resultVideo = document.querySelector('#result-video')! as HTMLVideoElement;
    const $downloadLink = document.querySelector('#download-link')! as HTMLAnchorElement;
    const $downloadButton = document.querySelector('#download-button')! as HTMLButtonElement;
    const $resetButton = document.querySelector('#reset-button')! as HTMLButtonElement;

    $resetButton.addEventListener('click', () => sequence.goTo(0));
    $downloadButton.addEventListener('click', downloadResult);

    sequence.onIndex(0, reset);

    function setResult(result: Blob) {
        $resultVideo.src = URL.createObjectURL(result);
        sequence.goTo('result');
    }

    function reset() {
        $resultVideo.src = String();
    }

    function downloadResult() {
        if (!$resultVideo.src) return;

        $downloadLink.href = $resultVideo.src;
        // $downloadLink.download = 'result.mp4';
        $downloadLink.click();
    }

    return {
        setResult,
        reset,
        downloadResult
    };
}