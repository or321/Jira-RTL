/* Script to zip automatically zip the dist folder, and create a ready-to-deploy version */

import fs from 'fs';
import archiver from 'archiver';

const output = fs.createWriteStream('Jira-RTL.zip');
const archive = archiver('zip', { zlib: { level: 9 } });

archive.pipe(output);
archive.directory('dist', false);
archive.finalize();