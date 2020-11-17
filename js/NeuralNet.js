/**
 * CUSTOM BASIC NEURAL NET THANKS TO ML5
 *
 * AVAILABLE NEURAL NET : REGRESSION OR CLASSIFICATION
 */
import Utils from "./Utils.js";
export default class NeuralNet {
  /**
   *
   * @param {number} inputs size of inputs
   * @param {number} outputs size of outputs
   * @param {boolean} debug option to show the loss panel
   */
  constructor(inputs, outputs, debug = true) {
    // ML5 Custom neural net provides regression an classification
    // BIG DATA NEEDS SLOW learningRate
    const options = {
      task: "regression",
      debug: debug,
      inputs: inputs,
      outputs: outputs,
      learningRate: 0.001,
    };
    //Initialize your neural network
    this.nn = ml5.neuralNetwork(options);
    // ML5 issue WHEN adding data with values of zero
    // Let's prevent that
    Utils.fixDividedByZero(this.nn);
  }
  /**
   *
   * @param {objec} inputs
   * @param {object} values
   */
  addData(inputs, values) {
    this.nn.addData(inputs, values);
  }
  /**
   *
   * @param {function} callback function to be called when training is complete
   *
   */
  train(callback) {
    this.nn.normalizeData();
    //set some default training config
    const options = {
      epochs: 120,
      batchSize: 32,
    };
    this.nn.train(options, callback);
  }
  /**
   *
   * @param {object} inputs values to be predicted
   * @param {function} callback function to be called when prediction is complete
   */
  predict(inputs, callback, scope) {
    this.nn.predict(inputs, callback);
  }

  saveData() {
    this.nn.saveData();
  }
  loadData() {}
  saveModel() {
    this.nn.save();
  }
  loadModel(callback) {
    // const modelInfo = {
    //   model: "path/to/model.json",
    //   metadata: "path/to/model_meta.json",
    //   weights: "path/to/model.weights.bin",
    // };
    // this.nn.load(modelInfo, callback);
  }
}
