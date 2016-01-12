System.config({
    packages: {
        app: {
            format: 'register',
            defaultExtension: 'js'
        }
    },
    map: {
       
    }
});
System.import('app/boot')
    .then(null, console.error.bind(console)
);