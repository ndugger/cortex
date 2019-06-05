import * as Cortex from 'cortex';

import Logo from '../components/Logo';
import Presentation from '../components/Presentation';
import Variable from '../components/Variable';

import { blue } from '../utilities/palette';

export default class IntroSlide extends Cortex.Component {

    public render(): Cortex.Node[] {
        return [
            <Logo/>,
            <Presentation.Layout direction='vertical' grow={ 1 }>
                <Presentation.Heading level={ 2 }>
                    What are "Native Web Components"?
                </Presentation.Heading>
                <Presentation.List>
                    <Presentation.List.Item>
                        <Presentation.Text strike>
                            HTML Imports
                        </Presentation.Text>
                    </Presentation.List.Item>
                    <Presentation.List.Item>
                        <Presentation.Text>
                            <Variable textContent='<template/>'/> Element
                        </Presentation.Text>
                        <Presentation.List sub>
                            <Presentation.List.Item>
                                <Presentation.Text>
                                    Useful in situations not covered by this presentation
                                </Presentation.Text>
                            </Presentation.List.Item>
                        </Presentation.List>
                    </Presentation.List.Item>
                    <Presentation.List.Item>
                        <Presentation.Text color={ `rgb(${ blue })` } display height={ 2.05 }>
                            Custom Elements
                        </Presentation.Text>
                    </Presentation.List.Item>
                    <Presentation.List.Item>
                        <Presentation.Text color={ `rgb(${ blue })` } display height={ 2.05 }>
                            Shadow DOM
                        </Presentation.Text>
                    </Presentation.List.Item>
                </Presentation.List>
                <Presentation.Layout align='center' grow={ 1 } padding={ 80 }>
                    <Presentation.Quote src='WebComponents.org'>
                        <Presentation.Text size={ 1.5 }>
                            Web components are a set of web platform APIs that allow
                            you to create new custom, reusable, encapsulated HTML
                            tags to use in web pages and web apps. Custom components
                            and widgets, built on the Web Component standards,
                            will work across modern browsers.
                        </Presentation.Text>
                    </Presentation.Quote>
                </Presentation.Layout>
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
