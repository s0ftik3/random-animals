const User = require('./models/User');

module.exports = async (data) => {
    const user = new User(data);
    await user.save().then(() => console.log(`${data.id}: user recorded.`));
};