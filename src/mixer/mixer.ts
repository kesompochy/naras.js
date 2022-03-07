import Master from '../app/master';

import Delay from './effects/delay';
import Panner from './effects/pan';

import Sound from '../sound/sound';

const MILLI = 1000;
const ActionSuffix = 'Action';

import { IDelayParams, defaultDelayParams } from './effects/delay';

interface IPannerParams {
    x?: number;
    y?: number;
    z?: number;
}

export interface IOptions {
    volume?: number;
    loop?: boolean;
    scale?: number;
    delay?: IDelayParams;
    useDelay?: boolean;
    panner?: IPannerParams;
}


export const defaultOptions: IOptions = {
    volume: 1,
    loop: false,
    scale: 1,
    delay: defaultDelayParams,
    useDelay: false,
    panner: {x: 0, y: 0, z: 0}
}


export default class Mixer {
    //すべてのContainerは音をinputNodeから取り込み、gainNodeから排出していくことにする。
    protected _cxt: AudioContext = Master.cxt;
    
    protected _inputNode: AudioNode = Master.cxt.createGain();
    protected _gainNode: GainNode = Master.cxt.createGain();
    
    private _delay: Delay;
    private _panner: Panner;

    private _volume: number = defaultOptions.volume!;
    protected _scale: number = defaultOptions.scale!;
    private _useDelay: boolean;
    protected _duration: number = 0;

    protected _playedTime: number = 0;
    protected _startedTime: number = 0;

    private _position: number = 0;
    set position(value: number){
        this._position = value;
    }
    get position(): number{
        return this._position;
    }

    readonly children: Mixer[] = [];
    
    parent: Mixer | undefined;


    protected readonly isSound: boolean = false;

    constructor(options?: IOptions){

        options = Object.assign(defaultOptions, options);

        const panParam = options.panner!
        this._panner = new Panner(panParam.x, panParam.y, panParam.z);
        this._delay = new Delay(this._inputNode, options.delay!);

        this.volume = options.volume!
        this.scale = options.scale!
        this._useDelay = options.useDelay!
        this.useDelay = this._useDelay;

        this._inputNode.connect(this._panner.node);
        this._panner.connect(this._gainNode);
    }
    set useDelay(flag: boolean){
        this._useDelay = flag;
        if(flag) {
            this._delay.connect(this._gainNode);
        } else {
            this._delay.disconnect();
        }
        
    }
    get useDelay(): boolean{
        return this._useDelay;
    }
    get delay(): Delay{
        return this._delay;
    }

    addChildren(...ary: Mixer[]){
        for(let i=0, len=ary.length;i<len;i++){
            this.addChild(ary[i]);
        }
    }
    addChild(obj: Mixer){
        this.children.push(obj);
        obj.connect(this._inputNode);
        obj.parent = this;
    }
    protected connect(output: AudioNode){
        this._gainNode.connect(output);
    }


    protected _playPosition: number = 0;
    protected _playScale: number = 1;
    set playScale(value: number){
        this._playScale = value;
        this._delay.realScale = value;
    }
    get playScale(): number{
        return this._playScale;
    }

    play(){
        this._propagateOrder('play');
    }
    stop(){
        this._propagateOrder('stop');
    }
    pause(){
        this._propagateOrder('pause');
    }
    restart(){
        this._propagateOrder('restart');
    }

    private _propagateOrder(orderName: string, parent?: Mixer, ) {
        this._playPosition = this._calcPlayPosition(parent);
        this.playScale = this._calcPlayScale(parent);

        this.children.forEach((child)=>{
            child._propagateOrder(orderName, this);
        });

        this[orderName + ActionSuffix]();
    }

    private _calcPlayPosition(parent?: Mixer){
        if(parent){
            return parent._playPosition + this._position*parent._playScale;
        } else {
            return 0;
        }
    }
    private _calcPlayScale(parent?: Mixer){
        if(parent){
            return parent._playScale * this._scale;
        } else {
            return this._scale;
        }
    }


    playAction: Function = ()=>{
    };
    stopAction: Function = ()=>{
    };
    pauseAction: Function = ()=>{
    };
    restartAction: Function = ()=>{
    };

    get duration(): number{
        return this._duration;
    }



    set volume(value: number){
        this._volume = value;
        this._gainNode.gain.value = value;
    }
    get volume(): number{
        return this._volume;
    }
    set scale(value: number) {
        this._scale = value;
    }
    get scale(): number{
        return this._scale;
    }


    get panner(): Panner{
        return this._panner;
    }
}

export class MasterMixer extends Mixer{
    constructor(){
        super();
        this.connect(Master.cxt.destination);
    }
}