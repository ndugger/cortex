import * as Cortex from 'cortex';

import Icon from './Icon';

export default class VideoPlayer extends Cortex.Component {

    public render(): Cortex.Node[] {
        return [
            <HTMLDivElement id='cover'/>,
            <HTMLDivElement id='center'>
                <Icon glyph='play_circle_outline' size={ 64 }/>
            </HTMLDivElement>,
            <HTMLVideoElement>
                <HTMLSourceElement src='assets/trailer.ogg' type='video/ogg'/>
            </HTMLVideoElement>
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
            }

            #center {
                align-items: center;
                bottom: 0;
                color: white;
                display: flex;
                justify-content: center;
                left: 0;
                position: absolute;
                right: 0;
                top: 0;
            }

            .${ HTMLVideoElement.name } {
                display: block;
                outline: none;
                width: 100%;
            }
        `;
    }
}
