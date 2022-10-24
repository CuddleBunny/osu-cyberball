export class NumberValueConverter {
    fromView(value) {
        return parseFloat(value ?? '0');
    }
}
