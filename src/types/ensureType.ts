export type EnsureType<T> = {
    [P in keyof T]: T[P]
}