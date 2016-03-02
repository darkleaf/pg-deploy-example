export default {
    filters: {
        emailEq(email) {
            return {
                condition: `entity.data->'email' = ${email}`
            }
        }
    }
};
