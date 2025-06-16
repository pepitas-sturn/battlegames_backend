import { ECodeGeneratorCharset, TCodeGeneratorConfig } from "@/Utils/CodeGenerator/types";

const placeholder = '#';

const size = (fn: any, array: any): number => {
    return fn ? [...array].filter((x) => fn(x)).length : array.length;
}

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomElement = (array: any) => array[randomInt(0, array.length - 1)];

const charsets: {
    [key: string]: string
} = {
    numbers: '0123456789',
    alphabetic: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    alphanumeric: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
};
const Charset = (name: ECodeGeneratorCharset) => {
    // console.log('line 21', { name, a: charsets[name] });
    return charsets[name]
};
const createConfig = (config: TCodeGeneratorConfig) => {
    return {
        count: config.count ?? 1,
        length: config.length ?? 8,
        charset: config.charset,
        prefix: config.prefix ?? '',
        postfix: config.postfix ?? '',
        pattern: config.pattern ?? placeholder.repeat(config.length ?? 8),
    }
};
const generateOne = ({ pattern, charset, prefix, postfix }: {
    charset: string;
    prefix: string;
    postfix: string;
    pattern: string;
}) => {
    let code = '';
    for (const p of pattern) {
        const modifiedCharset = Charset(charset as ECodeGeneratorCharset)
        const c = p === placeholder ? randomElement(modifiedCharset) : p;
        code += c;
    }
    return `${prefix}${code}${postfix}`;
};
const isFeasible = (charset: string, pattern: string, count: number) => {
    return charset.length ** size((x: string) => x === placeholder, pattern) >= count;
};

const generate = (config: TCodeGeneratorConfig): string[] => {
    const validatedConfig = createConfig(config);
    const { charset, count, pattern } = validatedConfig;
    if (!isFeasible(charset as string, pattern, count)) {
        throw new Error('Not possible to generate requested number of codes.');
    }
    const codes = new Set<string>();
    while (codes.size < count) {
        codes.add(generateOne({
            ...validatedConfig,
            charset: charset as string
        }));
    }
    return [...codes];
};

export const CodeGeneratorUtils = {
    generate,
    generateOne
}