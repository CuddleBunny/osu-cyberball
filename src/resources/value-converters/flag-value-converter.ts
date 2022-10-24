export class FlagValueConverter {
    fromView(value, source, flag) {
        return value ? source | flag : source & ~flag;
    }

    toView(_value, source, flag) {
        return (source & flag) === flag;
    }
}
