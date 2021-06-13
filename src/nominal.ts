declare class Tagged<T extends string> { protected _nominal_: T }
export type Nominal<T, N extends string> = T & Tagged<N>