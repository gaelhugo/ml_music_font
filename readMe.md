# ML Music Font

Simple implementation of [ML5.js](https://ml5js.org) used to control a variable font.
Using [TONE.JS](https://tonejs.github.io/) to handle audio data extraction through fft.
This example provides all necessary functions to create a model, add sound as input, train the model and run some predictions.
Everything happens in the browser, using [TENSORFLOW JS](https://www.tensorflow.org/js) behind the scene for all the machine learning infrastucture.

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

# Functions

Beside the sliders used to set the initial font parameters, there is 3 ways to interact with the experiment:

- If model is not trained yet, click on `spacebar`to record data for 6 seconds
- click on `enter` to train the model
- If model is trained, click on `spacebar`to listen and run the predictions
