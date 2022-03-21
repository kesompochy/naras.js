import Delay from './effects/delay';
import Panner from './effects/pan';
import { IDelayParams } from './effects/delay';
interface IPannerParams {
    x?: number;
    y?: number;
    z?: number;
}
export interface IMixerOptions {
    volume?: number;
    loop?: boolean;
    scale?: number;
    delay?: IDelayParams;
    useDelay?: boolean;
    panner?: IPannerParams;
}
export declare const defaultOptions: IMixerOptions;
export default class Mixer {
    protected _cxt: AudioContext;
    protected _inputNode: AudioNode;
    protected _gainNode: GainNode;
    private _delay;
    private _panner;
    private _volume;
    protected _scale: number;
    private _useDelay;
    protected _duration: number;
    protected _playedTime: number;
    protected _startedTime: number;
    private _position;
    set position(value: number);
    get position(): number;
    readonly children: Set<Mixer>;
    parent: Mixer | undefined;
    protected readonly isSound: boolean;
    constructor(options?: IMixerOptions);
    set useDelay(flag: boolean);
    get useDelay(): boolean;
    get delay(): Delay;
    addChildren(...ary: Mixer[]): void;
    addChild(obj: Mixer): void;
    removeChild(child: Mixer): void;
    protected connect(mixer: Mixer): void;
    protected disconnect(): void;
    protected _playPosition: number;
    protected _playScale: number;
    set playScale(value: number);
    get playScale(): number;
    play(): void;
    stop(): void;
    pause(): void;
    restart(): void;
    private _propagateOrder;
    private _calcPlayPosition;
    private _calcPlayScale;
    playAction: Function;
    stopAction: Function;
    pauseAction: Function;
    restartAction: Function;
    get duration(): number;
    set volume(value: number);
    get volume(): number;
    set scale(value: number);
    get scale(): number;
    get panner(): Panner;
}
export declare class MasterMixer extends Mixer {
    constructor();
}
export {};
//# sourceMappingURL=mixer.d.ts.map