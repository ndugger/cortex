import * as Cortex from 'cortex';

import Icon from './Icon';

interface VideoPlayerState {
    paused: boolean;
    started: boolean;
}

export default class VideoPlayer extends Cortex.Component {

    private state = new Cortex.Store<VideoPlayerState>({
        paused: true,
        started: false
    });

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

    protected handleComponentConnect(): void {
        this.state.connect(this);
    }

    public render(): Cortex.Node[] {
        return [

            <HTMLVideoElement id='video' onclick={ () => this.togglePausePlay() }>
                <HTMLSourceElement src='assets/trailer.ogg' type='video/ogg'/>
            </HTMLVideoElement>,

            (this.state.paused && !this.state.started) && (
                <HTMLDivElement id='cover'/>
            ),

            <HTMLDivElement id='toggle' onclick={ () => this.togglePausePlay() } hidden={ !this.state.paused }>
                <Icon glyph='play_circle_outline' size={ 80 }/>
            </HTMLDivElement>
        ];
    }

    public theme(): string {
        return `
            :host {
                border-radius: 8px;
                box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
                display: block;
                position: relative;
                width: 720px;
                z-index: 0;
            }

            #toggle {
                align-items: center;
                bottom: 0;
                color: white;
                display: flex;
                justify-content: center;
                left: 0;
                position: absolute;
                right: 0;
                top: 0;
                transition: all .12s ease;
                z-index: 4;
            }

            #toggle[ hidden ] {
                opacity: 0;
                visibility: hidden;
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

            .${ HTMLVideoElement.name } {
                display: block;
                outline: none;
                position: static;
                width: 100%;
                z-index: 0;
            }
        `;
    }
}
