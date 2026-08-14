import "kofono";

declare module "kofono" {
    interface CustomSchemaValidators {
        isEven: { error?: string };
    }
}
