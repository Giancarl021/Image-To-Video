import { FormInternal, FormInternalItem, PreviewServiceInstance, SerializedForm } from './interfaces';

const formItems: (keyof FormInternal)[] = [ 'duration', 'width', 'height' ];

export default function (preview: PreviewServiceInstance) {
    const $form = document.querySelector('.controls')! as HTMLDivElement;
    const $resolutionOptions = document.querySelector('.resolution-options')! as HTMLDivElement;

    const form = loadForm();

    function loadForm() {
        const data = {} as FormInternal;

        for (const item of formItems) {
            const element = $form.querySelector(`input#control-${item}`)! as HTMLInputElement;

            data[item] = {
                name: item,
                element,
                defaultValue: Number(element.getAttribute('value')) || 0,
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

                if (updatePreview) firePreviewUpdate();
            });
        }
    }

    function firePreviewUpdate() {
        preview.setPreviewDimension(
            Number(form.width.element.value) || form.width.defaultValue,
            Number(form.height.element.value) || form.height.defaultValue
        );
    }

    function serialize() {
        const data = {} as SerializedForm;

        for (const key in form) {
            const item = form[key as keyof FormInternal];
            data[key as keyof FormInternal] = Number(item.element.value) || item.defaultValue;
        }

        return data;
    }

    function reset() {
        for (const key in form) {
            const item = form[key as keyof FormInternal];
            item.element.value = item.defaultValue.toString();
        }
    }

    return {
        reset,
        serialize
    };
}