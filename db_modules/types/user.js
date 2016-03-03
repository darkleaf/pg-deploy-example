export default {
    filters: {
        emailEq(email) {
            return {
                condition: `entities.data @> '{"email": "${email}"}'`
            }
        }
    }
};
