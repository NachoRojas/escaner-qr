window.addEventListener('load', () => {
    const lectorCodigo = new ZXing.BrowserMultiFormatReader(); // Utilizamos BrowserMultiFormatReader para soportar múltiples formatos
    const elementoVistaPrevia = document.getElementById('vista-previa');
    const elementoResultado = document.getElementById('resultado');

    lectorCodigo.getVideoInputDevices()
        .then(dispositivosEntradaVideo => {
            let dispositivoFrontal = dispositivosEntradaVideo.find(dispositivo => dispositivo.label.toLowerCase().includes('front')) || dispositivosEntradaVideo[0];

            lectorCodigo.decodeFromVideoDevice(dispositivoFrontal.deviceId, 'vista-previa', (resultado, error) => {
                if (resultado) {
                    if (resultado.format === ZXing.BarcodeFormat.QR_CODE) {
                        if (resultado.text.startsWith('http')) {
                            window.location.href = resultado.text;
                        } else {
                            console.log('Contenido del QR:', resultado.text);
                        }
                    } else if (resultado.format === ZXing.BarcodeFormat.ITF) {
                        if (/^\d+$/.test(resultado.text)) { // Verificar si el contenido es numérico
                            elementoResultado.textContent = `Código de barras: ${resultado.text}`;
                        } else {
                            console.log('Código de barras Interleave 2 of 5:', resultado.text);
                        }
                    }
                }
                if (error && !(error instanceof ZXing.NotFoundException)) {
                    console.error(error);
                }
            });
        })
        .catch(error => console.error(error));
});
