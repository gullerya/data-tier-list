import fs from 'fs';
import path from 'path';
import fsExtra from 'fs-extra';
import uglifyES from 'uglify-es';

console.info('*** CLEANUP ***');
fsExtra.emptyDirSync('./dist');

console.info('*** COPY ***');
fsExtra.copySync('./src', './dist');

console.info('*** PROCESS IMPORT MAPS ***');
const importMapResourceArg = process.argv.find(a => a.startsWith('--importmap='));
const importMapResource = typeof importMapResourceArg === 'string' ? importMapResourceArg.replace('--importmap=', '') : null;
processImportMaps('./dist', importMapResource);

console.info('*** MINIFY ***');
fs.writeFileSync(
	'dist/data-tier-list.min.js',
	uglifyES.minify({ 'dist/data-tier-list.min.js': fs.readFileSync('dist/data-tier-list.js', { encoding: 'utf8' }) }).code
);

console.info('*** DONE ***');

function processImportMaps(rootFolder, importMapResource) {
	const importMap = prepareImportMap(importMapResource);
	if (!importMap || typeof importMap.imports !== 'object' || !Object.keys(importMap.imports).length) {
		console.info('import map has no import mappings, nothing to do');
	}
	const importKeys = Object.keys(importMap.imports);

	if (!fs.existsSync(rootFolder)) {
		console.warn(`the specified root folder '${rootFolder}' is not exists, nothing to do`);
		return;
	}

	(function processEntry(dir, file) {
		const fullPath = path.join(dir, file);
		if (fs.statSync(fullPath).isDirectory()) {
			const children = fs.readdirSync(fullPath);
			for (const child of children) {
				processEntry(fullPath, child);
			}
		} else {
			console.info(`\tprocessing '${fullPath}'`);
			let ftext = fs.readFileSync(fullPath, { encoding: 'utf-8' });

			for (const importKey of importKeys) {
				ftext = ftext.replace(new RegExp(`(import.*['"])${importKey}`, 'g'), `$1${importMap.imports[importKey]}`);
			}

			fs.writeFileSync(fullPath, ftext, { encoding: 'utf-8' });
		}
	})(rootFolder, '');
}

function prepareImportMap(importMapResource) {
	const defaultImportMapResource = 'importmap.json';
	if (!importMapResource) {
		console.log(`no import map resource specified, falling back to default '${defaultImportMapResource}'`);
		importMapResource = defaultImportMapResource;
	}
	let importMapText;
	try {
		importMapText = fs.readFileSync(importMapResource, { encoding: 'utf-8' });
	} catch (e) {
		console.error(`failed to read import map resource from '${importMapResource}' due to following:`);
		console.error(e);
		process.exit(1);
	}
	return JSON.parse(importMapText);
}