window.addEventListener('load', async () => {
    const lectorCodigo = new ZXing.BrowserMultiFormatReader();
    const elementoVistaPrevia = document.getElementById('vista-previa');
    const elementoResultado = document.getElementById('resultado');
    const selectDispositivos = document.getElementById('dispositivos-entrada-video');
    const listaCodigos = document.getElementById('lista-codigos');
    const codigosEscaneados = []; // Array para almacenar los códigos escaneados
    const datosGuardados = []; // Array para almacenar los objetos con datos guardados
    const delayMs = 1300; // 1.3 segundos de delay
    let escaneoActivo = true; // Bandera para controlar el estado del escaneo
    let ultimoCodigoEscaneado = ''; // Variable para almacenar el último código escaneado

    function agregarCodigoEscaneado(codigo) {
        ultimoCodigoEscaneado = codigo;
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
            throw new Error('No se encontraron dispositivos de entrada de video.');
        }

        dispositivosEntradaVideo.forEach((dispositivo, indice) => {
            const option = document.createElement('option');
            option.value = dispositivo.deviceId;
            option.text = dispositivo.label || `Cámara ${indice + 1}`;
            selectDispositivos.appendChild(option);
        });

        // Intentar seleccionar automáticamente la cámara frontal en iOS
        const camaraFrontal = dispositivosEntradaVideo.find(dispositivo => dispositivo.label.toLowerCase().includes('front'));
        if (camaraFrontal) {
            iniciarEscaneo(camaraFrontal.deviceId);
            selectDispositivos.value = camaraFrontal.deviceId;
        } else {
            // Iniciar escaneo con el primer dispositivo disponible por defecto
            if (dispositivosEntradaVideo.length > 0) {
                iniciarEscaneo(dispositivosEntradaVideo[0].deviceId);
                selectDispositivos.value = dispositivosEntradaVideo[0].deviceId;
            }
        }

        selectDispositivos.addEventListener('change', (event) => {
            const deviceId = event.target.value;
            iniciarEscaneo(deviceId);
        });

    } catch (error) {
        console.error('Error al enumerar dispositivos:', error);
        elementoResultado.textContent = 'Error al enumerar dispositivos.';
    }

    // Formatear fecha mientras el usuario escribe
    const fechaInput = document.getElementById('fecha');
    fechaInput.addEventListener('input', () => {
        let input = fechaInput.value;

        // Eliminar cualquier carácter que no sea un dígito
        input = input.replace(/\D/g, '');

        // Insertar guiones en las posiciones correctas
        if (input.length > 2 && input.length <= 4) {
            input = `${input.slice(0, 2)}-${input.slice(2)}`;
        } else if (input.length > 4) {
            input = `${input.slice(0, 2)}-${input.slice(2, 4)}-${input.slice(4)}`;
        }

        fechaInput.value = input;
    });

    // Manejo del envío del formulario
    const formDatos = document.getElementById('form-datos');
    formDatos.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevenir el envío del formulario

        // Guardar los valores en variables separadas
        const fecha = document.getElementById('fecha').value;
        const hora = document.getElementById('hora').value;
        const unidad = document.getElementById('unidad').value;

        // Crear un nuevo objeto con los datos
        const nuevoObjeto = {
            codigo: ultimoCodigoEscaneado,
            fecha: fecha,
            hora: hora,
            unidad: unidad
        };

        // Guardar el objeto en el array datosGuardados
        datosGuardados.push(nuevoObjeto);

        // Imprimir todos los objetos guardados en la consola
        console.log('Datos guardados:', datosGuardados);

        // Mostrar el último conjunto de datos en el elemento datos-resultado
        const datosResultado = document.getElementById('datos-resultado');
        datosResultado.textContent = `Código: ${nuevoObjeto.codigo}, Fecha: ${nuevoObjeto.fecha}, Hora: ${nuevoObjeto.hora}, Unidad: ${nuevoObjeto.unidad}`;
    });
});
