let currentFacingMode = "environment"; // Start with the rear camera

function onScanSuccess(decodedText, decodedResult) {
    document.getElementById('result').innerText = `Code scanned: ${decodedText}`;
}

function onScanFailure(error) {
    console.warn(`Code scan error: ${error}`);
}

function startScanner(facingMode) {
    if (html5QrCode.isScanning) {
        html5QrCode.stop().then(() => {
            html5QrCode.start(
                { facingMode: facingMode },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 }
                },
                onScanSuccess,
                onScanFailure
            );
        }).catch(err => {
            console.error(`Unable to stop scanning, error: ${err}`);
        });
    } else {
        html5QrCode.start(
            { facingMode: facingMode },
            {
                fps: 10,
                qrbox: { width: 250, height: 250 }
            },
            onScanSuccess,
            onScanFailure
        ).catch(err => {
            console.error(`Unable to start scanning, error: ${err}`);
        });
    }
}

window.addEventListener('load', function() {
    html5QrCode = new Html5Qrcode("reader");

    startScanner(currentFacingMode);

    document.getElementById('switch-camera').addEventListener('click', function() {
        currentFacingMode = currentFacingMode === "environment" ? "user" : "environment";
        startScanner(currentFacingMode);
    });
});

