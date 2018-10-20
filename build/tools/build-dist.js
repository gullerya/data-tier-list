const
	os = require('os'),
	fsExtra = require('fs-extra');

process.stdout.write('*** CLEANUP ***' + os.EOL + os.EOL);
fsExtra.emptyDirSync('./dist');

process.stdout.write('*** DONE ***' + os.EOL + os.EOL);
