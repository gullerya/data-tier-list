import os from 'os';
import fs from 'fs';
import process from 'process';
import fsExtra from 'fs-extra';
import uglifyES from 'uglify-es';

process.stdout.write('*** CLEANUP ***' + os.EOL);
fsExtra.emptyDirSync('./dist');

process.stdout.write('*** BUILD ***' + os.EOL);
fsExtra.copySync('./node_modules/data-tier/dist', './src/data-tier');
fsExtra.removeSync('./src/data-tier/data-tier.js');
fsExtra.removeSync('./src/data-tier/dom-processor.js');
fsExtra.removeSync('./src/data-tier/ties.js');
fsExtra.removeSync('./src/data-tier/utils.js');
fsExtra.removeSync('./src/data-tier/views.js');
fsExtra.copySync('./src', './dist');

process.stdout.write('*** MINIFY ***' + os.EOL);
fs.writeFileSync(
	'dist/data-tier-list.min.js',
	uglifyES.minify({ 'dist/data-tier-list.min.js': fs.readFileSync('dist/data-tier-list.js', { encoding: 'utf8' }) }).code
);

process.stdout.write('*** DONE ***' + os.EOL);
fsExtra.copySync('./src/data-tier-list.js', './dist/data-tier-list.js');