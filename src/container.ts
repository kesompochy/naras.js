import Master from './master';

abstract class AbstractSounder {
    protected abstract playFunc: Function;
    protected abstract stopFunc: Function;
    protected abstract pauseFunc: Function;
    protected abstract restartFunc: Function;
}




export interface IOptions {
    volume?: number;
    loop?: boolean;
    pitch?: number;
    delay?: IDelayParams | null;
}


export const defaultOptions: IOptions = {
    volume: 1,
    loop: false,
    pitch: 1,
    delay: null
}

interface IDelayParams {
    interval: number;
    attenuation: number;
}

const defaultDelayParams: IDelayParams = {
    interval: 0.05,
    attenuation: 0.5
}

interface PanningPosition {
    x: number;
    y: number;
    z: number;
}
const defaultPanningPosition: PanningPosition = {
    x: 0,
    y: 0,
    z: 0
};

export default class Container extends AbstractSounder{
    //すべてのContainerは音をinputNodeから取り込み、gainNodeから排出していくことにする。
    protected _cxt: AudioContext = Master.cxt;
    
    protected _inputNode: AudioNode = Master.cxt.createGain();
    protected outputNode: AudioNode = Master.cxt.createGain();


    protected _gainNode: GainNode = Master.cxt.createGain();
    
    private _attenuator: GainNode = Master.cxt.createGain();
    private _delayNode: DelayNode = Master.cxt.createDelay();
    private _delaySwitch: AudioNode = Master.cxt.createGain();

    private _pannerNode: PannerNode = Master.cxt.createPanner();

    private _volume: number = 1;
    protected _pitch: number = 1;
    private _delay: IDelayParams = defaultDelayParams;
    private _panningPosition: PanningPosition = defaultPanningPosition;

    readonly children: Container[] = [];
    protected actionFuncs: {play: CallableFunction, stop: CallableFunction, restart: CallableFunction, pause: CallableFunction};
    parent: Container | undefined;
    
    constructor(options?: IOptions | undefined){
        super();

        this._inputNode.connect(this._gainNode);
        this._gainNode.connect(this._pannerNode);
        this._pannerNode.connect(this.outputNode);
        
        this._attenuator.connect(this._delayNode);
        this._delayNode.connect(this._attenuator);
        this._delayNode.connect(this._delaySwitch);

        

        if(!options) options = defaultOptions;

        this.volume = options.volume || defaultOptions.volume!;
        this.pitch = options.pitch || defaultOptions.pitch!;

        if(options.delay){
            this.useDelay();
            this.delay = options.delay;
        }

        this._inputNode.connect(this._delayNode);

        this.actionFuncs = {play: this.playFunc, restart: this.restartFunc, stop: this.stopFunc, pause: this.pauseFunc};
    }
    protected useDelay(){
        this._delaySwitch.connect(this._gainNode);
    }
    protected unuseDelay(){
        this._delaySwitch.disconnect(0);
    }
    addChild(obj: Container){
        this.children.push(obj);
        obj.outputNode.connect(this._inputNode);
        obj.parent = this;
    }

    private _makeAllChildrenDo(funcName: string){
        const children = this.children;
        for(let i=0, len=children.length;i<len;i++){
            children[i].actionFuncs[funcName]();
        }
    }
    play(){
        this.playFunc();
        this._makeAllChildrenDo('play');
    }
    stop(){
        this.stopFunc();
        this._makeAllChildrenDo('stop');
    }
    pause(){
        this.pauseFunc();
        this._makeAllChildrenDo('pause');
    }
    restart(){
        this.restartFunc();
        this._makeAllChildrenDo('restart');
    }
    playFunc: Function = ()=>{};
    stopFunc: Function = ()=>{};
    pauseFunc: Function = ()=>{};
    restartFunc: Function = ()=>{};

    set volume(value: number){
        this._volume = value;
        this._gainNode.gain.value = value;
    }
    get volume(): number{
        return this._volume;
    }
    set pitch(value: number) {
        this._pitch = value;
    }
    get pitch(): number{
        return this._pitch;
    }
    get worldPitch(): number{
        if(this.parent){
            return this.parent.worldPitch*this.parent.pitch;
        } else {
            return 1;
        }
    }
    set delay(options: IDelayParams){
        this._delay = options;
        this._attenuator.gain.value = options.attenuation;
        this._delayNode.delayTime.value = options.interval;
    }
    get delay(): IDelayParams{
        return this._delay;
    }
    set panX(value: number){
        this._pannerNode.positionX.value = value;
    }
    set panY(value: number){
        this._pannerNode.positionY.value = value;
    }
    set panZ(value: number){
        this._pannerNode.positionZ.value = value;
    }
    get panX(): number{
        return this._pannerNode.positionX.value;
    }
    get panY(): number{
        return this._pannerNode.positionY.value;
    }
    get panZ(): number{
        return this._pannerNode.positionZ.value;
    }
    setPanning(x: number, y?: number, z?: number): void{
        if(!y || !z){
            if(isFinite(x)) this._pannerNode.positionX.value = this._pannerNode.positionY.value = this._pannerNode.positionZ.value = x;
        } else if(!z){
            if(isFinite(x) && isFinite(y)){
                this._pannerNode.positionX.value = x;
                this._pannerNode.positionY.value = y;
            }
        } else {
            if(isFinite(x) && isFinite(y) && isFinite(z)){
                this._pannerNode.positionX.value = x;
                this._pannerNode.positionY.value = y;
                this._pannerNode.positionZ.value = z;
            }
        }
    }
}

export class MasterContainer extends Container{
    constructor(){
        super();
        this.outputNode.connect(Master.cxt.destination)
    }
}