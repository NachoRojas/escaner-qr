// Espera a que la página esté completamente cargada
window.addEventListener('load', async () => {
    // Crea una instancia del lector de códigos QR
    const lectorCodigo = new ZXing.BrowserQRCodeReader();
    // Obtiene los elementos del DOM
    const elementoVistaPrevia = document.getElementById('vista-previa');
    const toggleCameraButton = document.getElementById('toggle-camera');

    let dispositivosEntradaVideo = [];
    let indiceCamaraActual = 0;

    // Función para iniciar el escaneo con la cámara seleccionada
    const iniciarEscaneo = async (deviceId) => {
        try {
            console.log(`Iniciando escaneo con la cámara: ${deviceId}`);
            await lectorCodigo.decodeFromVideoDevice(deviceId, 'vista-previa', (resultado, error) => {
                if (resultado) {
                    // Si el contenido del código QR es una URL, redirige a esa URL
                    if (resultado.text.startsWith('http')) {
                        window.location.href = resultado.text;
                    } else {
                        // Si el contenido no es una URL, muestra el contenido en la consola
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

    // Función para cambiar la cámara
    const cambiarCamara = async () => {
        if (dispositivosEntradaVideo.length > 1) {
            indiceCamaraActual = (indiceCamaraActual + 1) % dispositivosEntradaVideo.length;
            lectorCodigo.reset(); // Reinicia el lector de códigos QR
            console.log(`Cambiando a la cámara: ${dispositivosEntradaVideo[indiceCamaraActual].label}`);
            await iniciarEscaneo(dispositivosEntradaVideo[indiceCamaraActual].deviceId); // Inicia el escaneo con la nueva cámara
        } else {
            console.log('Solo hay una cámara disponible o ninguna cámara.');
        }
    };

    try {
        // Obtiene los dispositivos de entrada de video disponibles
        dispositivosEntradaVideo = await lectorCodigo.getVideoInputDevices();
        console.log('Dispositivos de entrada de video disponibles:', dispositivosEntradaVideo);

        if (dispositivosEntradaVideo.length === 0) {
            console.error('No hay dispositivos de video disponibles.');
            return;
        }

        // Buscar la cámara trasera por defecto
        const camaraTrasera = dispositivosEntradaVideo.find((device, index) => {
            if (device.label.toLowerCase().includes('back') || device.label.toLowerCase().includes('rear')) {
                indiceCamaraActual = index;
                return true;
            }
            return false;
        });

        // Si no se encuentra una cámara trasera, usar la primera disponible
        const camaraInicial = camaraTrasera ? dispositivosEntradaVideo[indiceCamaraActual].deviceId : dispositivosEntradaVideo[0].deviceId;

        // Iniciar escaneo con la cámara seleccionada por defecto
        await iniciarEscaneo(camaraInicial);

        // Agregar evento de clic para el botón de cambiar cámara
        toggleCameraButton.addEventListener('click', cambiarCamara);
    } catch (error) {
        console.error('Error al obtener dispositivos de video:', error);
    }
});
