import 'bulma';
import feather from 'feather-icons';
import './scss/main.scss';

import InputEvents from './ts/input-events';
import Preview from './ts/view/preview';

async function main() {
    const preview = Preview();

    const { onPaste, onInput } = InputEvents(preview.previewImage);
    
    feather.replace();

    document.addEventListener('paste', onPaste);
    // document.addEventListener('drop', onDrop);
    document.getElementById('input-file')!.addEventListener('change', onInput);
}

document.addEventListener('DOMContentLoaded', main);