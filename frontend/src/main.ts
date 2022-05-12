import 'bulma';
import './scss/main.scss';

import createInputEvents from './ts/input-events';
import previewImage from './ts/preview';

const { onPaste } = createInputEvents(previewImage);

document.addEventListener('paste', onPaste);