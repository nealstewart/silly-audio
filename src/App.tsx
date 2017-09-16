import * as React from 'react';
import './App.css';

const getX = (val: number, i: number) => i * 3;
const getY = (val: number, i: number) => val * 10;

class App extends React.Component {
  gradientStyle: CanvasGradient;
  canvasContext: CanvasRenderingContext2D | null;
  canvasElement: HTMLCanvasElement;
  readonly frequencyData: Uint8Array;
  request: number;
  audioSrc: MediaElementAudioSourceNode;
  readonly analyser: AnalyserNode;
  readonly audioContext: AudioContext;
  audioElement: HTMLAudioElement | null;

  constructor() {
    super();
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.request = 0;
    this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
  }

  onRef(el: HTMLAudioElement | null) {
    if (this.audioElement) {
      return;
    }

    this.audioElement = el!;
    this.audioSrc = this.audioContext.createMediaElementSource(this.audioElement);
    this.audioSrc.connect(this.analyser);
    this.audioSrc.connect(this.audioContext.destination);
  }

  onCanvasRef(el: HTMLCanvasElement | null) {
    if (this.canvasElement) {
      return;
    }

    this.canvasElement = el!;
    const canvasContext = this.canvasElement.getContext('2d');
    this.canvasContext = canvasContext;

    this.gradientStyle = canvasContext!.createLinearGradient(0, 0, 1280, 920);
    this.gradientStyle.addColorStop(0, 'black');
    this.gradientStyle.addColorStop(1, '#AAAAAA');
  }

  animate() {
    this.forceUpdate();
    this.request = requestAnimationFrame(
      () => this.animate());
  }

  stop() {
    cancelAnimationFrame(this.request);
  }

  render() {
    this.analyser.getByteFrequencyData(this.frequencyData);
    const context = this.canvasContext;

    if (context) {
      context.clearRect(0, 0, 1280, 920);
      context.fillStyle = this.gradientStyle;
      context.beginPath();
      context.moveTo(0, 920);
      this.frequencyData.slice(1).forEach((value, i) => {
        const x = getX(value, i);
        const y = 920 - getY(value, i);
        context.quadraticCurveTo(x - Math.floor(Math.random() * 10), y - Math.floor(Math.random() * 10), x, y);
      });
      context.closePath();
      context.fill();

      context.beginPath();
      context.moveTo(1280, 0);
      this.frequencyData.slice(1).forEach((value, i) => {
        const x = 1280 - getX(value, i);
        const y = getY(value, i);
        context.quadraticCurveTo(x - Math.floor(Math.random() * 10), y - Math.floor(Math.random() * 10), x, y);
      });
      context.closePath();
      context.fill();

      context.beginPath();
      context.moveTo(1280, 0);
      this.frequencyData.slice(1).forEach((value, i) => {
        const x = 1280 - getY(value, i);
        const y = getX(value, i);
        context.quadraticCurveTo(x - Math.floor(Math.random() * 10), y - Math.floor(Math.random() * 10), x, y);
      });
      context.closePath();
      context.fill();

      context.beginPath();
      context.moveTo(0, 920);
      this.frequencyData.slice(1).forEach((value, i) => {
        const x = getY(value, i);
        const y = 920 - getX(value, i);
        context.quadraticCurveTo(x - Math.floor(Math.random() * 10), y - Math.floor(Math.random() * 10), x, y);
      });
      context.closePath();
      context.fill();
    }

    return (
      <div>
        <canvas width={1280} height={920} ref={el => this.onCanvasRef(el)} />
        <audio
          onPlaying={() => this.animate()}
          onPause={() => this.stop()}
          ref={a => this.onRef(a)}
          src="/ravel.mp3"
          controls={true}
        />
      </div>
    );
  }
}

export default App;
