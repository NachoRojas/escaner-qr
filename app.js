window.addEventListener('load', () => {
    const lectorCodigo = new ZXing.BrowserMultiFormatReader(); // Utilizamos BrowserMultiFormatReader para soportar múltiples formatos
    const elementoVistaPrevia = document.getElementById('vista-previa');
    const elementoResultado = document.getElementById('resultado');

    lectorCodigo.getVideoInputDevices()
        .then(dispositivosEntradaVideo => {
            let dispositivoFrontal = dispositivosEntradaVideo.find(dispositivo => dispositivo.label.toLowerCase().includes('front')) || dispositivosEntradaVideo[0];

            lectorCodigo.decodeFromVideoDevice(dispositivoFrontal.deviceId, 'vista-previa', (resultado, error) => {
                if (resultado) {
                    if (resultado.text.startsWith('http')) {
                        window.location.href = resultado.text;
                    } else if (/^\d+$/.test(resultado.text)) { // Verificar si el contenido es numérico
                        elementoResultado.textContent = `Código de barras: ${resultado.text}`;
                    } else {
                        elementoResultado.textContent = `Contenido: ${resultado.text}`;
                    }
                }
                if (error && !(error instanceof ZXing.NotFoundException)) {
                    console.error(error);
                }
            });
        })
        .catch(error => console.error(error));
});
