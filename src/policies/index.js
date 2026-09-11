const PolicyCombiner = require("../utils/PolicyCombiner");
const AdminPolices = require("./AdminPolicies");
const HierarchyPolicies = require("./HierarchyPolicies");
const OrgaPolicies = require("./OrgaPolicies");

module.exports = {
    admin: AdminPolices,
    orga: OrgaPolicies,
    hierarchy: HierarchyPolicies,

    and: PolicyCombiner.and,
    or: PolicyCombiner.or
}