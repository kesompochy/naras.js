import { IOptions, defaultOptions } from '../mixer/mixer';

interface ISoundOptions extends IOptions{
    loop?: boolean;
}

const defaultSoundOptions: ISoundOptions = Object.assign(defaultOptions, {loop: false});

import Container from '../mixer/mixer';
import Audio from '../audio/audio';


export default class Sound extends Container{
    private _audio: Audio | undefined;
    private _sourceNode: AudioBufferSourceNode | undefined | null;
    private _duration: number = 0;
    private _playedTime: number = 0;
    private _startedTime: number = 0;
    private _loop: boolean = false;
    private _playing: boolean = false;
    private _endTimer: NodeJS.Timeout | undefined;

    
    constructor(audio: Audio, options?: ISoundOptions){
        
        super(options);
        this._audio = audio;
        this._duration = audio.duration;

        if(!options) options = defaultSoundOptions;

        this.loop = options.loop || defaultSoundOptions.loop!;

        this.actionFuncs = {play: this.playFunc, restart: this.restartFunc, stop: this.stopFunc, pause: this.pauseFunc};

    }


    set audio(audio: Audio){
        this._audio = audio;
        this._duration = audio.duration;
    }

    private _play(offset: number = 0){
        if(!this._audio){
            return;
        }

        const cxt = this._cxt;

        this._sourceNode = cxt.createBufferSource()!;
        this._sourceNode.buffer = this._audio.buffer;

        this._sourceNode.loop = this._loop;
        const realPitch = this.calcWorldPitch() * this._pitch;
        this._sourceNode.playbackRate.value = realPitch;
        

        const sourceNode = this._sourceNode;

        sourceNode.connect(this._inputNode);

        console.log(this.realPosition);
        sourceNode.start(cxt.currentTime + this.realPosition, offset);

        
        this._sourceNode = sourceNode;

        this._startedTime = (cxt.currentTime + this.realPosition)/realPitch;

        this._playing = true;
        
        if(!this.loop) {
            const endTime = (this.realPosition + this._duration)*1000/realPitch;
            setTimeout(this._disconnectSourceNode.bind(this), endTime, sourceNode);

            if(this._endTimer) {
                clearTimeout(this._endTimer);
                this._endTimer = undefined;
            }
            this._endTimer = setTimeout(this._endThen.bind(this), endTime);
        }
    }

    reStartFunc: Function = () => {
        this._play(this._playedTime);
    }
    playFunc: Function = () => {
        this._playedTime = 0;
        this._play(0);
    }
    stopFunc: Function = () =>{
        if(this._playing && this._sourceNode){
            this._sourceNode.stop(0);
            this._sourceNode.disconnect(0);
            this._endThen();
        }
    }
    pauseFunc: Function = () =>{
        if(this._playing) {
            this._playedTime = (this._playedTime + this._cxt!.currentTime - this._startedTime) % this._duration;
            this._playing = false;
            this._sourceNode!.stop(0);
        }
    }
    private _disconnectSourceNode(sourceNode: AudioNode): void{
        sourceNode!.disconnect(0);
    }
    private _endThen(): void{
        this._playing = false;
        this._playedTime = 0;
        this._sourceNode = null;
        this._endTimer = undefined;
    }
    get playing(): boolean{
        return this._playing;
    }
    set loop(flag: boolean){
        this._loop = flag;
        if(this._sourceNode){
            this._sourceNode.loop = flag;
        }
    }
    get loop(): boolean{
        return this._loop;
    }
}


