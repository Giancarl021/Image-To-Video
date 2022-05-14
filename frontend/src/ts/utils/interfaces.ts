export type EventCallback = (image: string) => Promise<void>;
export interface Resolution {
    width: number;
    height: number;
}
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

export type FormResolutionItemGenerator = (image: string) => Promise<Resolution>;
export type FormCallback = () => Promise<void>;
export type FormResolutionItem = {
    name: keyof FormResolution;
    element: HTMLButtonElement;
    resolution: Resolution;
    isDynamic: false;
} | {
    name: keyof FormResolution;
    element: HTMLButtonElement;
    isDynamic: true;
    generator: FormResolutionItemGenerator;
};

export interface FormResolution {
    sd: FormResolutionItem;
    hd: FormResolutionItem;
    fhd: FormResolutionItem;
    match: FormResolutionItem;
}

export interface SerializedForm {
    duration: number;
    width: number;
    height: number;
}

export type SequenceServiceMethodSimpleNavigation = () => void;
export type SequenceServiceMethodGoTo = (id: string) => void;
export type SequenceServiceMethodOnIndex = (index: number, callback: () => void) => void;
export type SequenceService = () => SequenceServiceInstance;
export interface SequenceServiceInstance {
    next: SequenceServiceMethodSimpleNavigation;
    prev: SequenceServiceMethodSimpleNavigation;
    goTo: SequenceServiceMethodGoTo;
    onIndex: SequenceServiceMethodOnIndex;
}

export type PreviewServiceMethodPreviewImage = (image: string) => void;
export type PreviewServiceMethodSetPreviewDimension = (width: number, height: number) => void;
export type PreviewServiceMethodGetImage = () => string;
export type PreviewService = (sequence: SequenceServiceInstance) => PreviewServiceInstance;
export interface PreviewServiceInstance {
    getImage: PreviewServiceMethodGetImage;
    previewImage: PreviewServiceMethodPreviewImage;
    setPreviewDimension: PreviewServiceMethodSetPreviewDimension;
    
}