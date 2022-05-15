import 'bulma';
import feather from 'feather-icons';
import './scss/main.scss';

import InputEvents from './ts/services/input-events';
import Sequence from './ts/services/sequence';
import Preview from './ts/services/preview';
import Form from './ts/services/form';
import ErrorPage from './ts/services/error';
import Result from './ts/services/result';

import Async from './ts/utils/async';

import constants from './ts/utils/constants';

async function main() {
    const sequence = Sequence();

    const preview = Preview(sequence);
    const form = Form(preview, sequence);
    const errorPage = ErrorPage(sequence);
    const result = Result(sequence);

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

    form.addCallback(async () => {
        let response: Response;
        try {
            response = await fetch(constants.api.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form.serialize())
            });

        } catch (err: unknown) {
            const _err = err as Error;
            errorPage.fireError('API Error', {
                error: _err.message
            });

            return;
        }

        if (response.status < 200 || response.status > 299) {
            let data: string | JSON | undefined = await response.text();

            try {
                data = JSON.parse(data);
            } catch {
                if (data === '') {
                    data = undefined;
                }
            }

            errorPage.fireError('API Error', {
                status: response.status,
                statusText: response.statusText,
                message: data
            });

            return;
        }

        const data = await response.blob();

        result.setResult(data);
    });
}

document.addEventListener('DOMContentLoaded', main);