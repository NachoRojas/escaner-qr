let currentFacingMode = "environment"; // Start with the rear camera

function onScanSuccess(decodedText, decodedResult) {
    document.getElementById('result').innerText = `Code scanned: ${decodedText}`;
}

function onScanFailure(error) {
    console.warn(`Code scan error: ${error}`);
}

function startScanner(facingMode) {
    if (html5QrCode.isScanning) {
        console.log("Stopping current scan...");
        html5QrCode.stop().then(() => {
            console.log("Stopped successfully, starting with new facing mode...");
            html5QrCode.start(
                { facingMode: facingMode },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 }
                },
                onScanSuccess,
                onScanFailure
            ).then(() => {
                console.log(`Started successfully with facing mode: ${facingMode}`);
            }).catch(err => {
                console.error(`Unable to start scanning, error: ${err}`);
            });
        }).catch(err => {
            console.error(`Unable to stop scanning, error: ${err}`);
        });
    } else {
        console.log("Starting scanner for the first time...");
        html5QrCode.start(
            { facingMode: facingMode },
            {
                fps: 10,
                qrbox: { width: 250, height: 250 }
            },
            onScanSuccess,
            onScanFailure
        ).then(() => {
            console.log(`Started successfully with facing mode: ${facingMode}`);
        }).catch(err => {
            console.error(`Unable to start scanning, error: ${err}`);
        });
    }
}

window.addEventListener('load', function() {
    html5QrCode = new Html5Qrcode("reader");

    console.log("Starting initial scanner...");
    startScanner(currentFacingMode);

    document.getElementById('switch-camera').addEventListener('click', function() {
        currentFacingMode = currentFacingMode === "environment" ? "user" : "environment";
        console.log(`Switching to ${currentFacingMode} camera...`);
        startScanner(currentFacingMode);
    });
});


