

declare global {
    interface Window {
        webkitAudioContext: any
    }
}

const AudioContext = window.AudioContext || window.webkitAudioContext;

export default class Master{
    static cxt: AudioContext = new AudioContext();
}