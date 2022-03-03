import Master from '../app/master';

import Delay from './effects/delay';
import Panner from './effects/pan';

import Sound from '../sound/sound';


interface ActionFuncs{
    play: CallableFunction;
    stop: CallableFunction;
    restart: CallableFunction;
    pause: CallableFunction;
}

abstract class AbstractMixer {
    protected abstract playFunc: Function;
    protected abstract stopFunc: Function;
    protected abstract pauseFunc: Function;
    protected abstract restartFunc: Function;
    protected abstract actionFuncs: ActionFuncs;
}

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




enum ActionFuncsName {
    play = 'play',
    stop = 'stop',
    restart = 'restart',
    pause = 'pause'
};





export default class Mixer extends AbstractMixer{
    //すべてのContainerは音をinputNodeから取り込み、gainNodeから排出していくことにする。
    protected _cxt: AudioContext = Master.cxt;
    
    protected _inputNode: AudioNode = Master.cxt.createGain();
    protected _outputNode: AudioNode = Master.cxt.createGain();
    protected _gainNode: GainNode = Master.cxt.createGain();
    
    private _delay: Delay;
    private _panner: Panner;

    private _loopTimer: NodeJS.Timeout | undefined;
    private _loopRange: number = 0;

    private _volume: number = defaultOptions.volume!;
    protected _scale: number = defaultOptions.scale!;
    private _useDelay: boolean;
    protected _loop: boolean = false;

    private _position: number = 0;
    set position(value: number){
        this._position = value;
    }
    get position(): number{
        return this._position;
    }

    readonly children: Mixer[] = [];
    protected actionFuncs: ActionFuncs = {play: this.playFunc, stop: this.stopFunc, restart: this.restartFunc, pause: this.pauseFunc};
    parent: Mixer | undefined;

    private _size: number = 0;
    get size(): number{ return this._size};

    protected readonly isSound: boolean = false;

    constructor(options?: IOptions){
        super();

        if(!options) options = defaultOptions;

        const panParam = options.panner || defaultOptions.panner!;
        this._panner = new Panner(panParam.x, panParam.y, panParam.z);
        this._delay = new Delay(this._inputNode, options.delay || defaultOptions.delay!);

        this.volume = options.volume || defaultOptions.volume!;
        this.scale = options.scale || defaultOptions.scale!;
        this._useDelay = options.useDelay || defaultOptions.useDelay!;
        this.useDelay = this._useDelay;

        this._inputNode.connect(this._panner.node);
        this._panner.connect(this._gainNode);
        this._gainNode.connect(this._outputNode);
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

        this._size = Math.max(this._size, obj.realPosition);

        if(obj.isSound){
            const sound = obj as Sound;
            this._size = Math.max(this._size, sound.realPosition + sound.duration*sound.realScale);
        }
    }
    protected connect(output: AudioNode){
        this._outputNode.connect(output);
    }

    private _makeAllChildrenDo(funcName: ActionFuncsName){
        const children = this.children;
        for(let i=0, len=children.length;i<len;i++){
            children[i].actionFuncs[funcName]();
        }
    }
    play(){
        this.playFunc();
        this._makeAllChildrenDo(ActionFuncsName.play);
    }
    stop(){
        this.stopFunc();
        this._makeAllChildrenDo(ActionFuncsName.stop);
    }
    pause(){
        this.pauseFunc();
        this._makeAllChildrenDo(ActionFuncsName.pause);
    }
    restart(){
        this.restartFunc();
        this._makeAllChildrenDo(ActionFuncsName.restart);
    }
    playFunc: Function = ()=>{
        if(this._loop) {
            this._loopTimer = setTimeout(this._loopFunc.bind(this), this._loopRange*this.scale);
        }
    };
    stopFunc: Function = ()=>{
        this._clearLoop();
    };
    pauseFunc: Function = ()=>{
        this._clearLoop();
    };
    restartFunc: Function = ()=>{
        if(this._loop){
            this._loopTimer = setTimeout(this._loopFunc.bind(this), this._loopRange*this.scale);
        }
    };
    private _clearLoop(): void{
        if(this._loopTimer) clearTimeout(this._loopTimer);
        this._loopTimer = undefined;
    }
    private _loopFunc(){
        this.stop();
        this.play();
    }

    set loop(frag: boolean){
        this._loop = frag;
    }

    set loopRange(value: number){
        this._loopRange = value;
    }
    get loopRange(): number{
        return this._loopRange;
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
        this._delay.realScale = this.realScale;
    }
    get scale(): number{
        return this._scale;
    }
    get worldScale(): number{
        if(this.parent){
            return this.parent.worldScale*this.parent.scale;
        } else {
            return 1;
        }
    }
    get realScale(): number{
        return  this.worldScale*this.scale;
    }
    get worldPosition(): number{
        if(this.parent){
            return this.parent.worldPosition+this.parent.position*this.parent.worldScale;
        } else {
            return 0;
        }
    }
    get realPosition(): number{
        return this.worldPosition + this.position*this.worldScale;
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