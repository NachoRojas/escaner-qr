window.addEventListener('load', async () => {
    const lectorCodigo = new ZXing.BrowserQRCodeReader();
    const elementoVistaPrevia = document.getElementById('vista-previa');
    const toggleCameraButton = document.getElementById('toggle-camera');

    let dispositivosEntradaVideo = [];
    let indiceCamaraActual = 0;
    let currentStream = null;

    const obtenerDispositivos = async () => {
        dispositivosEntradaVideo = await navigator.mediaDevices.enumerateDevices();
        dispositivosEntradaVideo = dispositivosEntradaVideo.filter(device => device.kind === 'videoinput');
    };

    const iniciarEscaneo = async (deviceId) => {
        try {
            if (currentStream) {
                currentStream.getTracks().forEach(track => track.stop());
            }

            currentStream = await navigator.mediaDevices.getUserMedia({
                video: { deviceId: { exact: deviceId } }
            });

            elementoVistaPrevia.srcObject = currentStream;

            await lectorCodigo.decodeFromVideoDevice(deviceId, 'vista-previa', (resultado, error) => {
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
        } catch (error) {
            console.error('Error al iniciar el escaneo:', error);
        }
    };

    const cambiarCamara = async () => {
        if (dispositivosEntradaVideo.length > 1) {
            indiceCamaraActual = (indiceCamaraActual + 1) % dispositivosEntradaVideo.length;
            lectorCodigo.reset();
            await iniciarEscaneo(dispositivosEntradaVideo[indiceCamaraActual].deviceId);
        } else {
            console.log('Solo hay una cámara disponible o ninguna cámara.');
        }
    };

    try {
        await obtenerDispositivos();
        console.log('Dispositivos de entrada de video disponibles:', dispositivosEntradaVideo);

        if (dispositivosEntradaVideo.length === 0) {
            console.error('No hay dispositivos de video disponibles.');
            return;
        }

        const camaraInicial = dispositivosEntradaVideo[indiceCamaraActual].deviceId;
        await iniciarEscaneo(camaraInicial);

        toggleCameraButton.addEventListener('click', cambiarCamara);
    } catch (error) {
        console.error('Error al obtener dispositivos de video:', error);
    }
});
