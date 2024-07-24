window.addEventListener('load', () => {
    const lectorCodigo = new ZXing.BrowserMultiFormatReader();
    const elementoVistaPrevia = document.getElementById('vista-previa');
    const elementoResultado = document.getElementById('resultado');
    const botonCambiarCamara = document.getElementById('cambiar-camara');
    const elementoCantidadCamaras = document.getElementById('cantidad-camaras');
    let dispositivosEntradaVideo = [];
    let dispositivoActual = 0;

    // Verificar soporte de enumerateDevices
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        console.error("La enumeración de dispositivos no es compatible.");
        return;
    }

    function actualizarListaDispositivos() {
        navigator.mediaDevices.enumerateDevices()
            .then(dispositivos => {
                dispositivosEntradaVideo = dispositivos.filter(dispositivo => dispositivo.kind === 'videoinput');
                elementoCantidadCamaras.textContent = `Cámaras disponibles: ${dispositivosEntradaVideo.length}`;
                if (dispositivosEntradaVideo.length > 0) {
                    iniciarDecodificacion(dispositivosEntradaVideo[dispositivoActual].deviceId);
                }
            })
            .catch(error => console.error('Error al enumerar dispositivos: ', error));
    }

    navigator.mediaDevices.addEventListener('devicechange', actualizarListaDispositivos);

    // Obtener todos los dispositivos de entrada de video disponibles
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            stream.getTracks().forEach(track => track.stop()); // Detener la transmisión inicial
            actualizarListaDispositivos();
        })
        .catch(error => console.error('Error al obtener acceso a la cámara: ', error));

    // Cambiar la cámara al hacer clic en el botón
    botonCambiarCamara.addEventListener('click', () => {
        cambiarCamara();
    });

    function cambiarCamara() {
        if (dispositivosEntradaVideo.length > 1) {
            dispositivoActual = (dispositivoActual + 1) % dispositivosEntradaVideo.length;
            iniciarDecodificacion(dispositivosEntradaVideo[dispositivoActual].deviceId);
        }
    }

    function iniciarDecodificacion(deviceId) {
        // Detener la decodificación actual si hay alguna
        lectorCodigo.reset();
        if (elementoVistaPrevia.srcObject) {
            elementoVistaPrevia.srcObject.getTracks().forEach(track => track.stop());
        }

        navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: deviceId } } })
            .then(stream => {
                elementoVistaPrevia.srcObject = stream;
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
            })
            .catch(error => console.error('Error al obtener la transmisión de video: ', error));
    }
});
