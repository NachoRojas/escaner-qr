window.addEventListener('load', () => {
    const lectorCodigo = new ZXing.BrowserQRCodeReader();
    const elementoVistaPrevia = document.getElementById('vista-previa');

    lectorCodigo.getVideoInputDevices()
        .then(dispositivosEntradaVideo => {
            let dispositivoFrontal = dispositivosEntradaVideo.find(dispositivo => dispositivo.label.toLowerCase().includes('front')) || dispositivosEntradaVideo[0];

            lectorCodigo.decodeFromVideoDevice(dispositivoFrontal.deviceId, 'vista-previa', (resultado, error) => {
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
