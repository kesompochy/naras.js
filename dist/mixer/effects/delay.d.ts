interface IDelayParams {
    interval: number;
    attenuation: number;
}
declare const defaultDelayParams: IDelayParams;
export { IDelayParams, defaultDelayParams };
export default class Delay {
    private _interval;
    private _attenuation;
    private _delayNode;
    private _attenuationNode;
    private _delaySwitch;
    private _realScale;
    constructor(input: AudioNode, params?: IDelayParams);
    set interval(value: number);
    get interval(): number;
    set attenuation(value: number);
    get attenuation(): number;
    set(interval: number, attenuation: number): void;
    set realScale(value: number);
    connect(output: AudioNode): void;
    disconnect(): void;
}
//# sourceMappingURL=delay.d.ts.map