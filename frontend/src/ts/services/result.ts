import { SequenceServiceInstance } from './../utils/interfaces';

export default function (sequence: SequenceServiceInstance) {
    const $resultVideo = document.querySelector('#result-video')! as HTMLVideoElement;
    sequence.onIndex(0, reset);

    function setResult(result: Blob) {
        $resultVideo.src = URL.createObjectURL(result);
        sequence.goTo('result');
    }

    function reset() {
        $resultVideo.src = String();
    }

    return {
        setResult,
        reset
    };
}