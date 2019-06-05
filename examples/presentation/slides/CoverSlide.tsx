import * as Cortex from 'cortex';

import Presentation from '../components/Presentation';
import { blue } from '../utilities/palette';

export default class CoverSlide extends Cortex.Component {

    public render(): Cortex.Node[] {
        return [
            <Presentation.Layout direction='vertical' grow={ 1 }>
                <Presentation.Heading level={ 1 }>
                    Native Web Components
                </Presentation.Heading>
                <Presentation.Heading color={ `rgb(${ blue })` } level={ 3 }>
                    Custom Elements & Shadow DOM
                </Presentation.Heading>
                <Presentation.Layout align='center' grow={ 1 } justify='center'>
                    <Presentation.Image src='assets/web_components_logo.png' width={ 440 }/>
                </Presentation.Layout>
                <Presentation.Layout justify='end'>
                    <Presentation.Heading level={ 3 }>
                        by Nick Dugger
                    </Presentation.Heading>
                </Presentation.Layout>
            </Presentation.Layout>
        ];
    }

    public theme(): string {
        return `
            :host {
                display: contents;
            }

            .${ Presentation.Image.name } {
                margin-top: -64px;
            }
        `;
    }
}
