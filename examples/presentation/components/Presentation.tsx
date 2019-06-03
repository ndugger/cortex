import * as Cortex from 'cortex';

import Icon from './Icon';
import PresentationHeading from './PresentationHeading';
import PresentationImage from './PresentationImage';
import PresentationLayout from './PresentationLayout';
import PresentationList from './PresentationList';
import PresentationSlide from './PresentationSlide';
import PresentationText from './PresentationText';

interface PresentationState {
    active: number;
}

export default class Presentation extends Cortex.Component {

    public static Heading = PresentationHeading;
    public static Image = PresentationImage;
    public static Layout = PresentationLayout;
    public static List = PresentationList;
    public static Slide = PresentationSlide;
    public static Text = PresentationText;

    private state = new Cortex.Store<PresentationState>({
        active: 0
    });

    private navigateBack(): void {

        if (this.state.active > 0) {
            --this.state.active;
        }
    }

    private navigateForward(): void {

        if (this.state.active < this.children.length - 1) {
            ++this.state.active;
        }
    }

    private toggleFullscreen(): void {
        if (document.fullscreenElement) {
            document.exitFullscreen().then(() => this.update());
        }
        else {
            this.requestFullscreen().then(() => this.update());
        }
    }

    protected handleKeydown(event: KeyboardEvent): void {
        const key = event.key.toUpperCase();

        switch (key) {
            case 'ARROWLEFT': {
                this.navigateBack();
                break;
            }
            case 'ARROWRIGHT': {
                this.navigateForward();
                break;
            }
            case 'F': {
                this.toggleFullscreen();
                break;
            }
        }
    }

    protected handleComponentConnect(): void {
        this.state.connect(this);
        window.addEventListener('keydown', e => this.handleKeydown(e));
    }

    public render(): Cortex.Node[] {
        return [
            <HTMLElement tag='main'>
                <HTMLSlotElement name={ `slide_${ this.state.active }` }/>
            </HTMLElement>,
            <HTMLElement tag='nav'>
                <HTMLDivElement id='help'>
                    <Icon glyph='help_outline' onclick={ () => {} } size={ 32 }/>
                </HTMLDivElement>
                <HTMLDivElement id='navigation'>
                    <Icon glyph='arrow_back' onclick={ () => this.navigateBack() } size={ 32 }/>
                    <HTMLDivElement textContent={ `${ this.state.active + 1 } / ${ this.children.length }`}/>
                    <Icon glyph='arrow_forward' onclick={ () => this.navigateForward() } size={ 32 }/>
                </HTMLDivElement>
                <HTMLDivElement id='fullscreen'>
                    <Icon glyph={ document.fullscreenElement ? 'fullscreen_exit' : 'fullscreen' } onclick={ () => this.toggleFullscreen() } size={ 32 }/>
                </HTMLDivElement>
            </HTMLElement>
        ];
    }

    public theme(): string {
        return `
            :host {
                background: rgba(0, 0, 0, 1);
                cursor: default;
                display: block;
                height: 100%;
                overflow: hidden;
                user-select: none;
                width: 100%;
            }

            main {
                background: linear-gradient(45deg,
                    rgba(255, 255, 255, 0.85) 0%,
                    rgba(241, 241, 241, 0.85) 50%,
                    rgba(225, 225, 225, 0.85) 50%,
                    rgba(246, 246, 246, 0.85) 100%
                );
                border-radius: 12px;
                color: rgba(0, 0, 0, 1);
                display: block;
                height: calc(100% - 60px);
                position: relative;
                width: 100%;
            }

            nav {
                align-items: center;
                background: rgba(0, 0, 0, 1);
                box-sizing: border-box;
                color: rgba(255, 255, 255, 1);
                display: flex;
                font-family: Oswald;
                height: 60px;
                padding: 0 16px;
                width: 100%;
            }

            nav .${ Icon.name }:hover {
                color: rgba(206, 255, 62, 1);
            }

            #help {
                display: flex;
            }

            #navigation {
                align-items: center;
                display: flex;
                flex-grow: 1;
                justify-content: center;
            }

            #navigation > .${ HTMLDivElement.name } {
                padding: 0 24px;
            }

            #fullscreen {
                display: flex;
            }
        `;
    }
}
