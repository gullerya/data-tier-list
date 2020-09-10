import { getSuite } from '../node_modules/just-test/dist/just-test.js';
import '../dist/data-tier-list.js';

const suite = getSuite({ name: 'Template manupulations' });

suite.runTest({ name: 'template first, data last' }, async () => {
});

suite.runTest({ name: 'template last, data first' }, async () => {
});

suite.runTest({ name: 'template change (top level) reflected' }, async () => {
});

suite.runTest({ name: 'template change (nested child) reflected' }, async () => {
});

suite.runTest({ name: 'template clear reflected' }, async () => {
});

suite.runTest({ name: 'template error reflected' }, async () => {
});