import * as Cortex from 'cortex';

import VideoPlayer from './components/VideoPlayer';

class Application extends Cortex.Component {

    public render(): Cortex.Node[] {
        return [
            <HTMLDivElement>
                <VideoPlayer title='Big Buck Bunny' src='assets/trailer.ogg' type='video/ogg'/>
                <HTMLDivElement id='attribution'>
                    <HTMLAnchorElement href='https://peach.blender.org/about/' target='_blank'>
                        Big Buck Bunny
                    </HTMLAnchorElement>
                    is an Open Source film released under
                    <HTMLAnchorElement href='https://creativecommons.org/licenses/by/3.0/' target='_blank'>
                        Creative Commons License Attribution 3.0
                    </HTMLAnchorElement>
                </HTMLDivElement>
            </HTMLDivElement>
        ];
    }

    public theme(): string {
        return `
            :host {
                align-items: center;
                background: rgb(0, 160, 211);
                display: flex;
                justify-content: center;
                height: 100%;
                user-select: none;
                width: 100%;
            }

            #attribution {
                color: white;
                font-family: Arial;
                font-size: 0.75rem;
                margin-top: 8px;
                opacity: 0.8;
                text-align: center;
            }

            #attribution .${ HTMLAnchorElement.name } {
                color: yellow;
                display: inline-block;
                font-weight: bold;
                margin: 0 4px;
            }
        `;
    }
}

document.body.append(new Application());
