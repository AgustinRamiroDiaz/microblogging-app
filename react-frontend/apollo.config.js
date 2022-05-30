/* 
The apollo configuration doesn't allow schema splitted into multiple files.
Therefore we create a temporary file with the content of all the schemas and
use it in the apollo configuration.
*/
const { readdirSync, readFileSync, writeFileSync } = require('fs');
const { join } = require('path');
const { tmpdir } = require('os');

const schemasFolder = __dirname + '/../graphql-schema';
const completeSchema = readdirSync(schemasFolder)
  .map(x => readFileSync(join(schemasFolder, x), 'utf-8'))
  .join('\n\n');

const tmpFile = join(tmpdir(), 'microblogging-app.graphqls')
writeFileSync(tmpFile, completeSchema);

module.exports = {
  client: {
    service: {
      name: 'project-name',
      localSchemaFile: tmpFile,
    },
  },
};
