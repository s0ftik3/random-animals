const User = require('./models/User');

module.exports = async (id) => {
    return await User.find({ id: id }).then((response) => {
        return response.length <= 0 ? null : response[0];
    });
};