export class IntegerValueConverter {
    fromView(value) {
        return parseInt(value ?? '0');
    }
}
