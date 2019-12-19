export class JsonValueConverter {
    toView(value) {
        return JSON.stringify(value, null, 2);
    }
}
