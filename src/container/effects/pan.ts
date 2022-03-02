import Master from '../../app/master';

interface IPannerPosition{
    x: number;
    y: number;
    z: number;
}

const defaultPannerPosition: IPannerPosition = {
    x: 0,
    y: 0,
    z: 0
}

export default class Panner {
    private _pannerNode: PannerNode = Master.cxt.createPanner();
    private _position: IPannerPosition = defaultPannerPosition;
    constructor(x?: number, y?: number, z?: number){
        if(x) this.x = x;
        if(y) this.y = y;
        if(z) this.z = z;
    }
    set x(value: number){
        this._position.x = value;
        this._pannerNode.positionX.value = value;
    }
    get x(): number{
        return this._position.x;
    }
    set y(value: number){
        this._pannerNode.positionY.value = value;
        this._position.y = value;
    }
    get y(): number{
        return this._position.y;
    }
    set z(value: number){
        this._pannerNode.positionZ.value = value;
        this._position.z = value;
    }
    get z(): number{
        return this._position.z;
    }
    set(x: number, y: number, z: number): Panner{
        this.x = x;
        this.y = y;
        this.z = z;
        return  this;
    }
    get node(): PannerNode{
        return this._pannerNode;
    }
    connect(node: AudioNode){
        this._pannerNode.connect(node);
    }
}