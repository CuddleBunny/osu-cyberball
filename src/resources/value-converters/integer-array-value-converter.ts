export class IntegerArrayValueConverter {
    fromView(value: string) {
        // Remove anything but numbers and commas.
        value = value.replace(/[^0-9,]/g, '');

        // Remove any trailing comma.
        if(value[value.length - 1] == ',')
            value = value.substr(0, value.length - 1);

        return JSON.parse(`[${value}]`);
    }

    toView(value: Array<number>) {
        return JSON.stringify(value).substr(1, value.length * 2 - 1);
    }
}
