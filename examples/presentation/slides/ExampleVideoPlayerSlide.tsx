import * as Cortex from 'cortex';

import Presentation from '../components/Presentation';

export default class ExampleVideoPlayerSlide extends Cortex.Component {

    public render(): Cortex.Node[] {
        return [
            <Presentation.Image src='assets/web_components_logo.png' style={ { position: 'absolute', right: '-16px', top: '20px' } } width={ 200 }/>,
            <Presentation.Layout direction='vertical' grow={ 1 }>
                <Presentation.Heading level={ 2 }>
                    Example: Video Player
                </Presentation.Heading>
                <Presentation.Text>
                    Built on top of the <HTMLElement tag='code'>HTMLVideoElement</HTMLElement>,
                    it uses web components to render the controls and manage user interactions.
                </Presentation.Text>
                <HTMLIFrameElement frameBorder='0' src='../video_player/index.html'/>
            </Presentation.Layout>
        ];
    }

    public theme(): string {
        return `
            :host {
                display: contents;
            }

            code {
                background: rgba(0, 0, 0, 1);
                color: rgba(255, 255, 255, 0.85);
                padding: 4px 8px;
            }

            .${ HTMLIFrameElement.name } {
                border-radius: 4px;
                flex-grow: 1;
            }
        `;
    }
}
