let currentCamera = 0;
let cameras = [];
let html5QrCode = new Html5Qrcode("reader");
let isScanning = false;

function onScanSuccess(decodedText, decodedResult) {
    document.getElementById('result').innerText = decodedText;
    isScanning = false;
    html5QrCode.stop();
}

function onScanFailure(error) {
    console.warn(`Código QR no detectado: ${error}`);
}

async function startScanner(cameraId) {
    try {
        await html5QrCode.start(
            { deviceId: { exact: cameraId } },
            { fps: 10, qrbox: { width: 250, height: 250 } },
            onScanSuccess,
            onScanFailure
        );
        isScanning = true;
    } catch (err) {
        console.error(`Error al iniciar la cámara: ${err}`);
    }
}

function switchCamera() {
    if (cameras.length > 1 && isScanning) {
        html5QrCode.stop().then(() => {
            currentCamera = (currentCamera + 1) % cameras.length;
            startScanner(cameras[currentCamera].deviceId);
        }).catch(err => {
            console.error(`Error al detener la cámara: ${err}`);
        });
    }
}

async function initCameras() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        cameras = devices.filter(device => device.kind === 'videoinput');
        if (cameras.length > 0) {
            startScanner(cameras[currentCamera].deviceId);
        } else {
            console.error("No se encontraron cámaras.");
        }
    } catch (err) {
        console.error(`Error al obtener dispositivos de medios: ${err}`);
    }
}

function startBarcodeScanner() {
    if (isScanning) {
        html5QrCode.stop();
    }
    Quagga.init({
        inputStream: {
            type: "LiveStream",
            target: document.querySelector('#reader'),
            constraints: {
                deviceId: cameras[currentCamera].deviceId,
                facingMode: "environment"
            }
        },
        decoder: {
            readers: ["interleaved_2_of_5_reader"]
        }
    }, function(err) {
        if (err) {
            console.error(err);
            return;
        }
        Quagga.start();
    });

    Quagga.onDetected(function(data) {
        document.getElementById('result').innerText = data.codeResult.code;
        Quagga.stop();
        isScanning = false;
    });
}

document.getElementById('switch-camera').addEventListener('click', switchCamera);
document.addEventListener('DOMContentLoaded', () => {
    initCameras();
    document.getElementById('reader').addEventListener('click', startBarcodeScanner);
});
