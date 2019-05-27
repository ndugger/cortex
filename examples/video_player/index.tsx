import * as Cortex from 'cortex';

import VideoPlayer from './components/VideoPlayer';

class Application extends Cortex.Component {

    public render(): Cortex.Node[] {
        return [
            <VideoPlayer/>
        ];
    }

    public theme(): string {
        return `
            :host {
                align-items: center;
                background: rgb(197, 255, 215);
                display: flex;
                justify-content: center;
                height: 100%;
                user-select: none;
                width: 100%;
            }
        `;
    }
}

document.body.append(new Application());
