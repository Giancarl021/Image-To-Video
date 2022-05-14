import 'bulma';
import feather from 'feather-icons';
import './scss/main.scss';

import InputEvents from './ts/services/input-events';
import Sequence from './ts/services/sequence';
import Preview from './ts/services/preview';
import Form from './ts/services/form';

import Async from './ts/utils/async';

async function main() {
    const sequence = Sequence();
    const preview = Preview(sequence);
    const form = Form(preview, sequence);

    const { onPaste, onInput, onDrop, preventEvent } = InputEvents(Async(preview.previewImage));
    
    feather.replace();

    const $input = document.querySelector('#input-file')! as HTMLInputElement;

    sequence.onIndex(0, () => {
        $input.value = String();
    });

    document.addEventListener('paste', onPaste);
    document.addEventListener('dragenter', preventEvent);
    document.addEventListener('dragexit', preventEvent);
    document.addEventListener('dragover', preventEvent);
    document.addEventListener('drop', onDrop);
    $input.addEventListener('change', onInput);
}

document.addEventListener('DOMContentLoaded', main);