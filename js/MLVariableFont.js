/**
 *  MAIN CLASS
 *  SET SOME SLIDER TO CONTROL THE TITLE
 *  INITIATE THE SOUND LIBRARY FOR FFT CALCULATION
 *  CREATE A CUSTOM NEURAL NET TO CONTROL THE FONT
 *  INIT SOME LISTENER FOR CREATING A DATASET, TRAINING THE MODEL AND LAUNCH PREDICTION
 */
import Slider from "./Slider.js";
import NeuralNet from "./NeuralNet.js";
import SoundTool from "./SoundTool.js";

const PARAMS = [
  { name: "--custom-WMX2", range: [0, 1000] },
  { name: "--custom-TRMG", range: [0, 1000] },
  { name: "--custom-BLDA", range: [0, 1000] },
  { name: "--custom-TRMD", range: [0, 1000] },
  { name: "--custom-TRMC", range: [0, 1000] },
  { name: "--custom-SKLD", range: [0, 1000] },
  { name: "--custom-TRML", range: [0, 1000] },
  { name: "--custom-SKLA", range: [0, 1000] },
  { name: "--custom-TRMF", range: [0, 1000] },
  { name: "--custom-TRMK", range: [0, 1000] },
  { name: "--custom-BLDB", range: [0, 1000] },
  { name: "--custom-TRMB", range: [0, 1000] },
  { name: "--custom-TRMA", range: [0, 1000] },
  { name: "--custom-SKLB", range: [0, 1000] },
  { name: "--custom-TRME", range: [0, 1000] },
];
const FREQ = 1024;
const MESH_POINTS = 468 * 3;

class MLVariableFont {
  constructor() {
    this.handlers = {
      keydown: this.onkeydown.bind(this),
      // click: this.preset.bind(this),
      click: this.presetWithFaceMesh.bind(this),
      slide: this.onSlide.bind(this),
      modelReady: this.modelReady.bind(this),
      onPrediction: this.gotPrediction.bind(this),
    };

    this.controllers = [];
    // SLIDERS INITIALISATION
    for (const param of PARAMS) {
      const options = {
        min: param.range[0],
        max: param.range[1],
        step: 1,
        change: "input",
        param: param.name,
        callback: this.handlers.slide,
      };
      const slider = new Slider(0, options, document.getElementById("sliders"));
      this.controllers.push(slider);
    }

    let videoIsReady = false;
    this.meshColor = "rgb(0,0,255,0.3)";

    document.addEventListener("click", this.handlers.click);
    document.addEventListener("keydown", this.handlers.keydown);
  }

  presetWithFaceMesh() {
    /*
    INIT CAMERA 
    */
    if (!this.videoIsReady) {
      this.video = document.createElement("video");
      this.video_wrapper = document.getElementById("sound");
      this.video_wrapper.appendChild(this.video);
      this.canvas = document.createElement("canvas");
      this.ctx = this.canvas.getContext("2d");
      this.video_wrapper.appendChild(this.canvas);
      this.video.width = this.canvas.width = 640;
      this.video.height = this.canvas.height = 480;
      this.loadVideo();
      this.loadFaceMeshModel();
      //neural net
      this.modelIsTrained = false;
      this.customNeuraNet = new NeuralNet(MESH_POINTS, PARAMS.length);
    }
  }
  loadVideo() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        // this.video.src = window.URL.createObjectURL(stream);
        this.video.srcObject = stream;
        this.video.play();
        this.videoIsReady = true;
      });
    }
  }

  loadFaceMeshModel() {
    this.facemesh = ml5.facemesh(
      this.video,
      this.faceMeshModelReady.bind(this)
    );
  }

  faceMeshModelReady() {
    console.log("MODEL READY");
    this.facemesh.on("predict", (results) => {
      this.predictions = results;

      // console.log(this.predictions[0].scaledMesh.length);
      this.ctx.clearRect(0, 0, 640, 480);
      if (this.predictions[0]) {
        const data = this.predictions[0].scaledMesh.flat(1);
        if (this.recordMeshData) {
          // console.log(data.length);
          this.customNeuraNet.addData(data, this.target);
        }
        if (this.canPredict) {
          this.customNeuraNet.predict(data, this.handlers.onPrediction);
        }
        this.ctx.fillStyle = this.meshColor;
        this.predictions[0].scaledMesh.forEach((item, index) => {
          this.ctx.beginPath();
          this.ctx.arc(item[0], item[1], 2, 0, Math.PI * 2, false);
          this.ctx.fill();
          this.ctx.closePath();
        });
      }
    });
  }

  preset() {
    // sound
    Tone.context.resume();
    this.soundTool = new SoundTool(document.getElementById("sound"));
    this.soundTool.initAnalyser(FREQ);
    this.soundTool.getUserMedia();
    // SHOW THE FFT DATA ON SCREEN
    this.soundTool.start(true);
    //neural net
    this.modelIsTrained = false;
    this.customNeuraNet = new NeuralNet(FREQ, PARAMS.length);
    // this.customNeuraNet.loadModel(this.handlers.modelReady);
    document.removeEventListener("click", this.handlers.click);
  }

  modelReady() {
    this.modelIsTrained = true;
    this.canPredict = true;
    if (this.soundTool) {
      this.soundTool.color = "rgb(0,255,0,0.3)";
    } else {
      this.meshColor = "rgb(0,255,0,0.3)";
    }
    //  this.customNeuraNet.saveModel();
  }

  onkeydown(e) {
    if (e.keyCode == 13) {
      this.customNeuraNet.train(this.handlers.modelReady);
    }

    if (e.keyCode == 32) {
      /**
       * if the model is not trained yet
       * record all sliders values and add sound frequencies as input
       * for 6 seconds
       */
      if (!this.modelIsTrained) {
        // get all values
        this.target = {};
        for (let i = 0; i < this.controllers.length; i++) {
          const slider = this.controllers[i].slider;
          this.target[i] = parseInt(slider.value);
        }
        if (this.soundTool) {
          this.soundTool.color = "rgb(255,0,0,0.3)";
          // add data to the model
          this.soundTool.addEventListener("ondata", (data) => {
            this.customNeuraNet.addData(data, this.target);
          });

          // record data for 6 seconds
          setTimeout(() => {
            this.soundTool.removeEventListener("ondata");
            this.soundTool.color = "rgb(0,0,255,0.3)";
          }, 6000);
        } else {
          this.meshColor = "rgb(255,0,0,0.3)";
          this.recordMeshData = true;
          // record data for 6 seconds
          setTimeout(() => {
            this.recordMeshData = false;
            this.meshColor = "rgb(0,0,255,0.3)";
          }, 6000);
        }
      } else {
        /**
         * If the model is trained
         * predict the slider position base on the sound input
         */
        if (this.soundTool) {
          this.soundTool.addEventListener("ondata", (data) => {
            if (this.canPredict) {
              this.canPredict = false;
              this.customNeuraNet.predict(data, this.handlers.onPrediction);
            }
          });
        } else {
        }
      }
    }
  }
  /**
   *
   * @param {string} error error message if anything goes wrong
   * @param {array} result prediction results as array of predictions
   */
  gotPrediction(error, result) {
    if (error) {
      console.log(error);
      return;
    }
    /**
     * make the slider move
     * change the font parameters accordingly
     */
    for (let i = 0; i < result.length; i++) {
      const value = result[i].value;
      const slider = this.controllers[i].slider;
      slider.value = value;
      const param = slider.getAttribute("data-param");
      document.documentElement.style.setProperty(param, value);
    }
    this.canPredict = true;
  }

  onSlide(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    const param = e.target.getAttribute("data-param");
    const value = e.target.value;
    document.documentElement.style.setProperty(param, value);
  }
}

// START THE APP WHEN DOM IS LOADED
window.onload = () => {
  new MLVariableFont();
};
