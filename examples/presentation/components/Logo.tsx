import * as Cortex from 'cortex';

export default class Logo extends Cortex.Component {

    public render(): Cortex.Node[] {
        return [
            <HTMLImageElement src='assets/web_components_logo.png' style={ { position: 'absolute', right: '-16px', top: '20px' } } width={ 200 }/>
        ];
    }
}
