System.config({
    packages: {
        app: {
            format: 'register',
            defaultExtension: 'js'
        }
    },
    map: {
        'sample/user': 'lib/user.js'
    }
});
System.import('app/boot')
    .then(null, console.error.bind(console)
);