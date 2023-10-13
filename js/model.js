let knnClassifier;
let inputs;
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
    knnClassifier.classify(inputs, classifyResultHandler);
}

const classifyResultHandler = (error, result) => {
  if (error) {
    console.error('Fout bij classificeren:', error);
  } else {
    console.log('Classificatie resultaat:', result);
    document.querySelector('.status').textContent = result.label;
  }
}

const addDataHandler = () => {
  const label = document.querySelector('.label');
  const output = label.value;
  knnClassifier.addExample = (inputs, output);
    console.log('Gegevens toegevoegd:', inputs, output);

}

const resultHandler = (results) => {
    if (!results.length) return;

    inputs = results[0].landmarks.flat();
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
