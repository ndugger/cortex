import * as Cortex from 'cortex';

import Icon from './Icon';
import ProgressBar from './ProgressBar';
import Spacer from './Spacer';

interface VideoPlayerState {
    controls: boolean;
    fullscreen: boolean;
    paused: boolean;
    progress: number;
    started: boolean;
}

const ONE_SECOND = 1000;

export default class VideoPlayer extends Cortex.Component {

    private controlsFader: number;

    private state = new Cortex.Store<VideoPlayerState>({
        controls: true,
        fullscreen: false,
        paused: true,
        progress: 0,
        started: false
    });

    private tracker = window.setInterval(() => {
        this.trackProgress();
    }, ONE_SECOND / 60);

    public src: string;
    public title: string;
    public type: string;

    private displayControls(): void {
        window.clearTimeout(this.controlsFader);
        this.state.controls = true;
    }

    private hideControls(): void {
        this.controlsFader = window.setTimeout(() => {
            this.state.controls = false;
        }, ONE_SECOND * 2);
    }

    private toggleFullscreen(): void {

        if (!this.state.fullscreen) {
            this.requestFullscreen()
                .catch(() => {
                    this.state.fullscreen = false;
                })
                .then(() => {
                    this.state.fullscreen = true;
                });
        }

        window.document.exitFullscreen()
            .then(() => {
                this.state.fullscreen = false;
            });
    }

    private togglePausePlay(): void {
        const video = this.shadowRoot.getElementById('video') as HTMLVideoElement;

        if (this.state.paused) {
            video.play();

            if (!this.state.started) {
                this.state.started = true;
            }
        }
        else {
            video.pause();
        }

        this.state.paused = !this.state.paused;
    }

    private trackProgress(): void {
        const video = this.shadowRoot.getElementById('video') as HTMLVideoElement;

        if (!this.state.paused) {
            this.state.progress = video.currentTime / video.duration;
        }
    }

    private formatTime(which: 'currentTime' | 'duration'): string {
        const video = this.shadowRoot.getElementById('video') as HTMLVideoElement;

        if (!video) {
            return '00:00';
        }

        const time = video[ which ];
        const minutes = (time / 60) | 0;
        const seconds = (time % 60) | 0;

        return `${ (minutes < 10) ? `0${ minutes }` : minutes }:${ (seconds < 10) ? `0${ seconds }` : seconds }`;
    }

    protected handleComponentConnect(): void {
        this.state.connect(this);
    }

    protected handleComponentDisconnect(): void {
        window.clearInterval(this.tracker);
    }

    public render(): Cortex.Node[] {
        return [
            <HTMLDivElement onmouseenter={ () => this.displayControls() } onmouseleave={ () => this.hideControls() }>
                <HTMLVideoElement id='video' onclick={ () => this.togglePausePlay() } onloadeddata={ () => this.update() }>
                    <HTMLSourceElement src={ this.src } type={ this.type }/>
                </HTMLVideoElement>

                { (!this.state.started) && (
                    <HTMLDivElement id='cover'/>
                ) }

                <HTMLDivElement id='overlay' onclick={ () => this.togglePausePlay() }>
                    <HTMLDivElement id='meta_wrapper' hidden={ !this.state.paused && !this.state.controls }>
                        <HTMLDivElement id='meta'>
                            <HTMLSpanElement textContent={ this.title }/>
                        </HTMLDivElement>
                    </HTMLDivElement>
                    <HTMLDivElement id='controls_wrapper' hidden={ !this.state.paused && !this.state.controls }>
                        <HTMLDivElement id='controls' onclick={ (e: Event) => e.stopPropagation() }>
                            <Icon glyph={ this.state.paused ? 'play_arrow' : 'pause' } onclick={ () => this.togglePausePlay() }/>
                            <Spacer width={ 16 }/>
                            <HTMLSpanElement textContent={ this.formatTime('currentTime') }/>
                            <Spacer width={ 16 }/>
                            <ProgressBar value={ this.state.progress }/>
                            <Spacer width={ 16 }/>
                            <HTMLSpanElement textContent={ this.formatTime('duration') }/>
                            <Spacer width={ 16 }/>
                            <Icon glyph='fullscreen' onclick={ () => this.toggleFullscreen() }/>
                        </HTMLDivElement>
                    </HTMLDivElement>
                    <Icon glyph='play_circle_filled' size={ 80 } hidden={ !this.state.paused }/>
                </HTMLDivElement>
            </HTMLDivElement>
        ];
    }

    public theme(): string {
        return `
            :host {
                align-items: center;
                border-radius: 8px;
                box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
                display: flex;
                font-family: Oswald;
                overflow: hidden;
                position: relative;
                width: 720px;
                z-index: 0;
            }

            #overlay {
                align-items: center;
                bottom: 0;
                color: white;
                display: flex;
                filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.4));
                justify-content: center;
                left: 0;
                opacity: 0.8;
                position: absolute;
                right: 0;
                top: 0;
                transition: all .12s ease;
                z-index: 4;
            }

            #overlay .${ Icon.name } {
                color: white;
                transition: all .2s ease;
            }

            #overlay .${ Icon.name }:hover {
                color: yellow;
            }

            #overlay .${ Icon.name }[ hidden ] {
                opacity: 0;
            }

            #cover {
                background-color: black;
                background-image: url(assets/cover_photo.jpg);
                background-size: cover;
                border-radius: 8px;
                bottom: 0;
                left: 0;
                position: absolute;
                right: 0;
                top: 0;
                z-index: 3;
            }

            #meta_wrapper {
                background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%);
                bottom: 50%;
                display: flex;
                left: 0;
                position: absolute;
                right: 0;
                top: 0;
                transition: all .5s ease;
                z-index: -1;
            }

            #meta_wrapper[ hidden ] {
                bottom: 75%;
                opacity: 0;
            }

            #meta {
                font-size: 1.1rem;
                font-weight: bold;
                padding: 12px 16px;
            }

            #controls_wrapper {
                align-items: flex-end;
                background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%);
                bottom: 0;
                display: flex;
                left: 0;
                position: absolute;
                right: 0;
                top: 50%;
                transition: all .5s ease;
                z-index: -1;
            }

            #controls_wrapper[ hidden ] {
                opacity: 0;
                top: 75%;
            }

            #controls {
                align-items: center;
                display: flex;
                filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.4));
                flex-grow: 1;
                font-size: 0.8rem;
                padding: 12px 16px;
            }

            .${ ProgressBar.name } {
                flex-grow: 1;
            }

            .${ HTMLSpanElement.name } {
                color: white;
            }

            .${ HTMLVideoElement.name } {
                border-radius: 8px;
                display: block;
                outline: none;
                position: static;
                width: 100%;
                z-index: 0;
            }
        `;
    }
}
