'use strict';

// Note that the bitwise operators and shift operators operate on 32-bit ints
// so in that case, the max safe integer is 2^31-1, or 2147483647
var VERY_LARGE_NUMBER = 2147483647;

Component({
  properties: {
    size: String,
    stepper: {
      type: Number,
      value: 1
    },
    min: {
      type: Number,
      value: 1
    },
    max: {
      type: Number,
      value: VERY_LARGE_NUMBER
    },
    step: {
      type: Number,
      value: 1
    },
    width: {
      type: String,
      value: ''
    },
    inputType: {
      type: String,
      value: ''
    }
  },

  methods: {
    handleZanStepperChange: function handleZanStepperChange(e, type) {
      var _e$currentTarget$data = e.currentTarget.dataset,
          dataset = _e$currentTarget$data === undefined ? {} : _e$currentTarget$data;
      var disabled = dataset.disabled;
      var step = this.data.step;
      var stepper = this.data.stepper;


      if (disabled) return null;

      if (type === 'minus') {
        stepper -= step;
      } else if (type === 'plus') {
        stepper += step;
      }
      this.triggerEvent('change', stepper);
      this.triggerEvent(type);
    },
    handleZanStepperMinus: function handleZanStepperMinus(e) {
      this.handleZanStepperChange(e, 'minus');
    },
    handleZanStepperPlus: function handleZanStepperPlus(e) {
      this.handleZanStepperChange(e, 'plus');
    },
    handleZanStepperFocus: function handleZanStepperFocus(e){
      this.triggerEvent("focus", true);
    },
    handleZanStepperInput: function handleZanStepperInput(e){
      var value = e.detail.value;
      this.triggerEvent("input", value);
    },
    handleZanStepperBlur: function handleZanStepperBlur(e) {
      var _this = this;

      var value = e.detail.value;
      var _data = this.data,
          min = _data.min,
          max = _data.max;


      if (!value) {
        setTimeout(function () {
          _this.triggerEvent('change', min);
        }, 16);
        return;
      }

      value = +value;
      if (value > max) {
        value = max;
      } else if (value < min) {
        value = min;
      }
      this.triggerEvent("focus",false);
      this.triggerEvent('change', value);
    }
  }
});