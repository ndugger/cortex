import * as Cortex from 'cortex';

export default class VideoPlayer extends Cortex.Component {

    public render(): Cortex.Node[] {
        return [
            <HTMLDivElement id='cover'/>
        ];
    }

    public theme(): string {
        return `
            :host {
                border-radius: 8px;
                box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
                display: block;
                height: 400px;
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
        `;
    }
}
