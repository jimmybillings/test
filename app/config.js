System.config({
    packages: {
        app: {
            defaultExtension: 'js'
        }
    }
});
System.import('app/boot')
    .then(null, console.error.bind(console)
);