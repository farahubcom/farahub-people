const hooks = module => ({
    'Authentication': {
        'main.createNew.preSave': ({ user, data }) => {
            user.name = [data.firstName, data.lastName].join(' ');
        }
    }
    //
})

module.exports = hooks;