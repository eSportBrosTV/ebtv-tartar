const PolicyCombiner = require("../utils/PolicyCombiner");
const AdminPolices = require("./AdminPolicies");
const OrgaPolicies = require("./OrgaPolicies");

module.exports = {
    admin: AdminPolices,
    orga: OrgaPolicies,

    and: PolicyCombiner.and,
    or: PolicyCombiner.or
}