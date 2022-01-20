export function Autobind(_target: any, _methodName: string | Symbol, descriptor: PropertyDescriptor) {
    const originalDescriptor = descriptor.value;
    const newDescriptor: PropertyDescriptor = {
        configurable: true,
        enumerable: false,
        get() {
            return originalDescriptor.bind(this);
        }
    }
    return newDescriptor; 
}