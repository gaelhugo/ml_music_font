# CILEX TECH TALK: Musical controller for Variable Font with ML
Implementation of [ML5.js](https://ml5js.org) used to control a variable font.
Using [TONE.JS](https://tonejs.github.io/) to handle audio data extraction through fft.
This example provides all necessary functions to create a model, add sound as input, train the model and run some predictions.
Everything happens in the browser, using [TENSORFLOW JS](https://www.tensorflow.org/js) behnind the scene for all the machine learning infrastucture.

# Demo
Using [NODE JS](https://nodejs.org/) for local server (http-server)
```sh
$ npm i http-server
```
```sh
$ git clone https://github.com/gaelhugo/ml_music_font.git
$ cd ml_music_font
$ http-server
```

The goal of that demo is to use a custom NeuralNetwork model to control the complex graphical components of a variable font with music inputs.

# Functions
Beside the sliders used to set the initial font parameters, there is 3 ways to interact with the experiment:
  - If model is not trained yet, click on `spacebar`to record data for 6 seconds
  - click on `enter` to train the model
  - If model is trained, click on `spacebar`to listen and run the predictions

# Variable Fonts: detailed concept
Controlling a variable font is a bit different than regular css Rules.
First because the way a variable fonts work
As you can see, a variables font not only changes its weight and width, but the shape of each letter too.
That means that depending on css parameters, the drawing of the letter will adapt itself. 

![](https://onemore-studio.com/data/gifs/TYPOLabs_VariableFonts.gif)

To offer more transformation options, there are a bunch of custom parameters that can have an effect on the type. 
This custom parameters are called `AXIS`
We can have default predefined axis, such as `Weight`, `Width`, `Italic`, `Slant`, `Optical Size`. 
But a font designer can also add her/his own axis.

There is a python api to retrieve all available axis for a Variable Font:
```sh
$ pip install fonttools
$ ttx -t fvar /path/to/font.file
```

It will generate an XML file with all axis, and the parameters' range.

```xml
...
 <Axis>
  <AxisTag>GRAD</AxisTag>
  <Flags>0x0</Flags>
  <MinValue>88.0</MinValue>
  <DefaultValue>88.0</DefaultValue>
  <MaxValue>150.0</MaxValue>
  <AxisNameID>261</AxisNameID>
</Axis>
...
```

Once these parameters identified, it's easy to access them through simple css styling.


# CSS for Variable Fonts [(ref)](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Fonts/Variable_Fonts_Guide)

There is many ways to interact with variable font axis in css. A basic usage example: 
```css
/* Set the default values */
:root {
	--GRAD: 0;
}
/* Change value for these elements and their children */
.grade-light {
	--GRAD: -1;
}
/* Apply whatever value is kept in the CSS variables */

.grade-light {
    font-variation-settings:  'GRAD' var(--GRAD);
}
/* Animation option*/
@keyframes width-animation {
   from { --WDTH: 25; }
   to   { --WDTH: 151; }
}
```

Some [examples](https://pixelambacht.nl/2017/variable-hover-effects/) to see the difference with regular css modifications.

![](https://onemore-studio.com/data/gifs/Animating-in-Drawbot.gif)

# The font for the demo : [decovar](https://v-fonts.com/fonts/decovar)
![](https://www.onemore-studio.com/data/gifs/TN_OFV_decovar-title.gif)

```css
@font-face {
  font-family: "flex";
  src: url("../fonts/DecovarAlpha-VF.ttf");
}
```
```css
/* custom axis parameters. Initially set to 0 */
:root {
  --custom-WMX2: 0;
  --custom-TRMG: 0;
  --custom-BLDA: 0;
  --custom-TRMD: 0;
  --custom-TRMC: 0;
  --custom-SKLD: 0;
  --custom-TRML: 0;
  --custom-SKLA: 0;
  --custom-TRMF: 0;
  --custom-TRMK: 0;
  --custom-BLDB: 0;
  --custom-TRMB: 0;
  --custom-TRMA: 0;
  --custom-SKLB: 0;
  --custom-TRME: 0;
}
```
```css
h1 {
  font-family: "flex";
  font-variation-settings: "WMX2" var(--custom-WMX2), "TRMG" var(--custom-TRMG),
    "BLDA" var(--custom-BLDA), "TRMD" var(--custom-TRMD),
    "TRMC" var(--custom-TRMC), "SKLD" var(--custom-SKLD),
    "TRML" var(--custom-TRML), "SKLA" var(--custom-SKLA),
    "TRMF" var(--custom-TRMF), "TRMK" var(--custom-TRMK),
    "BLDB" var(--custom-BLDB), "TRMB" var(--custom-TRMB),
    "TRMA" var(--custom-TRMA), "SKLB" var(--custom-SKLB),
    "TRME" var(--custom-TRME);
}
```

# Machine Learning 
The ML part we are going to use for that demo relays on the javascript librairy [ML5.js](https://ml5js.org), a powerful tool based on [tensorflow.js](https://www.tensorflow.org/js), providing various wrappers, that make machine learning in the browser super easy to use.

![](https://ml5js.org/static/1552ab71e134d3f6aaed0c39fbc0b83c/4bad2/logo-purple-circle.png)

Library importation
```html
<script src="https://unpkg.com/ml5@0.5.0/dist/ml5.min.js"></script>
```

# ML5, key notions

ML5 is heavily inspired by [P5.js](https://p5js.org/) in a way that useful javascript functionnalities for creative coders have been wrapped in a "friendly" framework, that will handle all the "not-so-intuitive-js" part. `Ml5` does the same with tensorflow.js.

When it comes to build relatively complex machine learning structures, or how to choose a model and how to use it, `ML5` provides friendly access to pre-trained models and easy to use functions.

`ML5` comes with a preselected choice of models, ready to use, such as mobilenet (image vision), coco SSD (object detection), posenet (body segmentation), styletransfer and even "basic" gan like (pix2pix). (a good part of TFJS [models](https://www.tensorflow.org/js/models) have been wrapped in `ML5`)
Basically, `ML5` provide simple access to "not-so-simple" ML algorithms. With very few coding notion, it provides powerful functionnalities, from creating a model, to train a model and finally run predictions.

(ml5 sketchrnn cat model example)
![](https://www.onemore-studio.com/data/gifs/rnn2.gif)


It provides also some very useful function like [features extraction](https://learn.ml5js.org/#/reference/feature-extractor), [classification](https://learn.ml5js.org/#/reference/knn-classifier) and even custom [Neural Network](https://learn.ml5js.org/#/reference/neural-network) creation. 

# Ml5 NeuralNetwork 

There is actually 2 type of custom NeuralNet that have been simplified in `ML5`.
We can either do some classification or regression. The difference between these 2 tasks are the following:

CLASSIFICATION EXAMPLE
![](https://www.onemore-studio.com/data/gifs/1_36MELEhgZsPFuzlZvObnxA.gif)

REGRESSION EXAMPLE
![](https://www.onemore-studio.com/data/gifs/weights.gif)

To control a variable font, and generate unexpected variations in-between predictions, we are going to use the regression task in our model.

# ML5 logic to create a custom NeuralNetwork
- 1: identify/prepare some data to feed the NN
- 2: set your neural network options & initialize your neural network
- 3: add data to the neural network
- 4: normalize your data & train your neural network
- 5: use the trained model to make predictions

# Step 1 : inputs data : AUDIO data with Tone.js
For that demo we need to extract audio data from live sound input. To compute audio frequencies and get numerical values out of it, we use [Tone.js](https://tonejs.github.io/), a friendly javascript library to handle audio in the browser.

![](https://cdn.orangeable.com/img/javascript-equalizer.gif)

Library importation
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/tone/14.7.58/Tone.js"></script>
```
Object initialisation
```js
/**
* create an audio analyser object
* The FFT size affects the resolution of the resulting spectra.
* That value must be a power of two in the range 16 to 16384. 
*/
this.analyser = new Tone.Analyser({
      type: "fft",
      size: 1024,
    });
/* activate user microphone */
  let audSrc = new Tone.UserMedia();
    audSrc.connect(this.analyser);
    audSrc.open();
    
/* getting data in a loop */
let signal = this.analyser.getValue();
for (const [i, h] of signal.entries()) {
    //... values for each period of time
}
```
# Step 2 : set your Neural Network
```js
/*
* Here is simple settings to set a custom Neural Network with ML5
* task : method for prediction ("classification" || "regression")
* debug : show a information panel while training to see the loss evolution
* inputs : size of inputs data (can be an obect too)
* outputs: size of outputs
* learningRate: The amount that the weights are updated while training ()
*/
const options = {
      task: "regression",
      debug: true,
      inputs: 1024,
      outputs: 15,
      learningRate: 0.001,
    };
//Initialize your neural network
this.nn = ml5.neuralNetwork(options);
```
# Step 3 : add data to the Neural Network
![](https://i.pinimg.com/originals/87/26/98/872698f0a5af8c5a2cd5becf298a5534.gif)

For this demo, we are going to use live piano notes as input for our Neural Network. For each note added in the Network, corresponds a font state. The goal is to set several font settings for each note, so when we play them back, the font should retrieve a specific setting. And all values in-between would be interpretation of our Neural Network.
```js
/*
* ML5 function to record data
* inputs : array of numbers or object
* outputs: array of numbers
*/
this.nn.addData(inputs, outputs);
```
# Step 4 : train your neural network

Before being able to train your Network feed with values, we need to normalize the data. Here is an interesting [article](https://towardsdatascience.com/why-data-should-be-normalized-before-training-a-neural-network-c626b7f66c7d) about why is it important to normalize data before training.
```js
/*
* ML5 function to normalize data
* ML5 issue : all values needs to be at least once bigger than zero, otherwise normalisation fail
*/
this.nn.normalizeData();
```

Once datas have been normalized, we can train the model, with some options.
```js
/*
* ML5 function to train a model
* epochs : number total amount of passes through the dataset
* batchSize: number number of data samples processed before the model is updated
*/
const options = {
  epochs: 120,
  batchSize: 32,
};
this.nn.train(options, callback);
```
# - note about Batch Size and Epoch ([ref](https://machinelearningmastery.com/difference-between-a-batch-and-an-epoch/#:~:text=The%20number%20of%20epochs%20is%20the%20number%20of%20complete%20passes,value%20between%20one%20and%20infinity))
`What Is the Difference Between Batch and Epoch?`
The batch size is a number of samples processed before the model is updated.
The number of epochs is the number of complete passes through the training dataset.
The size of a batch must be more than or equal to one and less than or equal to the number of samples in the training dataset.

The number of epochs can be set to an integer value between one and infinity. You can run the algorithm for as long as you like and even stop it using other criteria besides a fixed number of epochs, such as a change (or lack of change) in model error over time.

They are both integer values and they are both hyperparameters for the learning algorithm, e.g. parameters for the learning process, not internal model parameters found by the learning process.

You must specify the batch size and number of epochs for a learning algorithm.

There are no magic rules for how to configure these parameters. You must try different values and see what works best for your problem.

# - ML5.js debug view

![](https://www.onemore-studio.com/data/gifs/debugPanel.png)

# Step 5: use the trained model 
When the model is ready, simply call the prediction for a selected input, the model will provide the desired outputs, depending on the pre-set amount. Predictions are received in a Promise, as an array of numbers.
```js
/*
* ML5 function to use the model when it has been set for "regression"
* If the model was set for "classification", the function would have been 
* this.nn.classify(inputs, callback);
* inputs : array of numbers or object
*/
this.nn.predict(inputs, callback);
```
In our demo, the output numbers are the desired value for each parameters for the variable font, so we simply assign each one of the prediction to a parameter to update the design of the font.

```js
/*
* Loop through all predicted values and update the css
*/
for (let i = 0; i < result.length; i++) {
  const value = result[i].value;
  const slider = this.controllers[i].slider;
  slider.value = value;
  const param = slider.getAttribute("data-param");
  document.documentElement.style.setProperty(param, value);
}
```
