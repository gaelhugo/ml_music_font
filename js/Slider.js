/**
 * Default slider class
 */
export default class Slider {
  /**
   *
   * @param {number} value default value for the slider
   * @param {object} options various options for the slider
   * @param {HTMLNode} wrapper parent html node for the slider
   */
  constructor(value, options, wrapper = null) {
    this.slider = document.createElement("input");
    this.slider.type = "range";
    this.slider.min = options.min;
    this.slider.max = options.max;
    this.slider.step = options.step;
    this.slider.value = value;
    this.slider.setAttribute("data-param", options.param);
    wrapper.appendChild(this.slider);
    this.slider.addEventListener(options.change, options.callback);
  }
}
