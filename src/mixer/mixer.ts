import Master from '../app/master';

import Delay from './effects/delay';
import Panner from './effects/pan';

const MILLI = 1000;

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

export interface IOptions {
    volume?: number;
    loop?: boolean;
    scale?: number;
    delay?: IDelayParams;
    useDelay?: boolean;
}


export const defaultOptions: IOptions = {
    volume: 1,
    loop: false,
    scale: 1,
    delay: defaultDelayParams,
    useDelay: false
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


    private _volume: number = defaultOptions.volume!;
    protected _scale: number = defaultOptions.scale!;
    private _delaying: boolean;

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
    
    constructor(options?: IOptions){
        super();

        if(!options) options = defaultOptions;

        this._panner = new Panner(0, 0, 0);
        this._delay = new Delay(this._inputNode, options.delay || defaultOptions.delay!);

        this.volume = options.volume || defaultOptions.volume!;
        this.scale = options.scale || defaultOptions.scale!;
        this._delaying = options.useDelay || defaultOptions.useDelay!;

        this._inputNode.connect(this._panner.node);
        this._panner.connect(this._gainNode);
        this._gainNode.connect(this._outputNode);
        

        if(options.useDelay){
            this.useDelay();
        }



    }
    protected useDelay(){
        this._delaying = true;
        this._delay.connect(this._gainNode);
    }
    protected unuseDelay(){
        this._delaying = false;
        this._delay.disconnect();
    }
    get delay(): Delay{
        return this._delay;
    }
    get delaying(): boolean{
        return this._delaying;
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