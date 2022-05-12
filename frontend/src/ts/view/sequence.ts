export default function () {
    const $stages = Array.from(document.querySelectorAll('.stage'));
    const $prevButton = document.getElementById('prev-button')!;
    let index = $stages.findIndex($s => $s.classList.contains('--active'));

    $prevButton.addEventListener('click', prev);

    function next() {
        if (index === $stages.length - 1) return;

        $stages[index].classList.remove('--active');

        index++;

        $stages[index].classList.add('--active');
    }

    function prev() {
        if (index === 0) return;

        $stages[index].classList.remove('--active');
        
        index--;

        $stages[index].classList.add('--active');

        checkPrevButton();
    }

    function goTo(id: string) {
        const _index = $stages.findIndex($s => $s.id === id);

        if (_index === -1) return;

        $stages[index].classList.remove('--active');

        index = _index;

        $stages[index].classList.add('--active');

        checkPrevButton();
    }

    function checkPrevButton() {
        if (index === 0) {
            $prevButton.classList.add('--disabled');
        } else {
            $prevButton.classList.remove('--disabled');
        }
    }

    return {
        next,
        prev,
        goTo
    };
}