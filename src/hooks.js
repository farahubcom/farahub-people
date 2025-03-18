const hooks = module => ({
    'Authentication': {
        'main.createNew.preSave': ({ user, data }) => {
            if (!user.name) {
                user.name = [data.firstName, data.lastName].join(' ');
            }
        }
    }
    //
})

module.exports = hooks;