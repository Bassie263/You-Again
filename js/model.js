let knnClassifier;
let inputs;
let featureExtractor;

const init = async () => {
  console.log('ml5 version:', ml5.version);
  //document.body.append(document.createTextNode(ml5.version));

  knnClassifier = ml5.KNNClassifier();


  const $video = document.querySelector('.video');
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  $video.srcObject = stream;
  $video.play();

  const color = await ml5.featureExtractor('MobileNet', modelReady);
  const features = featureExtractor
  const $label = document.querySelector('.label');


  const $addDataButton = document.querySelector('.addData');
  $addDataButton.addEventListener('click', addDataHandler);

  const $classifyButton = document.querySelector('.classify');
  $classifyButton.addEventListener('click', classifyHandler);
}


const classifyHandler = () => {
  knnClassifier.classify(inputs, classifyResultHandler);
}


const classifyResultHandler = (error, result) => {
  if (error) return console.error(error);
  console.log(result);
  document.querySelector('.status').textContent = result.label;
}


const addDataHandler = () => {
  const $label = document.querySelector('.label');
  const output = $label.value;
  knnClassifier.addExample(inputs, output);
}


const resultHandler = (results) => {
  if (!results.length) return;

  inputs = results[0].landmarks.flat();
  console.log(inputs);
}


const modelReady = () => {
  console.log("model loaded");
}

init();