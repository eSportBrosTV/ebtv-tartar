const { z } = require('zod');

const definitions = [
    require('./olympe')
];

const platforms = new Map(definitions.map((definition) => {
    const { properties = {} } = z.toJSONSchema(definition.schema);
    const secretKeys = new Set(Object.keys(properties).filter((key) => properties[key].secret === true));

    return [definition.id, { ...definition, secretKeys }];
}));

const getPlatform = (id) => platforms.get(id) ?? null;

module.exports = {
    getPlatform
};
