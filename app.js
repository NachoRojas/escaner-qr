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

    let fechaIngresada;
    let horaIngresada;
    let unidadIngresada;

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

    function esFechaValida(fecha) {
        const regex = /^\d{2}-\d{2}-\d{4}$/;
        if (!regex.test(fecha)) {
            return false;
        }
        const [dia, mes, año] = fecha.split('-').map(num => parseInt(num, 10));
        const date = new Date(año, mes - 1, dia);
        return date.getFullYear() === año && date.getMonth() === mes - 1 && date.getDate() === dia;
    }

    formDatos.addEventListener('submit', (event) => {
        event.preventDefault();
        const fecha = document.getElementById('fecha').value;
        const hora = document.getElementById('hora').value;
        const unidad = document.getElementById('unidad').value;

        if (!esFechaValida(fecha)) {
            datosResultado.textContent = 'Fecha inválida. Por favor, use el formato DD-MM-YYYY.';
            return;
        }

        // Guardar los datos ingresados en variables
        fechaIngresada = fecha;
        horaIngresada = hora;
        unidadIngresada = unidad;

        datosResultado.textContent = `Datos ingresados - Fecha: ${fechaIngresada}, Hora: ${horaIngresada}, Unidad: ${unidadIngresada}`;
    });

    try {
        const dispositivos = await navigator.mediaDevices.enumerateDevices();
        const dispositivosEntradaVideo = dispositivos.filter(dispositivo => dispositivo.kind === 'videoinput');

        if (dispositivosEntradaVideo.length === 0) {
            throw new Error('No se encontraron dispositivos de entrada de video.');
        }

        dispositivosEntradaVideo.forEach((dispositivo, indice) => {
            const option = document.createElement('option');
            option.value = dispositivo.deviceId;
            option.text = dispositivo.label || `Cámara ${indice + 1}`;
            selectDispositivos.appendChild(option);
        });

        // Iniciar escaneo con el primer dispositivo disponible por defecto
        if (dispositivosEntradaVideo.length > 0) {
            iniciarEscaneo(dispositivosEntradaVideo[0].deviceId);
            selectDispositivos.value = dispositivosEntradaVideo[0].deviceId;
        }

        selectDispositivos.addEventListener('change', (event) => {
            const deviceId = event.target.value;
            iniciarEscaneo(deviceId);
        });

    } catch (error) {
        console.error('Error al enumerar dispositivos:', error);
        elementoResultado.textContent = 'Error al enumerar dispositivos.';
    }
});
