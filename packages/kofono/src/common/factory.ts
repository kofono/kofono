export interface Factory<TFactoryHandler> {
    register(name: string, handler: TFactoryHandler): Factory<TFactoryHandler>;
    get(name: string): TFactoryHandler | undefined;
    has(name: string): boolean;
}
