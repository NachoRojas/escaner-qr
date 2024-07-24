window.addEventListener('load', () => {
    const lectorCodigo = new ZXing.BrowserMultiFormatReader();
    const elementoVistaPrevia = document.getElementById('vista-previa');
    const elementoResultado = document.getElementById('resultado');
    const botonCambiarCamara = document.getElementById('cambiar-camara');
    let dispositivosEntradaVideo = [4];
    let dispositivoActual = 0;

    lectorCodigo.getVideoInputDevices()
        .then(dispositivos => {
            dispositivosEntradaVideo = dispositivos;
            // Buscar la cámara trasera
            let dispositivoTrasero = dispositivosEntradaVideo.find(dispositivo => dispositivo.label.toLowerCase().includes('back')) || dispositivosEntradaVideo[0];
            dispositivoActual = dispositivosEntradaVideo.indexOf(dispositivoTrasero);
            iniciarDecodificacion(dispositivosEntradaVideo[dispositivoActual].deviceId);
        })
        .catch(error => console.error(error));

     function cambiarCamara() {
        dispositivoActual = (dispositivoActual + 1) % dispositivosEntradaVideo.length;
        if (streamActual) {
            const tracks = streamActual.getTracks();
            tracks.forEach(track => track.stop());
        }
        iniciarDecodificacion(dispositivosEntradaVideo[dispositivoActual].deviceId);
    }
    function iniciarDecodificacion(deviceId) {
        // Detener la decodificación actual si hay alguna
        lectorCodigo.reset();

        lectorCodigo.decodeFromVideoDevice(deviceId, 'vista-previa', (resultado, error) => {
            if (resultado) {
                if (resultado.text.startsWith('http')) {
                    window.location.href = resultado.text;
                } else if (/^\d+$/.test(resultado.text)) {
                    elementoResultado.textContent = `Código de barras: ${resultado.text}`;
                } else {
                    elementoResultado.textContent = `Contenido: ${resultado.text}`;
                }
                elementoResultado.style.display = 'block'; // Mostrar el resultado
            }
            if (error && !(error instanceof ZXing.NotFoundException)) {
                console.error(error);
            }
        });
    }
});
