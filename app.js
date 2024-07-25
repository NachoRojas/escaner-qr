window.addEventListener('load', async () => {
    const lectorCodigo = new ZXing.BrowserMultiFormatReader();
    const elementoVistaPrevia = document.getElementById('vista-previa');
    const elementoResultado = document.getElementById('resultado');
    const selectDispositivos = document.getElementById('dispositivos-entrada-video');

    try {
        const dispositivos = await navigator.mediaDevices.enumerateDevices();
        const dispositivosEntradaVideo = dispositivos.filter(dispositivo => dispositivo.kind === 'videoinput');


        dispositivosEntradaVideo.forEach((dispositivo, indice) => {
            const option = document.createElement('option');
            option.value = dispositivo.deviceId;
            option.text = dispositivo.label || `Cámara ${indice + 1}`;
            selectDispositivos.appendChild(option);
        });

        selectDispositivos.addEventListener('change', (event) => {
            const deviceId = event.target.value;
            iniciarEscaneo(deviceId);
        });

        if (dispositivosEntradaVideo.length > 0) {
            iniciarEscaneo(dispositivosEntradaVideo[0].deviceId);
        }
    } catch (error) {
        console.error('Error al enumerar dispositivos:', error);
        elementoResultado.textContent = 'Error al enumerar dispositivos.';
    }

    async function iniciarEscaneo(deviceId) {
        lectorCodigo.reset();
        try {
            await lectorCodigo.decodeFromVideoDevice(deviceId, 'vista-previa', (resultado, error) => {
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
                    console.error('Error de decodificación:', error);
                }
            });
        } catch (error) {
            console.error('Error al iniciar escaneo:', error);
            elementoResultado.textContent = 'Error al iniciar escaneo.';
        }
    }
});

