import Loader from './loader';
import Master from './master';
import {MasterContainer} from './container';

export default class App {
    loader: Loader = new Loader();
    masterContainer: MasterContainer = new MasterContainer();
    private _unlockEvents: string[] = ['click', 'scroll', 'touchstart'];
    constructor(){
        for(let i=0, len=this._unlockEvents.length;i<len;i++){
            document.addEventListener(this._unlockEvents[i], this._initContext.bind(this), {once: true});
        }
        this._initContext();
    }
    private _initContext(): void{
        if(Master.cxt.state === 'suspended'){
            Master.cxt.resume();
        }
        for(let i=0, len=this._unlockEvents.length;i<len;i++){
            document.removeEventListener(this._unlockEvents[i], this._initContext.bind(this));
        }
    }
    addResource(id: string, src: string): Master{
        this.loader.add(id, src);
        return this;
    }
    loadAll(): void{
        this.loader.loadAll();
    }
    loadThen(func: Function): void{
        this.loader.loadThen(func);
    }
}