import fs from 'fs';
import fsExtra from 'fs-extra';
import uglifyES from 'uglify-es';

console.info('*** CLEANUP ***');
fsExtra.emptyDirSync('./dist');

console.info('*** COPY ***');
fsExtra.copySync('./src', './dist');

console.info('*** PROCESS IMPORT MAPS ***');
processImportMaps();

console.info('*** MINIFY ***');
fs.writeFileSync(
	'dist/data-tier-list.min.js',
	uglifyES.minify({ 'dist/data-tier-list.min.js': fs.readFileSync('dist/data-tier-list.js', { encoding: 'utf8' }) }).code
);

console.info('*** DONE ***');
fsExtra.copySync('./src/data-tier-list.js', './dist/data-tier-list.js');

function processImportMaps() {
	const defaultImportMapResource = 'importmap.json';
	let importMapResource = process.argv.find(a => {

	});

	if (!importMapResource) {
		console.log(`\tno import map resource specified, falling back to default '${defaultImportMapResource}'`);
		importMapResource = defaultImportMapResource;
	}

	//	TODO read if present continue, if now - return

	//	if present - go over the files in the dist
	//		inspect any import (also lookup for dynamic imports)
	//		in any found import statement replace the module specifier with the one from the map
}