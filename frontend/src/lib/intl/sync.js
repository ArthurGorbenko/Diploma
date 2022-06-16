const {writeFileSync} = require('fs');
const {flatten, unflatten} = require('flat');

const enMessages = require('../../messages/en.json');
const ukMessages = require('../../messages/uk.json');

const enFlatten = flatten(enMessages);
const ukFlatten = flatten(ukMessages);

// Write synced ua.json
const ukSynced = unflatten({...enFlatten, ...ukFlatten});
writeFileSync('src/messages/uk.json', JSON.stringify(ukSynced, null, 2));
