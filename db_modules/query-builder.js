import _ from 'lodash';

export default function queryBuilder(types, query) {
    const appliedFilters = _.mapValues(query, (filterCall, typeName) => {
        const filterName = _.head(_.keys(filterCall));
        const filterArgs = _.head(_.values(filterCall));
        const filter = _.get(types, [typeName, 'filters', filterName]);
        return filter(filterArgs);
    });

    const where = _(appliedFilters)
        .map((filter, type) => `(entities.type = '${type}' and ${filter.condition})`)
        .join(' or ');

    return `select entities.id, entities.type, entities.data from entities where ${where}`;
}