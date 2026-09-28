const { z } = require('zod');

const PARAM_TYPES = ['string', 'number', 'boolean', 'select', 'channel'];

const buildBaseSchema = (def) => {
    const constraints = def.constraints || {};

    switch (def.type) {
        case 'string': {
            let schema = z.string();
            if (constraints.minLength !== undefined) schema = schema.min(constraints.minLength);
            if (constraints.maxLength !== undefined) schema = schema.max(constraints.maxLength);
            return schema;
        }
        case 'number': {
            let schema = constraints.integer ? z.int() : z.number();
            if (constraints.min !== undefined) schema = schema.min(constraints.min);
            if (constraints.max !== undefined) schema = schema.max(constraints.max);
            return schema;
        }
        case 'boolean':
            return z.boolean();
        case 'select':
            return z.enum(constraints.choices);
        case 'channel':
            return z.string().regex(/^\d{17,20}$/, "Identifiant de salon Discord invalide");
        default:
            throw new Error(`Type de param inconnu : ${def.type}`);
    }
};

const buildValueSchema = (def) => {
    const schema = buildBaseSchema(def);
    return def.multiple ? z.array(schema) : schema;
};

const buildValuesSchema = (defs = []) => z.object(
    Object.fromEntries(defs.map((def) => [def.key, buildValueSchema(def).optional()]))
).strict();

const isEmpty = (def, value) => value === undefined || (def.multiple && value.length === 0);

const resolve = (defs = [], values = {}) => {
    const source = values || {};
    const resolved = {};
    const missing = [];
    const invalid = [];

    for (const def of defs) {
        let value = Object.hasOwn(source, def.key) ? source[def.key] : undefined;

        if (value !== undefined && !buildValueSchema(def).safeParse(value).success) {
            invalid.push(def.key);
            value = undefined;
        }

        if (value === undefined) value = def.default;

        if (isEmpty(def, value)) {
            if (def.required) missing.push(def.key);
            continue;
        }

        resolved[def.key] = value;
    }

    return { values: resolved, missing, invalid };
};

module.exports = {
    PARAM_TYPES,
    buildValueSchema,
    buildValuesSchema,
    resolve,
};
