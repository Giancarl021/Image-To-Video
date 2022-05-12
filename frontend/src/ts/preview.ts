const $container = document.getElementById('previews')!;

export default async function previewImage(image: string) {
    const $img = generatePreviewImage(image);
    $container.innerHTML = $img.outerHTML;
}

function generatePreviewImage(image: string) {
    const $img = document.createElement('img');
    $img.src = image;
    $img.classList.add('preview-img');

    return $img;
}