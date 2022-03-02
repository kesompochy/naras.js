import Master from '../app/master';

export default class Loader{
    private _resources: Map<string, AudioBuffer> = new Map();
    private _datas: Map<string, ArrayBuffer> = new Map();
    private _tasks: Array<Promise<ArrayBuffer>> = [];
    private _loadThen: Function = function(){};
    private _cxt: AudioContext = Master.cxt;


    add(id: string, src: string): Loader{
        const promise = this._promiseLoadingSound(id, src);
        this._tasks.push(promise);
        return this;
    }
    loadAll(): void{
        Promise.all(this._tasks)
            .then(()=>{this._loadThen();});
    }
    loadThen(func: Function){
        this._loadThen = func;
    }
    private _promiseLoadingSound(id: string, src: string): Promise<any>{
        const promise = new Promise((resolve)=>{
            fetch(src).then((res)=>{
                return res.arrayBuffer();
            }).then((data)=>{
                this._datas.set(id, data);
                return this._cxt.decodeAudioData(data);
            }).then((buf)=>{
                this._resources.set(id, buf);
                resolve(buf);
            })
        });

        return promise;
    }
    getResource(id: string): AudioBuffer | undefined{
        return this._resources.get(id);
    }
    getData(id: string): ArrayBuffer | undefined{
        return this._datas.get(id);
    }
}