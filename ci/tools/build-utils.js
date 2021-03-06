import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import fsExtra from 'fs-extra';
import uglifyES from 'uglify-es';

console.info('*** CLEANUP ***');
fsExtra.emptyDirSync('./dist');

console.info('*** COPY ***');
fsExtra.copySync('./src', './dist');

console.info('*** PROCESS IMPORT MAPS ***');
const importMapResourceArg = process.argv.find(a => a.startsWith('--importmap='));
if (importMapResourceArg) {
	const importMapResource = importMapResourceArg.replace('--importmap=', '');
	processImportMaps('./dist', importMapResource);
} else {
	console.info('\timport map resource not specified, skipping this step');
}

console.info('*** MINIFY ***');
fs.writeFileSync(
	'dist/data-tier-list.min.js',
	uglifyES.minify({ 'dist/data-tier-list.min.js': fs.readFileSync('dist/data-tier-list.js', { encoding: 'utf8' }) }).code
);

const hashingAlgoritm = 'sha512'
console.info(`*** GENERATE ${hashingAlgoritm} ***`);
for (const f of ['dist/data-tier-list.min.js', 'dist/data-tier-list.js']) {
	const text = fs.readFileSync(f, { encoding: 'utf-8' });
	const algo = crypto.createHash(hashingAlgoritm);
	const hash = algo.update(text, 'utf-8').digest().toString('base64');
	console.info(`\t${hashingAlgoritm} of '${f}' is '${hash}'`);
	//	TODO: put those 2 hashes into an example in the readme (should be copy-pasteable)
	//	the hash should run before last commit that publishes to NPM (to be able to see it in the NPM up-to-date)
	//	the actual CDN build will run as part of CDN, so the flow is somewhat split-merged...
}

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
	let result = null;
	try {
		const importMapText = fs.readFileSync(importMapResource, { encoding: 'utf-8' });
		result = JSON.parse(importMapText);
	} catch (e) {
		console.error(`failed to read/parse import map resource from '${importMapResource}' due to following:`);
		console.error(e);
	}
	return result;
}