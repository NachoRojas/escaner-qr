window.addEventListener('load', async () => {
    const lectorCodigo = new ZXing.BrowserQRCodeReader();
    const inputFile = document.getElementById('input-file');
    const canvas = document.getElementById('canvas');
    const contexto = canvas.getContext('2d');

    inputFile.addEventListener('change', async (event) => {
        const archivo = event.target.files[0];
        if (archivo) {
            const url = URL.createObjectURL(archivo);
            const img = new Image();
            img.src = url;

            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                contexto.drawImage(img, 0, 0, img.width, img.height);
                lectorCodigo.decodeFromCanvas(canvas).then((resultado) => {
                    if (resultado.text.startsWith('http')) {
                        window.location.href = resultado.text;
                    } else {
                        console.log('Contenido del QR:', resultado.text);
                    }
                }).catch((error) => {
                    console.error('Error al escanear el código QR:', error);
                });
            };
        }
    });
});
