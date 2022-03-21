export default class Panner {
    private _pannerNode;
    private _position;
    constructor(x?: number, y?: number, z?: number);
    set x(value: number);
    get x(): number;
    set y(value: number);
    get y(): number;
    set z(value: number);
    get z(): number;
    set(x: number, y: number, z: number): Panner;
    get node(): PannerNode;
    connect(node: AudioNode): void;
}
//# sourceMappingURL=pan.d.ts.map