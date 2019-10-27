const { arraysFromDsv } = require('./');

Promise.resolve().then(main).catch(console.log);

async function main() {
  const list = [
    'Hello, world',
    'Second, line, with, strings',
    '',
    'Third, line'
  ]
  for await (let array of arraysFromDsv(list, { delimiter : ',' })) {
    console.log('-', array);
  }
}
