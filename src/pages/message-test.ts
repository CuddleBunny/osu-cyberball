import {BindingSignaler} from 'aurelia-templating-resources';
import {autoinject} from 'aurelia-framework';

@autoinject()
export class MessageTestViewModel {
    messages: Array<any> = [];

    constructor(private signaler: BindingSignaler) {}

    bind() {
        window.addEventListener('message', (e) => {
            console.log('message', e.data);
            this.messages.push(e.data);

            this.signaler.signal('message');
        });
    }
}
