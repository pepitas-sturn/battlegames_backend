export enum ECodeGeneratorCharset {
    NUMBERS = 'numbers',
    ALPHABETIC = 'alphabetic',
    ALPHANUMERIC = 'alphanumeric',
}

export type TCodeGeneratorConfig = {
    length?: number;
    count?: number;
    charset?: ECodeGeneratorCharset;
    prefix?: string;
    postfix?: string;
    pattern?: string;

};

// export declare const charset: (name: ECodeGeneratorCharset) => string;

// export  const generateOne: ({pattern, charset, prefix, postfix,}: Required<Pick<TCodeGeneratorConfig, 'pattern' | 'charset' | 'prefix' | 'postfix'>>) => string;
//
// export const generate: (config: TCodeGeneratorConfig) => string[];
