class PolicyCombiner {
    static and = (...policies) => async (req) => {
        for (const policy of policies) {
            const result = await policy(req);
            if (result !== true) return result; 
        }
        return true;
    };

    static or = (...policies) => async (req) => {
        let lastError = "Accès refusé.";
        for (const policy of policies) {
            const result = await policy(req);
            if (result === true) return true; 
            lastError = result; 
        }
        return lastError;
    };
}

module.exports = PolicyCombiner;