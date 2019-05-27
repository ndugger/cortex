import * as Cortex from 'cortex';

import palette from '../utilities/palette';

import FormFieldOption from './FormFieldOption';
import List from './List';
import Typography from './Typography';

interface FormFieldState {
    focused: boolean;
    value: any;
}

type FormFieldType = 'text' | 'number' | 'date' | 'email' | 'password' | 'select';

export default class FormField<Type = any> extends Cortex.Component {

    public static Option = FormFieldOption;

    public state = new Cortex.Store<FormFieldState>({
        focused: false,
        value: null
    });

    public label: string;
    public placeholder: string;
    public type: FormFieldType;
    public value: Type;

    private handleBlur(): void {
        this.state.focused = false;
    }

    private handleFocus(): void {
        this.state.focused = true;
    }

    private handleOptionClick(event: Event, option: FormFieldOption): void {
        event.stopPropagation();

        this.state.value = option.value;
        this.state.focused = false;
    }

    private handleInput(event: Event): void {
        this.state.value = (event.target as HTMLInputElement).value;
    }

    protected handleComponentConnect(): void {
        this.state.observe(this);

        if (this.type === 'select') {
            const options = Array.from(this.childNodes) as FormFieldOption[];
            const firstValue = options[ 0 ] ? options[ 0 ].value : null;

            this.state.value = firstValue;
        }
    }

    public render(): Cortex.Node[] {
        const options = Array.from(this.childNodes) as FormFieldOption[];
        const selectedOption = options.find(option => option.value === this.state.value);
        const selectedLabel = selectedOption ? selectedOption.label : options[ 0 ] ? options[ 0 ].label : null;

        return [

            (this.label) && (
                <HTMLLabelElement htmlFor='input'>
                    <Typography bold variant='content'>
                        { this.label }
                    </Typography>
                </HTMLLabelElement>
            ),

            (this.type === 'select') && (
                <HTMLDivElement id='select' onblur={ () => this.handleBlur() } onclick={ () => this.handleFocus() } tabIndex={ 1 }>

                    { selectedLabel }

                    <HTMLDivElement id='select_options' style={ { display: this.state.focused ? 'unset' : 'none' } }>
                        <List>

                            { (Array.from(this.childNodes) as FormFieldOption[]).map(option => (
                                <List.Item onclick={ e => this.handleOptionClick(e, option) }>
                                    <Typography textContent={ option.label } variant='subheader'/>
                                </List.Item>
                            )) }

                        </List>
                    </HTMLDivElement>
                </HTMLDivElement>
            ),

            (this.type !== 'select') && (
                <HTMLInputElement id='input' oninput={ e => this.handleInput(e) } placeholder={ this.placeholder } type={ this.type } value={ this.state.value }/>
            )
        ];
    }

    public theme(): string {
        return `
            .${ HTMLLabelElement.name } {
                display: inline-block;
                margin-bottom: 4px;
            }

            .${ HTMLInputElement.name }, #select {
                border: 1px solid rgba(${ palette.black }, 0.12);
                border-radius: 4px;
                box-sizing: border-box;
                font-family: Assistant;
                font-size: 0.8rem;
                height: 29px;
                outline: none;
                padding: 0 8px;
                width: 100%;
            }

            .${ HTMLInputElement.name }:hover, #select:hover {
                border: 1px solid rgba(${ palette.black }, 0.25);
            }

            .${ HTMLInputElement.name }:focus, #select:focus {
                border: 1px solid rgb(${ palette.blue });
            }

            #select {
                align-items: center;
                display: flex;
                position: relative;
            }

            #select_options {
                background: rgb(${ palette.white });
                border: 1px solid rgba(${ palette.black }, 0.25);
                border-radius: 4px;
                box-shadow: 0 8px 16px rgba(${ palette.black }, 0.2);
                box-sizing: border-box;
                left: 0;
                margin-top: 4px;
                position: absolute;
                top: 100%;
                width: 100%;
            }

            .${ List.Item.name } {
                padding: 4px 8px;
            }

            .${ List.Item.name }:hover {
                background: rgba(${ palette.green }, 0.16);
            }
        `;
    }
}
