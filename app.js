// Espera a que la página esté completamente cargada
window.addEventListener('load', () => {
    // Crea una instancia del lector de códigos QR
    const lectorCodigo = new ZXing.BrowserQRCodeReader();
    // Obtiene el elemento del video donde se mostrará la vista previa de la cámara
    const elementoVistaPrevia = document.getElementById('vista-previa');

    // Obtiene los dispositivos de entrada de video disponibles
    lectorCodigo.getVideoInputDevices()
        .then(dispositivosEntradaVideo => {
            const primerDispositivoId = dispositivosEntradaVideo[0].deviceId;
            lectorCodigo.decodeFromVideoDevice(primerDispositivoId, 'vista-previa', (resultado, error) => {
                if (resultado) {
                    // Si el contenido del código QR es una URL, redirige a esa URL
                    if (resultado.text.startsWith('http')) {
                        window.location.href = resultado.text;
                    } else {
                        // Si el contenido no es una URL, muestra el contenido en la consola
                        console.log('Contenido del QR:', resultado.text);
                    }
                }
                if (error && !(error instanceof ZXing.NotFoundException)) {
                    console.error(error);
                }
            });
        })
        .catch(error => console.error(error));
});
