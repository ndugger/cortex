import * as Cortex from 'cortex';

import Presentation from './components/Presentation';

import CoverSlide from './slides/CoverSlide';
import ExamplePresentationSlide from './slides/ExamplePresentationSlide';
import ExampleTodoSlide from './slides/ExampleTodoSlide';
import ExampleVideoPlayerSlide from './slides/ExampleVideoPlayerSlide';
import IntroSlide from './slides/IntroSlide';

class PresentationExample extends Cortex.Component {

    private slides = [
        { component: CoverSlide },
        { component: IntroSlide },
        { component: ExampleTodoSlide },
        { component: ExampleVideoPlayerSlide },
        { component: ExamplePresentationSlide }
    ];

    public render(): Cortex.Node[] {
        return [
            <Presentation>

                { this.slides.map(slide => (
                    <Presentation.Slide>
                        <slide.component/>
                    </Presentation.Slide>
                )) }

            </Presentation>
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

document.body.append(new PresentationExample());
