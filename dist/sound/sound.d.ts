import { IMixerOptions } from '../mixer/mixer';
interface ISoundOptions extends IMixerOptions {
    loop?: boolean;
}
import Mixer from '../mixer/mixer';
import Audio from '../audio/audio';
export default class Sound extends Mixer {
    private _audio;
    private _sourceNode;
    protected _duration: number;
    protected _loop: boolean;
    private _playing;
    private _endTimer;
    protected readonly isSound: boolean;
    constructor(audio?: Audio, options?: ISoundOptions);
    set audio(audio: Audio);
    private _play;
    restartAction: Function;
    playAction: Function;
    stopAction: Function;
    pauseAction: Function;
    private _disconnectSourceNode;
    private _endThen;
    get playing(): boolean;
    set loop(flag: boolean);
    get loop(): boolean;
    get duration(): number;
}
export {};
//# sourceMappingURL=sound.d.ts.map