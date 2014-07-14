define([
  'gui/GuiTR',
  'editor/Sculpt',
  'gui/GuiSculptingTools'
], function (TR, Sculpt, GuiSculptingTools) {

  'use strict';

  function GuiSculpting(guiParent, ctrlGui) {
    this.sculptgl_ = ctrlGui.sculptgl_; // main application
    this.sculpt_ = ctrlGui.sculptgl_.sculpt_; // sculpting management
    this.toolOnRelease_ = -1; // tool to apply when the mouse or the key is released

    this.ctrlSculpt_ = null; // sculpt controller
    this.ctrlSymmetry_ = null; // symmetry controller
    this.ctrlContinuous_ = null; // continuous controller
    this.ctrlRadius_ = null; // radius controller
    this.init(guiParent);
  }

  GuiSculpting.prototype = {
    /** Initialisculze */
    init: function (guiParent) {
      var self = this;
      var main = this.sculptgl_;
      // sculpt fold
      var foldSculpt = guiParent.addFolder(TR('sculptTitle'));
      var optionsSculpt = {};
      optionsSculpt[TR('sculptBrush')] = Sculpt.tool.BRUSH;
      optionsSculpt[TR('sculptInflate')] = Sculpt.tool.INFLATE;
      optionsSculpt[TR('sculptTwist')] = Sculpt.tool.TWIST;
      optionsSculpt[TR('sculptSmooth')] = Sculpt.tool.SMOOTH;
      optionsSculpt[TR('sculptFlatten')] = Sculpt.tool.FLATTEN;
      optionsSculpt[TR('sculptPinch')] = Sculpt.tool.PINCH;
      optionsSculpt[TR('sculptCrease')] = Sculpt.tool.CREASE;
      optionsSculpt[TR('sculptDrag')] = Sculpt.tool.DRAG;
      optionsSculpt[TR('sculptPaint')] = Sculpt.tool.PAINT;
      optionsSculpt[TR('sculptScale')] = Sculpt.tool.SCALE;
      optionsSculpt[TR('sculptTranslate')] = Sculpt.tool.TRANSLATE;
      optionsSculpt[TR('sculptRotate')] = Sculpt.tool.ROTATE;
      var dummy = {
        tool_: this.sculpt_.tool_
      };
      this.ctrlSculpt_ = foldSculpt.add(dummy, 'tool_', optionsSculpt).name(TR('sculptTool'));
      this.ctrlSculpt_.onChange(function (value) {
        self.onChangeTool(parseInt(value, 10));
      });
      this.ctrlSymmetry_ = foldSculpt.add(this.sculpt_, 'symmetry_').name(TR('sculptSymmetry'));
      this.ctrlSymmetry_.onChange(function () {
        main.scene_.render();
      });
      this.ctrlContinuous_ = foldSculpt.add(this.sculpt_, 'continuous_').name(TR('sculptContinuous'));
      this.ctrlRadius_ = foldSculpt.add(main.scene_.picking_, 'rDisplay_', 5, 200).name(TR('sculptRadius'));
      foldSculpt.open();

      this.initTool(Sculpt.tool.BRUSH, foldSculpt);
      this.initTool(Sculpt.tool.INFLATE, foldSculpt);
      this.initTool(Sculpt.tool.TWIST, foldSculpt);
      this.initTool(Sculpt.tool.SMOOTH, foldSculpt);
      this.initTool(Sculpt.tool.FLATTEN, foldSculpt);
      this.initTool(Sculpt.tool.PINCH, foldSculpt);
      this.initTool(Sculpt.tool.CREASE, foldSculpt);
      this.initTool(Sculpt.tool.DRAG, foldSculpt);
      this.initTool(Sculpt.tool.PAINT, foldSculpt);
      this.initTool(Sculpt.tool.SCALE, foldSculpt);
      this.initTool(Sculpt.tool.TRANSLATE, foldSculpt);
      this.initTool(Sculpt.tool.ROTATE, foldSculpt);

      GuiSculptingTools.show(this.sculpt_.tool_);
      this.addEvents();
    },
    /** Add events */
    addEvents: function () {
      var cbKeyDown = this.onKeyDown.bind(this);
      var cbKeyUp = this.onKeyUp.bind(this);
      var cbMouseUp = this.onMouseUp.bind(this);
      window.addEventListener('keydown', cbKeyDown, false);
      window.addEventListener('keyup', cbKeyUp, false);
      var canvas = document.getElementById('canvas');
      canvas.addEventListener('mouseup', cbMouseUp, false);
      canvas.addEventListener('mouseout', cbMouseUp, false);
      this.removeCallback = function () {
        window.removeEventListener('keydown', cbKeyDown, false);
        window.removeEventListener('keyup', cbKeyUp, false);
        canvas.removeEventListener('mouseup', cbMouseUp, false);
        canvas.removeEventListener('mouseout', cbMouseUp, false);
      };
    },
    /** Remove events */
    removeEvents: function () {
      if (this.removeCallback) this.removeCallback();
    },
    /** Key pressed event */
    onKeyDown: function (event) {
      if (event.handled === true)
        return;
      event.stopPropagation();
      if (!this.sculptgl_.focusGui_)
        event.preventDefault();
      var key = event.which;
      var ctrlSculpt = this.ctrlSculpt_;
      event.handled = true;
      if (this.sculptgl_.mouseButton_ !== 0)
        return;
      if (event.shiftKey && !event.altKey && !event.ctrlKey) {
        if (ctrlSculpt.getValue() === Sculpt.tool.SMOOTH)
          return;
        this.toolOnRelease_ = ctrlSculpt.getValue();
        ctrlSculpt.setValue(Sculpt.tool.SMOOTH);
        return;
      }
      switch (key) {
      case 48: // 0
      case 96: // NUMPAD 0
        ctrlSculpt.setValue(Sculpt.tool.SCALE);
        break;
      case 49: // 1
      case 97: // NUMPAD 1
        ctrlSculpt.setValue(Sculpt.tool.BRUSH);
        break;
      case 50: // 2
      case 98: // NUMPAD 2
        ctrlSculpt.setValue(Sculpt.tool.INFLATE);
        break;
      case 51: // 3
      case 99: // NUMPAD 3
        ctrlSculpt.setValue(Sculpt.tool.TWIST);
        break;
      case 52: // 4
      case 100: // NUMPAD 4
        ctrlSculpt.setValue(Sculpt.tool.SMOOTH);
        break;
      case 53: // 5
      case 101: // NUMPAD 5
        ctrlSculpt.setValue(Sculpt.tool.FLATTEN);
        break;
      case 54: // 6
      case 102: // NUMPAD 6
        ctrlSculpt.setValue(Sculpt.tool.PINCH);
        break;
      case 55: // 7
      case 103: // NUMPAD 7
        ctrlSculpt.setValue(Sculpt.tool.CREASE);
        break;
      case 56: // 8
      case 104: // NUMPAD 8
        ctrlSculpt.setValue(Sculpt.tool.DRAG);
        break;
      case 57: // 9
      case 105: // NUMPAD 9
        ctrlSculpt.setValue(Sculpt.tool.PAINT);
        break;
      case 78: // N
        var cur = GuiSculptingTools[ctrlSculpt.getValue()];
        if (cur.toggleNegative)
          cur.toggleNegative();
        break;
      default:
        event.handled = false;
      }
    },
    /** Key released event */
    onKeyUp: function () {
      if (this.sculptgl_.mouseButton_ === 0 && this.toolOnRelease_ !== -1) {
        this.ctrlSculpt_.setValue(this.toolOnRelease_);
        this.toolOnRelease_ = -1;
      }
    },
    /** Mouse released event */
    onMouseUp: function () {
      if (this.toolOnRelease_ !== -1) {
        this.ctrlSculpt_.setValue(this.toolOnRelease_);
        this.toolOnRelease_ = -1;
      }
    },
    /** Initialize tool */
    initTool: function (toolKey, foldSculpt) {
      GuiSculptingTools[toolKey].init(this.sculpt_.tools_[toolKey], foldSculpt);
      GuiSculptingTools.hide(toolKey);
    },
    /** When the sculpting tool is changed */
    onChangeTool: function (newValue) {
      var sculpt = this.sculptgl_.sculpt_;
      GuiSculptingTools.hide(sculpt.tool_);
      sculpt.tool_ = newValue;
      GuiSculptingTools.show(newValue);
      this.ctrlContinuous_.__li.hidden = this.sculpt_.allowPicking() === false;
      this.ctrlSymmetry_.__li.hidden = newValue === Sculpt.tool.TRANSLATE || newValue === Sculpt.tool.ROTATE;
    }
  };

  return GuiSculpting;
});