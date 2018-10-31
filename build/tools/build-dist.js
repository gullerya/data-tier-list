const
	os = require('os'),
	fsExtra = require('fs-extra'),
	uglifyES = require('uglify-es');

process.stdout.write('*** CLEANUP ***' + os.EOL);
fsExtra.emptyDirSync('./dist');

process.stdout.write('*** BUILD ***' + os.EOL);
fsExtra.copySync('./src/data-tier-list.js', './dist/data-tier-list.js');

process.stdout.write('*** MINIFY ***' + os.EOL);
fs.writeFileSync(
	'dist/data-tier-list.min.js',
	uglifyES.minify({'dist/data-tier-list.min.js': fs.readFileSync('dist/data-tier-list.js', {encoding: 'utf8'})}).code
);

process.stdout.write('*** DONE ***' + os.EOL);
fsExtra.copySync('./src/data-tier-list.js', './dist/data-tier-list.js');