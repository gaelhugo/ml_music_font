/**
 * Utils functions
 */
export default class Utils {
  /**
   *
   * @param {object} ML5NeuralNet ml5 neuralNetwork object
   */
  static fixDividedByZero(ML5NeuralNet) {
    // add 1 singlew insignificant datas to avoid any division by 0 when normalizing the datas
    ML5NeuralNet.addData(
      Utils.addSmallRandomValues(ML5NeuralNet.options.inputs, 0.01),
      Utils.addSmallRandomValues(ML5NeuralNet.options.outputs, 0.01)
    );
  }
  /**
   *
   * @param {number} labels number of entries with random value
   * @param {number} max maximum value to reach
   */
  static addSmallRandomValues(labels, max) {
    let scramble = {};
    let _labels = labels;
    if (typeof labels == "number") {
      _labels = [...Array(labels)].map((_, i) => `${i}`);
    }
    for (const label of _labels) {
      scramble[label] = Math.random() * max;
    }
    return scramble;
  }
}
