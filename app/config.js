System.config({
    packages: {
        app: {
            defaultExtension: 'js'
        }
    },
    map: {
       
    }
});
System.import('app/boot')
    .then(null, console.error.bind(console)
);