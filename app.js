// Espera a que la página esté completamente cargada
window.addEventListener('load', () => {
    // Crea una instancia del lector de códigos QR
    const lectorCodigo = new ZXing.BrowserQRCodeReader();
    // Obtiene los elementos del DOM
    const elementoVistaPrevia = document.getElementById('vista-previa');
    const toggleCameraButton = document.getElementById('toggle-camera');

    let dispositivosEntradaVideo = [];
    let indiceCamaraActual = 0;

    // Función para iniciar el escaneo con la cámara seleccionada
    const iniciarEscaneo = (deviceId) => {
        lectorCodigo.decodeFromVideoDevice(deviceId, 'vista-previa', (resultado, error) => {
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
    };

    // Función para cambiar la cámara
    const cambiarCamara = () => {
        if (dispositivosEntradaVideo.length > 1) {
            indiceCamaraActual = (indiceCamaraActual + 1) % dispositivosEntradaVideo.length;
            lectorCodigo.reset(); // Reinicia el lector de códigos QR
            iniciarEscaneo(dispositivosEntradaVideo[indiceCamaraActual].deviceId); // Inicia el escaneo con la nueva cámara
        } else {
            console.log('Solo hay una cámara disponible o ninguna cámara.');
        }
    };

    // Obtiene los dispositivos de entrada de video disponibles
    lectorCodigo.getVideoInputDevices()
        .then(devices => {
            dispositivosEntradaVideo = devices;
            console.log('Dispositivos de entrada de video disponibles:', dispositivosEntradaVideo);
            if (dispositivosEntradaVideo.length === 0) {
                console.error('No hay dispositivos de video disponibles.');
                return;
            }

            // Buscar la cámara trasera por defecto
            let camaraTraseraId = dispositivosEntradaVideo[0].deviceId;
            dispositivosEntradaVideo.forEach((device, index) => {
                if (device.label.toLowerCase().includes('back') || device.label.toLowerCase().includes('rear')) {
                    camaraTraseraId = device.deviceId;
                    indiceCamaraActual = index;
                }
            });

            // Iniciar escaneo con la cámara seleccionada por defecto
            iniciarEscaneo(camaraTraseraId);

            // Agregar evento de clic para el botón de cambiar cámara
            toggleCameraButton.addEventListener('click', cambiarCamara);
        })
        .catch(error => console.error('Error al obtener dispositivos de video:', error));
});
