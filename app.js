window.addEventListener('load', async () => {
    const lectorCodigo = new ZXing.BrowserMultiFormatReader();
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

            lectorCodigo.decodeFromVideoDevice(deviceId, 'vista-previa', (resultado, error) => {
                if (resultado) {
                    const tipoCodigo = resultado.getBarcodeFormat();
                    const textoCodigo = resultado.getText();
                    
                    if (tipoCodigo === ZXing.BarcodeFormat.QR_CODE) {
                        if (textoCodigo.startsWith('http')) {
                            window.location.href = textoCodigo;
                        } else {
                            console.log('Contenido del QR:', textoCodigo);
                        }
                    } else if (tipoCodigo === ZXing.BarcodeFormat.ITF) {
                        console.log('Contenido del código de barras Interleaved 2 of 5:', textoCodigo);
                    } else {
                        console.log(`Contenido del ${tipoCodigo}:`, textoCodigo);
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

