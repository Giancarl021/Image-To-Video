import { FormInternal, FormInternalItem, FormResolution, PreviewServiceInstance, SerializedForm, FormResolutionItem, FormResolutionItemGenerator, Resolution, SequenceServiceInstance, FormCallback } from '../utils/interfaces';
import constants from '../utils/constants';

const formItems: (keyof FormInternal)[] = [ 'duration', 'width', 'height' ];
const formResolutionItems: (keyof FormResolution)[] = [ 'sd', 'hd', 'fhd', 'match' ];

export default function (preview: PreviewServiceInstance, sequence: SequenceServiceInstance) {
    const callbacks: FormCallback[] = [];
    const $form = document.querySelector('.controls')! as HTMLDivElement;
    const $resolutionOptions = document.querySelector('#resolution-options')! as HTMLDivElement;
    const $convertButton = document.querySelector('#convert-button')! as HTMLButtonElement;
    const $oddWarning = document.querySelector('#preview article')! as HTMLDivElement;

    const form = loadForm();
    const resolutionOptions = loadResolutionOptions();
    bindResolutionEvents(resolutionOptions);

    sequence.onIndex(0, reset);
    $convertButton.addEventListener('click', async () => {
        sequence.next();
        if (callbacks.length) await Promise.all(callbacks.map(cb => cb()));
    });

    function loadForm() {
        const data = {} as FormInternal;

        for (const item of formItems) {
            const element = $form.querySelector(`input#control-${item}`)! as HTMLInputElement;

            data[item] = {
                name: item,
                element,
                defaultValue: constants.defaults[item],
                minimumValue: Number(element.getAttribute('min')) || 0,
                maximumValue: Number(element.getAttribute('max')) || 0
            };

            createBoundaryEvents(data[item]);
        }

        return data;

        function createBoundaryEvents(item: FormInternalItem) {
            const updatePreview = formItems.slice(1).includes(item.name);

            item.element.addEventListener('change', () => {
                const value = Number(item.element.value);
    
                if (value < item.minimumValue || value > item.maximumValue)
                    item.element.value = item.defaultValue.toString();

                
                if (updatePreview) {
                    checkWarning();
                    firePreviewUpdate();
                }
            });
        }
    }

    function loadResolutionOptions() {
        const data = {} as FormResolution;

        for (const item of formResolutionItems) {
            const element = $resolutionOptions.querySelector(`button[data-resolution="${item}"`)! as HTMLButtonElement;
            
            const isDynamic = item === 'match';

            const property = isDynamic ? 'generator' : 'resolution';
            let value: Resolution | FormResolutionItemGenerator;

            switch (item) {
                case 'sd':
                    value = {
                        width: 720,
                        height: 480
                    };
                    break;

                case 'hd':
                    value = {
                        width: 1280,
                        height: 720
                    };
                    break;

                case 'fhd':
                    value = {
                        width: 1920,
                        height: 1080
                    };
                    break;

                case 'match':
                    value = async (image: string) => {
                        return new Promise((resolve, reject) => {
                            const img = new Image();
                            
                            img.addEventListener('load', () => {
                                const resolution = {
                                    width: img.width,
                                    height: img.height
                                };

                                if (resolution.width > resolution.height) {
                                    adjustWidth(resolution);
                                    adjustHeight(resolution);
                                } else {
                                    adjustHeight(resolution);
                                    adjustWidth(resolution);
                                }

                                return resolve(resolution);

                                function adjustWidth(resolution: Resolution) {
                                    if (resolution.width > form.width.maximumValue) {
                                        resolution.height = Math.round(resolution.height * form.width.maximumValue / resolution.width);
                                        resolution.width = form.width.maximumValue;
                                    } else if (resolution.width < form.width.minimumValue) {
                                        resolution.height = Math.round(resolution.width * form.width.minimumValue / resolution.width);
                                        resolution.width = form.width.minimumValue;
                                    }
                                }

                                function adjustHeight(resolution: Resolution) {
                                    if (resolution.height > form.height.maximumValue) {
                                        resolution.width = Math.round(resolution.width * form.height.maximumValue / resolution.height);
                                        resolution.height = form.height.maximumValue;
                                    } else if (resolution.height < form.height.minimumValue) {
                                        resolution.width = Math.round(resolution.width * form.height.minimumValue / resolution.height);
                                        resolution.height = form.height.minimumValue;
                                    }
                                }
                            });

                            img.addEventListener('error', reject);

                            img.src = image;
                        });
                    };
            }

            data[item] = {
                name: item,
                element,
                isDynamic,
                [property]: value
            } as FormResolutionItem;
        }

        return data;
    }

    function bindResolutionEvents(resolutionOptions: FormResolution) {
        for (const item of formResolutionItems) {
            const options = resolutionOptions[item];

            if (options.isDynamic) {
                options.element.addEventListener('click', async () => {
                    const resolution = await options.generator(preview.getImage());
                    setFormResolution(resolution);
                    preview.setPreviewDimension(resolution.width, resolution.height);
                });
            } else {
                options.element.addEventListener('click', () => {
                    setFormResolution(options.resolution);
                    preview.setPreviewDimension(options.resolution.width, options.resolution.height);
                });
            }
        }

        function setFormResolution(resolution: Resolution) {
            form.width.element.value = resolution.width.toString();
            form.height.element.value = resolution.height.toString();
            checkWarning();
        }
    }

    function firePreviewUpdate() {
        preview.setPreviewDimension(
            Number(form.width.element.value) || form.width.defaultValue,
            Number(form.height.element.value) || form.height.defaultValue
        );
    }

    function checkWarning() {
        if (Number(form.width.element.value) % 2 !== 0 || Number(form.height.element.value) % 2 !== 0) {
            $oddWarning.classList.remove('--disabled');
        }
    }

    function serialize() {
        const data = {} as SerializedForm;

        data.image = preview.getImage();

        for (const key in form) {
            const item = form[key as keyof FormInternal];
            data[key as keyof FormInternal] = Number(item.element.value) || item.defaultValue;
        }

        return data;
    }

    function reset() {
        $oddWarning.classList.add('--disabled');
        for (const key in form) {
            const item = form[key as keyof FormInternal];
            item.element.value = item.defaultValue.toString();
        }
    }

    function addCallback(callback: FormCallback) {
        callbacks.push(callback);
    }

    return {
        reset,
        serialize,
        addCallback
    };
}