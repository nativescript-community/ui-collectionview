Object.defineProperty(exports, "__esModule", { value: true });
var canvaslabel_1 = require("../canvaslabel");
var CanvasLabelPlugin = {
    install: function (Vue, options) {
        Vue.registerElement('CanvasLabel', function () { return canvaslabel_1.CanvasLabel; });
        Vue.registerElement('CSpan', function () { return canvaslabel_1.Span; });
        Vue.registerElement('CGroup', function () { return canvaslabel_1.Group; });
    },
};
exports.default = CanvasLabelPlugin;
//# sourceMappingURL=index.js.map