import { CanvasLabel, Group, Span } from '../canvaslabel';
const CanvasLabelPlugin = {
    install(Vue, options) {
        Vue.registerElement('CanvasLabel', () => CanvasLabel);
        Vue.registerElement('CSpan', () => Span);
        Vue.registerElement('CGroup', () => Group);
    },
};
export default CanvasLabelPlugin;
//# sourceMappingURL=index.mjs.map