import Master from './master';

interface IDelayParams {
    interval: number;
    attenuation: number;
}

const defaultDelayParams: IDelayParams = {
    interval: 1,
    attenuation: 0.5,
};

export {IDelayParams, defaultDelayParams};

const MAX_DELAY_TIME = 10;

export default class Delay {
    private _interval: number = defaultDelayParams.interval;
    private _attenuation: number = defaultDelayParams.attenuation;
    private _delayNode: DelayNode = Master.cxt.createDelay(MAX_DELAY_TIME);
    private _attenuationNode: GainNode = Master.cxt.createGain();
    private _delaySwitch: GainNode = Master.cxt.createGain();

    constructor(input: AudioNode, params?: IDelayParams){
        if(!params){
            params = defaultDelayParams;
        } else {
            params.interval = params.interval || defaultDelayParams.interval;
            params.attenuation = params.attenuation || defaultDelayParams.attenuation;
        }
        this.interval = params.interval;
        this.attenuation = params.attenuation;

        input.connect(this._delayNode);
        this._delayNode.connect(this._attenuationNode);
        this._attenuationNode.connect(this._delayNode);
        this._delayNode.connect(this._delaySwitch);
    }

    set interval(value: number){
        value = Math.min(Math.max(value, 0), MAX_DELAY_TIME);
        this._interval = value;
        this._delayNode.delayTime.value = value;
    }
    get interval(): number{
        return this._interval;
    }
    set attenuation(value: number){
        this._attenuation = value;
        this._attenuationNode.gain.value = value;
    }
    get attenuation(): number{
        return this._attenuation;
    }
    set(interval: number, attenuation: number){
        this.interval = interval;
        this.attenuation = attenuation;
    }

    connect(output: AudioNode){
        this._delaySwitch.connect(output);
    }
    disconnect(){
        this._delaySwitch.disconnect(0);
    }
}