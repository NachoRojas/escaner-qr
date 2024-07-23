window.addEventListener('load', () => {
    const lectorCodigo = new ZXing.BrowserQRCodeReader();
    const elementoVistaPrevia = document.getElementById('vista-previa');

    lectorCodigo.getVideoInputDevices()
        .then(dispositivosEntradaVideo => {
            const primerDispositivoId = dispositivosEntradaVideo[0].deviceId;
            lectorCodigo.decodeFromVideoDevice(primerDispositivoId, 'vista-previa', (resultado, error) => {
                if (resultado) {
                    if (resultado.text.startsWith('http')) {
                        window.location.href = resultado.text;
                    } else {
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
