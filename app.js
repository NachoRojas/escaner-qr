window.addEventListener('load', async () => {
    const lectorCodigo = new ZXing.BrowserMultiFormatReader();
    const elementoVistaPrevia = document.getElementById('vista-previa');
    const elementoResultado = document.getElementById('resultado');
    const selectDispositivos = document.getElementById('dispositivos-entrada-video');
    const listaCodigos = document.getElementById('lista-codigos');
    const formDatos = document.getElementById('form-datos');
    const datosResultado = document.getElementById('datos-resultado');
    const codigosEscaneados = []; // Array para almacenar los códigos escaneados
    const delayMs = 1300; // 1.3 segundos de delay
    let escaneoActivo = true; // Bandera para controlar el estado del escaneo

    function agregarCodigoEscaneado(codigo) {
        codigosEscaneados.push(codigo);
        const li = document.createElement('li');
        li.textContent = codigo;
        listaCodigos.appendChild(li);
        elementoResultado.textContent = `Último código escaneado: ${codigo}`;
    }

    async function iniciarEscaneo(deviceId) {
        lectorCodigo.reset();
        lectorCodigo.decodeFromVideoDevice(deviceId, 'vista-previa', (resultado, error) => {
            if (resultado && escaneoActivo) {
                escaneoActivo = false; // Desactivar escaneo adicional
                agregarCodigoEscaneado(resultado.text);

                // Reiniciar el escaneo después del delay
                setTimeout(() => {
                    escaneoActivo = true; // Reactivar el escaneo
                }, delayMs);
            }
            if (error && !(error instanceof ZXing.NotFoundException)) {
                console.error('Error de decodificación:', error);
            }
        });
    }

    try {
        const dispositivos = await navigator.mediaDevices.enumerateDevices();
        const dispositivosEntradaVideo = dispositivos.filter(dispositivo => dispositivo.kind === 'videoinput');

        if (dispositivosEntradaVideo.length === 0) {
            throw new Error('No se encontraron dispositivos de entrada de video
