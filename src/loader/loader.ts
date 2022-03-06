import Master from '../app/master';

import Audio from '../audio/audio';

type ProgressManager = (all: number, rest: number)=>void;

export default class Loader{
    private static _resources: Map<string, Audio> = new Map();
    private static _tasks: Array<Promise<ArrayBuffer>> = [];
    private static _loadThen: Function = function(){};
    private static _cxt: AudioContext = Master.cxt;
    private static _progressManager: ProgressManager = ()=>{};
    private static _taskNum: number = 0;

    static add(id: string, src: string): Loader{
        const promise = this._promiseLoadingSound(id, src);
        this._tasks.push(promise);
        return this;
    }
    static loadAll(): void{
        this._taskNum = this._tasks.length;
        this._progressManager(this._taskNum, this._taskNum);
        Promise.all(this._tasks)
            .then(()=>{this._loadThen();});
    }
    static loadThen(func: Function){        
        this._loadThen = func;

        if(this._tasks.length === 0){
            func();
        }
    }
    private static _promiseLoadingSound(id: string, src: string): Promise<any>{
        const promise = new Promise((resolve)=>{
            fetch(src).then((res)=>{
                return res.arrayBuffer();
            }).then((data)=>{
                return this._cxt.decodeAudioData(data);
            }).then((buf)=>{
                const audio = new Audio(buf);
                this._resources.set(id, audio);
                this._tasks.shift();
                this._progressManager(this._taskNum, this._tasks.length);
                resolve(buf);
            })
        });

        return promise;
    }
    static manageProgress(func: ProgressManager){
        this._progressManager = func;
    }
    static get(id: string): Audio | undefined{
        return this._resources.get(id);
    }
}