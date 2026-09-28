const { z } = require('zod');
const { buildValueSchema } = require('../../utils/commandParams');

const baseFields = {
    key: z.string().regex(/^[a-zA-Z][a-zA-Z0-9_]*$/).refine((key) => !(key in Object.prototype), "Cette cle est reservee"),
    label: z.string().min(1),
    description: z.string().optional(),
    required: z.boolean().default(false),
    multiple: z.boolean().default(false),
    default: z.unknown().optional()
};

const noConstraints = z.object({}).strict().default({});

const paramDef = z.discriminatedUnion('type', [
    z.object({
        ...baseFields,
        type: z.literal('string'),
        constraints: z.object({
            minLength: z.int().nonnegative().optional(),
            maxLength: z.int().positive().optional()
        }).strict().default({})
    }).strict(),
    z.object({
        ...baseFields,
        type: z.literal('number'),
        constraints: z.object({
            min: z.number().optional(),
            max: z.number().optional(),
            integer: z.boolean().optional()
        }).strict().default({})
    }).strict(),
    z.object({
        ...baseFields,
        type: z.literal('boolean'),
        constraints: noConstraints
    }).strict(),
    z.object({
        ...baseFields,
        type: z.literal('select'),
        constraints: z.object({
            choices: z.array(z.string().min(1)).min(1)
        }).strict()
    }).strict(),
    z.object({
        ...baseFields,
        type: z.literal('channel'),
        constraints: noConstraints
    }).strict()
]).superRefine((def, ctx) => {
    const { min, max, minLength, maxLength, choices } = def.constraints;

    if (min !== undefined && max !== undefined && min > max) {
        ctx.addIssue({ code: 'custom', path: ['constraints', 'max'], message: "max doit etre superieur ou egal a min" });
    }

    if (minLength !== undefined && maxLength !== undefined && minLength > maxLength) {
        ctx.addIssue({ code: 'custom', path: ['constraints', 'maxLength'], message: "maxLength doit etre superieur ou egal a minLength" });
    }

    if (choices && new Set(choices).size !== choices.length) {
        ctx.addIssue({ code: 'custom', path: ['constraints', 'choices'], message: "Les choix doivent etre uniques" });
    }

    if (def.default !== undefined && !buildValueSchema(def).safeParse(def.default).success) {
        ctx.addIssue({ code: 'custom', path: ['default'], message: "La valeur par defaut ne respecte pas le type du param" });
    }
});

module.exports = z.array(paramDef).superRefine((defs, ctx) => {
    const seen = new Set();

    defs.forEach((def, index) => {
        if (seen.has(def.key)) {
            ctx.addIssue({ code: 'custom', path: [index, 'key'], message: `La cle '${def.key}' est deja utilisee` });
        }
        seen.add(def.key);
    });
});
