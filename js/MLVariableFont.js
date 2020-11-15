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

class MLVariableFont {
  constructor() {
    this.controllers = [];
    const params = [
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

    // SLIDERS INITIALISATION
    for (const param of params) {
      const options = {
        min: param.range[0],
        max: param.range[1],
        step: 1,
        change: "input",
        param: param.name,
        callback: this.onSlide.bind(this),
      };
      const slider = new Slider(0, options, document.getElementById("sliders"));
      this.controllers.push(slider);
    }

    // sound
    const freq = 1024;
    this.soundTool = new SoundTool(document.getElementById("sound"));
    this.soundTool.initAnalyser(freq);
    this.soundTool.getUserMedia();
    // SHOW THE FFT DATA ON SCREEN
    this.soundTool.start(true);

    //neural net
    this.modelIsTrained = false;
    //
    this.customNeuraNet = new NeuralNet(freq, params.length);
    document.addEventListener("keydown", this.onkeydown.bind(this));
  }

  onkeydown(e) {
    if (e.key == "Enter") {
      this.customNeuraNet.train(() => {
        this.modelIsTrained = true;
        this.canPredict = true;
        this.soundTool.color = "rgb(0,255,0,0.3)";
        console.log("model properly trained");
      });
    }

    if (e.keyCode == 32) {
      /**
       * if the model is not trained yet
       * record all sliders values and add sound frequencies as input
       * for 6 seconds
       */
      if (!this.modelIsTrained) {
        // get all values
        const target = {};
        for (let i = 0; i < this.controllers.length; i++) {
          const slider = this.controllers[i].slider;
          target[i] = parseInt(slider.value);
        }
        this.soundTool.color = "rgb(255,0,0,0.3)";
        // add data to the model
        this.soundTool.addEventListener("ondata", (data) => {
          this.customNeuraNet.addData(data, target);
        });

        // record data for 6 seconds
        setTimeout(() => {
          console.log("record done");
          this.soundTool.removeEventListener("ondata");
          this.soundTool.color = "rgb(0,0,255,0.3)";
        }, 6000);
      } else {
        /**
         * If the model is trained
         * predict the slider position base on the sound input
         */
        this.soundTool.addEventListener("ondata", (data) => {
          if (this.canPredict) {
            this.canPredict = false;
            this.customNeuraNet.predict(data, this.gotResult, this);
          }
        });
      }
    }
  }
  /**
   *
   * @param {string} error error message if anything goes wrong
   * @param {array} result prediction results as array of predictions
   */
  gotResult(error, result) {
    if (error) {
      console.log(error);
      return;
    }
    /**
     * make the slider move
     * change the font parameters accordingly
     */
    for (let i = 0; i < result.length; i++) {
      const param = result[i];
      const slider = this.controllers[i].slider;
      const value = param.value;

      slider.value = value;
      const _param = slider.getAttribute("data-param");
      document.documentElement.style.setProperty(_param, value);
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
