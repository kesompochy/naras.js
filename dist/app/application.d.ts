import Master from './master';
import { MasterMixer } from '../mixer/mixer';
export default class App {
    loader: any;
    baseMixer: MasterMixer;
    private _unlockEvents;
    constructor();
    private _initContext;
    addResource(id: string, src: string): Master;
    loadAll(): void;
    loadThen(func: Function): void;
    get loaded(): boolean;
}
//# sourceMappingURL=application.d.ts.map