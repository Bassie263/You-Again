const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let cv;

function onOpenCvReady() {
    cv = cv || window.cv;
    startColorDetection();
}

function setup() {
    // Initialiseren van de webcam
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        video.srcObject = stream;
        video.play();
    }).catch((error) => {
        console.error('Webcam toegang geweigerd: ', error);
    });

    // Wachten tot de video is geladen
    video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        startColorDetection();
    };
}

function startColorDetection() {
    if (!cv) {
        setTimeout(startColorDetection, 50);
        return;
    }

    const cap = new cv.VideoCapture(video);
    const frame = new cv.Mat(video.videoHeight, video.videoWidth, cv.CV_8UC4);

    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();

    const low = new cv.Scalar(0, 0, 0, 0);
    const high = new cv.Scalar(255, 255, 255, 255);

    const maxArea = -1; // Om alle vierkanten te detecteren

    function processVideo() {
        cap.read(frame);
        cv.cvtColor(frame, frame, cv.COLOR_RGBA2RGB);
        cv.cvtColor(frame, frame, cv.COLOR_RGB2HSV);
        cv.inRange(frame, low, high, frame);

        cv.findContours(frame, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

        for (let i = 0; i < contours.size(); i++) {
            const contour = contours.get(i);
            const area = cv.contourArea(contour, false);
            if (area > maxArea) {
                const rect = cv.boundingRect(contour);
                cv.rectangle(frame, rect, new cv.Scalar(255, 0, 0, 255), 2);

                // Voer hier je kleuranalyse uit op het vierkant, bijvoorbeeld door het gemiddelde te berekenen
                const squareROI = frame.roi(rect);
                const averageColor = cv.mean(squareROI);
                console.log('Gemiddelde kleur:', averageColor);

                squareROI.delete();
            }
            contour.delete();
        }

        cv.imshow(canvas, frame);
        frame.delete();
        contours.delete();
        hierarchy.delete();
        requestAnimationFrame(processVideo);
    }

    processVideo();
}

// Start de setup wanneer het venster geladen is
window.addEventListener('load', setup);
