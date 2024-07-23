// Espera a que la página esté completamente cargada
window.addEventListener('load', () => {
    // Crea una instancia del lector de códigos QR
    const lectorCodigo = new ZXing.BrowserQRCodeReader();
    // Obtiene los elementos del DOM
    const elementoVistaPrevia = document.getElementById('vista-previa');
    const cameraSelect = document.getElementById('camera-select');

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

    // Obtiene los dispositivos de entrada de video disponibles
    lectorCodigo.getVideoInputDevices()
        .then(dispositivosEntradaVideo => {
            // Poblar la lista desplegable con las cámaras disponibles
            dispositivosEntradaVideo.forEach((dispositivo, indice) => {
                const opcion = document.createElement('option');
                opcion.value = dispositivo.deviceId;
                opcion.text = dispositivo.label || `Camera ${indice + 1}`;
                cameraSelect.appendChild(opcion);
            });

            // Iniciar escaneo con la cámara seleccionada por defecto (la primera)
            if (dispositivosEntradaVideo.length > 0) {
                iniciarEscaneo(dispositivosEntradaVideo[0].deviceId);
            }

            // Cambiar la cámara cuando el usuario selecciona una diferente
            cameraSelect.addEventListener('change', () => {
                lectorCodigo.reset(); // Reinicia el lector de códigos QR
                iniciarEscaneo(cameraSelect.value); // Inicia el escaneo con la nueva cámara
            });
        })
        .catch(error => console.error(error));
});
