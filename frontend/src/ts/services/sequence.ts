import { SequenceService } from "../utils/interfaces";

interface Callback {
    index: number;
    callback: () => void;
}

export default (function () {
    const $stages = Array.from(document.querySelectorAll('.stage'));
    const $prevButton = document.getElementById('prev-button')!;
    let index = $stages.findIndex($s => $s.classList.contains('--active'));
    const callbacks: Callback[] = [];

    $prevButton.addEventListener('click', prev);

    function next() {
        if (index === $stages.length - 1) return;

        $stages[index].classList.remove('--active');

        index++;

        $stages[index].classList.add('--active');
        
        checkPrevButton();
        checkCallbacks();
    }

    function prev() {
        if (index === 0) return;

        $stages[index].classList.remove('--active');

        index--;

        $stages[index].classList.add('--active');

        checkPrevButton();
        checkCallbacks();
    }

    function goTo(id: string) {
        const _index = $stages.findIndex($s => $s.id === id);

        if (_index === -1) return;

        $stages[index].classList.remove('--active');

        index = _index;

        $stages[index].classList.add('--active');

        checkPrevButton();
        checkCallbacks();
    }

    function onIndex(index: number, callback: () => void) {
        callbacks.push({
            index,
            callback
        });
    }

    function checkCallbacks() {
        callbacks
            .filter(callback => callback.index === index)
            .forEach(callback => callback.callback());
    }

    function checkPrevButton() {
        if (index === 0 || $stages[index].hasAttribute('data-no-prev')) {
            $prevButton.classList.add('--disabled');
        } else {
            $prevButton.classList.remove('--disabled');
        }
    }

    return {
        next,
        prev,
        goTo,
        onIndex
    };
}) as SequenceService;