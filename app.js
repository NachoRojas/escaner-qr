window.addEventListener('load', async () => {
    const lectorCodigo = new ZXing.BrowserQRCodeReader();
    const elementoVistaPrevia = document.getElementById('vista-previa');
    const toggleCameraButton = document.getElementById('toggle-camera');

    let dispositivosEntradaVideo = [2];
    let indiceCamaraActual = 0;

    const iniciarEscaneo = async (deviceId) => {
        try {
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
        dispositivosEntradaVideo = await lectorCodigo.getVideoInputDevices();
        if (dispositivosEntradaVideo.length === 0) {
            console.error('No hay dispositivos de video disponibles.');
            return;
        }

        let camaraTraseraId = dispositivosEntradaVideo[0].deviceId;
        dispositivosEntradaVideo.forEach((device, index) => {
            if (device.label.toLowerCase().includes('back') || device.label.toLowerCase().includes('rear')) {
                camaraTraseraId = device.deviceId;
                indiceCamaraActual = index;
            }
        });

        await iniciarEscaneo(camaraTraseraId);
        toggleCameraButton.addEventListener('click', cambiarCamara);
    } catch (error) {
        console.error('Error al obtener dispositivos de video:', error);
    }
});



