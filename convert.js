const fs = require('fs');
const path = require('path');
const converter = require('muban-convert-hbs').default;
const glob = require('glob-all');

// Configuration.
const sourceExtension = '.handlebars';
const targetExtension = '.twig';
const sourceFiles = [
    'src/@koop-components/**/*' + sourceExtension,
];

// Execute.
try {
    // Collect all files and converted them.
    glob.sync(sourceFiles).forEach((sourceFile, i) => {
        const twigTemplate = converter(fs.readFileSync(sourceFile, 'utf-8'), 'twig');
        const targetFile = sourceFile.replace(sourceExtension, targetExtension);
        fs.writeFile(targetFile, twigTemplate, function(err) {
            if (err) {
                return console.log(err);
            }
            console.log('File converted: "'
                + path.basename(sourceFile) + '" => "'
                + path.basename(targetFile) + '"');
        });
    });
}
catch (error) {
    console.error(error);
}