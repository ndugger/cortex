import * as Cortex from 'cortex';

import Button from './Button';
import Spacer from './Spacer';
import Typography from './Typography';

import palette from '../utilities/palette';

export default class Pane extends Cortex.Component {

    public action: string;
    public header: string;
    public subheader: string;

    public onaction: (event: Event) => void;

    private handleAction(): void {
        const event = new Event('action');

        if (this.onaction) {
            this.onaction(event);
        }

        this.dispatchEvent(event);
    }

    public render(): Cortex.Node[] {
        return [
            <HTMLElement tag='header'>
                <HTMLDivElement>
                    <Typography textContent={ this.header } variant='header'/>
                    <Spacer width={ 8 }/>
                    <Typography textContent={ this.subheader } variant='subheader'/>
                </HTMLDivElement>
                <HTMLDivElement style={ { flexGrow: '1' } }/>
                <Button onclick={ () => this.handleAction() }>
                    <Typography textContent={ this.action } variant='content'/>
                </Button>
            </HTMLElement>,
            <HTMLElement tag='section'>
                <HTMLSlotElement/>
            </HTMLElement>
        ];
    }

    public theme(): string {
        return `
            :host {
                background: rgb(${ palette.white });
                border-radius: 16px;
                box-shadow: 0 8px 16px rgba(${ palette.black }, 0.2);
                display: block;
            }

            header {
                align-items: center;
                background: rgba(${ palette.black }, 0.06);
                border-bottom: 1px solid rgba(${ palette.black }, 0.12);
                border-radius: 16px 16px 0 0;
                display: flex;
                height: 48px;
                padding: 0 16px;
            }

            header > .${ HTMLDivElement.name } {
                align-items: baseline;
                display: flex;
            }

            section {

            }
        `;
    }
}
