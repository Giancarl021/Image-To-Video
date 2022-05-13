export type EventCallback = (image: string) => Promise<void>;
export interface FormInternalItem {
    name: keyof FormInternal;
    element: HTMLInputElement;
    defaultValue: number;
    minimumValue: number;
    maximumValue: number;
}
export interface FormInternal {
    duration: FormInternalItem;
    width: FormInternalItem;
    height: FormInternalItem;
}

export interface SerializedForm {
    duration: number;
    width: number;
    height: number;
}

export type PreviewServiceMethodPreviewImage = (image: string) => void;
export type PreviewServiceMethodSetPreviewDimension = (width: number, height: number) => void;
export type PreviewService = () => PreviewServiceInstance;
export interface PreviewServiceInstance {
    previewImage: PreviewServiceMethodPreviewImage;
    setPreviewDimension: PreviewServiceMethodSetPreviewDimension;
}