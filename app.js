window.addEventListener('load', () => {
    const lectorCodigo = new ZXing.BrowserMultiFormatReader();
    const elementoVistaPrevia = document.getElementById('vista-previa');
    const elementoResultado = document.getElementById('resultado');
    const botonCambiarCamara = document.getElementById('cambiar-camara');
    let dispositivosEntradaVideo = [];
    let dispositivoActual = 0;

    lectorCodigo.getVideoInputDevices()
        .then(dispositivos => {
            dispositivosEntradaVideo = dispositivos;
            iniciarDecodificacion(dispositivosEntradaVideo[dispositivoActual].deviceId);
        })
        .catch(error => console.error(error));

    botonCambiarCamara.addEventListener('click', () => {
        dispositivoActual = (dispositivoActual + 1) % dispositivosEntradaVideo.length;
        iniciarDecodificacion(dispositivosEntradaVideo[dispositivoActual].deviceId);
    });

    function iniciarDecodificacion(deviceId) {
        lectorCodigo.decodeFromVideoDevice(deviceId, 'vista-previa', (resultado, error) => {
            if (resultado) {
                if (resultado.text.startsWith('http')) {
                    window.location.href = resultado.text;
                } else if (/^\d+$/.test(resultado.text)) {
                    elementoResultado.textContent = `Código de barras: ${resultado.text}`;
                } else {
                    elementoResultado.textContent = `Contenido: ${resultado.text}`;
                }
            }
            if (error && !(error instanceof ZXing.NotFoundException)) {
                console.error(error);
            }
        });
    }
});
