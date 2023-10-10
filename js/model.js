let featureExtractor;
let regressor;
let $addDataBtn, $trainBtn, $classifyBtn;
let numSamples = 0;

const init = async () => {
    console.log('ml5 '+ ml5.version);


    const $video = document.querySelector('.video');
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    $video.srcObject = stream;
    $video.play();

    const options = {
        debug : true
    }

    featureExtractor = await ml5.featureExtractor('MobileNet', options, modelLoaded);
    regressor = await featureExtractor.regression($video, videoReady);


    const imageClassifier = ml5.imageClassifier('MobileNet', () => {
        console.log('Model Ready');

    });

    $addDataBtn = document.querySelector('.addData');
    $addDataBtn.addEventListener('click', addDataHandler);
    $addDataBtn.disabled = true;

    $trainBtn = document.querySelector('.trainModel');
    $trainBtn.addEventListener('click', startTraining);
    $trainBtn.disabled = true;



    
};


const modelLoaded = () => {
    document.querySelector('.status').textContent = 'Base model Mobilenet loaded';
    $addDataBtn.disabled = false;
  
};

const addDataHandler = () => {
    console.log('data added');document.querySelector('.status').textContent = `${++numSamples} samples added.`;
    if (numSamples > 0) {
      $trainBtn.disabled = false;
    }
};

const startTraining = () => {
    regressor.train(trainHandler)
}

trainHandler = (lossValue) => {
    if (lossValue) {
        document.querySelector('.status').textContent = `Loss: ${lossValue}`;
      } else {
        document.querySelector('.status').textContent = `Done training!`;
        $classifyBtn.disabled = false;
        $saveBtn.disabled = false;
      }
    }

const videoReady = () => {
    document.querySelector('.status').textContent = 'Video loaded';
  }

init();