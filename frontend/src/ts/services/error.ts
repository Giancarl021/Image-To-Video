import { SequenceServiceInstance, LooseObject } from './../utils/interfaces';
import hljs from 'highlight.js/lib/core';
import jsonLang from 'highlight.js/lib/languages/json';
import 'highlight.js/styles/github.css';

hljs.registerLanguage('json', jsonLang);

export default function (sequence: SequenceServiceInstance) {
    const $errorTitle = document.querySelector('#error-title')! as HTMLParagraphElement;
    const $errorBody = document.querySelector('#error-body')! as HTMLParagraphElement;
    const $button = document.querySelector('#error button')! as HTMLButtonElement;
    
    $button.addEventListener('click', eventHandler);

    function fireError(message: string, data: LooseObject) {
        $errorTitle.textContent = message;

        $errorBody.innerHTML = String();
        $errorBody.textContent = JSON.stringify(data, null, 2);

        hljs.highlightElement($errorBody);

        sequence.goTo('error');
    }

    function eventHandler() {
        sequence.goTo(0);
    }

    return {
        fireError
    };
}