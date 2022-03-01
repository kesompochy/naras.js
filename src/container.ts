import Master from './master';

abstract class AbstractSounder {
    abstract startFunc: Function;
    abstract stopFunc: Function;
    abstract pauseFunc: Function;
    abstract restartFunc: Function;
}

interface IOptions {
    volume: number;
    loop: boolean;
}


export default class Container extends AbstractSounder{
    //すべてのContainerは音をinputNodeから取り込み、gainNodeから排出していくことにする。
    private _inputNode: AudioNode = Master.cxt.createGain();
    outputNode: AudioNode = Master.cxt.createGain();
    protected _gainNode: GainNode = Master.cxt.createGain();
    protected _cxt: AudioContext = Master.cxt;
    protected _volume: number = 1;
    protected _pitch: number = 1;
    private _attenuator: GainNode = Master.cxt.createGain();
    private _delayNode: DelayNode = Master.cxt.createDelay();
    private _delaySwitch: AudioNode = Master.cxt.createGain();
    readonly children: Container[] = [];
    parent: Container | undefined;
    
    constructor(options?: IOptions){
        super();
        this._inputNode.connect(this._gainNode);
        this._gainNode.connect(this.outputNode);
        
        this._attenuator.connect(this._delayNode);
        this._delayNode.connect(this._attenuator);
        this._delayNode.connect(this._delaySwitch);
    }
    private _useDelay(){
        this._delaySwitch.connect(this._gainNode);
    }
    private _unuseDelay(){
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
            children[i][funcName]();
        }
    }
    start(){
        this.startFunc();

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
    startFunc: Function = ()=>{};
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
            return this.parent._pitch*this.pitch;
        } else {
            return this.pitch;
        }
    }
}

export class MasterContainer extends Container{
    constructor(){
        super();
        this.outputNode.connect(Master.cxt.destination)
    }
}