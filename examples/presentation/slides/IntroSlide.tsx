import * as Cortex from 'cortex';

import Presentation from '../components/Presentation';

export default class IntroSlide extends Cortex.Component {

    public render(): Cortex.Node[] {
        return [
            <Presentation.Image src='assets/web_components_logo.png' style={ { position: 'absolute', right: '-16px', top: '20px' } } width={ 200 }/>,
            <Presentation.Layout direction='vertical' grow={ 1 }>
                <Presentation.Heading level={ 2 }>
                    What are "native web components"?
                </Presentation.Heading>
                <Presentation.List>
                    <Presentation.List.Item>
                        Custom Elements
                    </Presentation.List.Item>
                    <Presentation.List.Item>
                        Shadow DOM
                    </Presentation.List.Item>
                </Presentation.List>
            </Presentation.Layout>
        ];
    }

    public theme(): string {
        return `
            :host {
                display: contents;
            }
        `;
    }
}
