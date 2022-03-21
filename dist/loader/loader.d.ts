import Audio from '../audio/audio';
declare type ProgressManager = (all: number, rest: number) => void;
export default class Loader {
    private static _resources;
    private static _tasks;
    private static _loadThen;
    private static _cxt;
    private static _progressManager;
    private static _taskNum;
    static loaded: boolean;
    static add(id: string, src: string): Loader;
    static loadAll(): void;
    static loadThen(func: Function): void;
    private static _promiseLoadingSound;
    static manageProgress(func: ProgressManager): void;
    static get(id: string): Audio | undefined;
}
export {};
//# sourceMappingURL=loader.d.ts.map