let knnClassifier;
let featureExtractor;
let video;


const init = async () => {
  console.log('ml5 version:', ml5.version);

  knnClassifier = ml5.KNNClassifier();
  video = document.querySelector('.video');

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    video.srcObject = stream;
    video.play();
  } catch (error) {
    console.error('Fout bij het verkrijgen van toegang tot de webcam:', error);
  }

  

  featureExtractor = await ml5.featureExtractor('MobileNet', modelReady);
  featureExtractor.on = ('predict', resultHandler);

  const $addDataButton = document.querySelector('.addData');
  $addDataButton.addEventListener('click', addDataHandler);

  const $classifyButton = document.querySelector('.classify');
  $classifyButton.addEventListener('click', classifyHandler);

  const $saveButton = document.querySelector('.save');
  $saveButton.addEventListener('click', modelSaveHandler);
}

const classifyHandler = () => {
    const inputs = featureExtractor.infer(video);
    knnClassifier.classify(inputs, classifyResultHandler);
}

const classifyResultHandler = (error, result) => {
    if (error) return console.error(error);
    console.log(result.label);
    document.querySelector('.status').textContent = result.label;
}

const addDataHandler = () => {
    const label = document.querySelector('.label');
    const output = label.value;
    const inputs = featureExtractor.infer(video);
    knnClassifier.addExample(inputs, output);
    console.log('Gegevens toegevoegd:', inputs, output);

    if (output === '') {    
        document.querySelector('.status').textContent = 'Geen label ingevuld';
        //dont add it to the model
    } else {
        document.querySelector('.status').textContent = 'Gegevens toegevoegd';
    }
}



const resultHandler = (results) => {
    if (!results.length) return;

    inputs = results[0].landmarks.flat();
    console.log('Gegevens ingesteld:', inputs);
}

const modelReady = () => {
  console.log('Model is gereed.');
}

const modelSaveHandler = () => {
  if (knnClassifier) {
    knnClassifier.save('model.json', () => {
      console.log('Model opgeslagen.');
    });
  } else {
    console.error('KNNClassifier is niet gedefinieerd.');
  }
}

init();
