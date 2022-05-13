export default function <TResult, TArgs extends Array<any>>(callback: (...args: TArgs) => TResult) {
    return async (...args: TArgs) => {
        return callback(...args);
    }
}