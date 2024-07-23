let selectedDeviceId;
const codeReader = new ZXing.BrowserMultiFormatReader();
let currentCamera = 0;
let videoInputDevices;

async function startScanner(deviceId) {
    const constraints = {
        video: {
            deviceId: { exact: deviceId }
        }
    };

    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        const videoElement = document.getElementById('video');
        videoElement.srcObject = stream;

        codeReader.decodeFromVideoElement(videoElement, (result, err) => {
            if (result) {
                document.getElementById('result').textContent = `Código escaneado: ${result.text}`;
            }
            if (err && !(err instanceof ZXing.NotFoundException)) {
                console.error(err);
                document.getElementById('result').textContent = `Error: ${err}`;
            }
        });
    } catch (err) {
        console.error('Error accessing camera: ', err);
    }
}

codeReader.listVideoInputDevices().then(devices => {
    videoInputDevices = devices;
    if (videoInputDevices.length > 0) {
        selectedDeviceId = videoInputDevices[currentCamera].deviceId;
        startScanner(selectedDeviceId);

        document.getElementById('toggle-camera').addEventListener('click', () => {
            currentCamera = (currentCamera + 1) % videoInputDevices.length;
            selectedDeviceId = videoInputDevices[currentCamera].deviceId;
            codeReader.reset();
            startScanner(selectedDeviceId);
        });
    } else {
        console.error('No se encontraron cámaras.');
    }
}).catch(err => console.error(err));

