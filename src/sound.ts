interface IOptions {
    volume: number;
    loop: boolean;
}

import SoundMaster from './master';

export default class Sound {
    private _buffer: AudioBuffer;
    private _cxt: AudioContext | undefined;
    private _sourceNode: AudioBufferSourceNode | undefined;
    private _gainNode: GainNode | undefined;
    private _playing: boolean = false;
    private _endTimer: NodeJS.Timeout | undefined;
    private _duration: number = 0;
    private _startedTime: number = 0;
    private _playedTime: number = 0;
    private _loop: boolean = false;
    private _volume: number = 1;
    parent: SoundMaster | undefined;
    constructor(buf: AudioBuffer, options?: IOptions){
        this._buffer = buf;
        this._duration = buf.duration;

        this.loop = options?.loop || false;
        this.volume = options?.volume || 1;
    }
    set buffer(buffer: AudioBuffer){
        this._buffer = buffer;
        this._duration = buffer.duration;
    }
    acquireContext(cxt: AudioContext): void{
        this._cxt = cxt;
        this._gainNode = cxt.createGain();
        this._gainNode.connect(cxt.destination);


    }
    reStart(): void{
        this._play(this._playedTime);
    }
    start(): void{
        this._play(0);
    }
    private _play(offset: number = 0): void{
        if(!this._cxt || !this._buffer || !this._gainNode){
            return;
        }
 

        const cxt = this._cxt;

        this._sourceNode = cxt.createBufferSource()!;
        this._sourceNode.buffer = this._buffer;

        const sourceNode = this._sourceNode;

        sourceNode.connect(this._gainNode);
        sourceNode.start(0, offset);
        

        this._sourceNode = sourceNode;

        this._startedTime = cxt.currentTime;

        this._playing = true;
        if(!this.loop) this._endTimer = setTimeout(this._endThen.bind(this), this._duration*1000);
    }
    stop(): void{
        if(this._playing && this._sourceNode){
            this._sourceNode.stop(0);
            this._endThen();
        }
    }
    pause(): void{
        if(this._playing) {
            this._playedTime = (this._playedTime + this._cxt!.currentTime - this._startedTime) % this._duration;
            this._playing = false;
            this._sourceNode!.stop(0);
            this._clearTimer();
        }
    }
    private _clearTimer(): void{
        clearTimeout(this._endTimer!);
    }
    private _endThen(): void{
        this._playing = false;
        this._playedTime = 0;
        this._sourceNode!.disconnect(0);
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
    set volume(value: number){
        this._volume = value;
        if(this._gainNode){
            this._gainNode.gain.value = value;
        }
    }
    get volume(): number{
        return this._volume;
    }
}


