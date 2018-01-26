let getToken = require('./mras/get-token.js'),
    publish = require('./mras/publish.js'),
    createRemote = require('./webdav/create-path.js');

module.exports = function (grunt) {
    grunt.registerTask('publish', function (env) {
        let done = this.async(),
            path = createRemote('');

        switch (env) {
            case 'dev':
            case 'qa':
            case 'staging':
            case 'prod':
                // Fetch the session token.
                grunt.log.ok(`Publishing ${path} ...`);
                getToken(env).then(function (token) {
                    console.log(`\tTOKEN: ${token}`);
                    publish(env, path, token).then(function () {
                        console.log('\t... DONE');
                        done();
                    }).catch(function (err) {
                        grunt.fail.fatal(`MRAS ERR [PUBLISH] ${err}`);
                    });
                }).catch(function (err) {
                    grunt.fail.fatal(`MRAS ERR [LOGIN] ${err}`);
                });
                break;
            default:
                grunt.fail.fatal('Missing environment - dev, qa, staging, prod.\n\tgrunt publish:<env>');
                break;
        }
    });
};
