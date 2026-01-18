import { MatrixVisualReplica } from "../../src/visual";
import powerbiVisualsApi from "powerbi-visuals-api";
import IVisualPlugin = powerbiVisualsApi.visuals.plugins.IVisualPlugin;
import VisualConstructorOptions = powerbiVisualsApi.extensibility.visual.VisualConstructorOptions;
import DialogConstructorOptions = powerbiVisualsApi.extensibility.visual.DialogConstructorOptions;
var powerbiKey: any = "powerbi";
var powerbi: any = window[powerbiKey];
var matrixVisualReplica1234567890ABCDEF: IVisualPlugin = {
    name: 'matrixVisualReplica1234567890ABCDEF',
    displayName: 'Matrix Visual Replica',
    class: 'MatrixVisualReplica',
    apiVersion: '5.10.0',
    create: (options?: VisualConstructorOptions) => {
        if (MatrixVisualReplica) {
            return new MatrixVisualReplica(options);
        }
        throw 'Visual instance not found';
    },
    createModalDialog: (dialogId: string, options: DialogConstructorOptions, initialState: object) => {
        const dialogRegistry = (<any>globalThis).dialogRegistry;
        if (dialogId in dialogRegistry) {
            new dialogRegistry[dialogId](options, initialState);
        }
    },
    custom: true
};
if (typeof powerbi !== "undefined") {
    powerbi.visuals = powerbi.visuals || {};
    powerbi.visuals.plugins = powerbi.visuals.plugins || {};
    powerbi.visuals.plugins["matrixVisualReplica1234567890ABCDEF"] = matrixVisualReplica1234567890ABCDEF;
}
export default matrixVisualReplica1234567890ABCDEF;