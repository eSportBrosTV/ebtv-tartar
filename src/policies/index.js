const PolicyCombiner = require("../utils/PolicyCombiner");
const AdminPolices = require("./AdminPolicies");
const HierarchyPolicies = require("./HierarchyPolicies");
const OrgaPolicies = require("./OrgaPolicies");
const UserPolicies = require("./UserPolicies")

module.exports = {
    admin: AdminPolices,
    orga: OrgaPolicies,
    hierarchy: HierarchyPolicies,
    user: UserPolicies,

    and: PolicyCombiner.and,
    or: PolicyCombiner.or
}