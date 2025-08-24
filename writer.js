const fs = require('fs');
const minimist = require('minimist');
const LeetCode = require('leetcode-query');

const args = minimist(process.argv.slice(2));
const arg_arr = args['_'];
const lang = args['lang'];

let client = new LeetCode.LeetCode();

const getProblem = async (problem_name) => {
  let problem = await client.problem(problem_name);
  return problem;
};

let problem = getProblem(arg_arr[0]).then((problem) => {
  fs.writeFileSync(
    'problem.json',
    JSON.stringify(problem),
    (err) => console.error
  );
  const CodeSnippet = problem.codeSnippets.find((el) => el.langSlug == lang);

  console.log(problem.sampleTestCase);

  const stream = fs.createWriteStream('main.py');

  stream.write(CodeSnippet.code, (err) => console.error);
  stream.write(
    `\n\ntestcase = ${problem.sampleTestCase}`,
    (err) => console.error
  );
  const metadata = JSON.parse(problem.metaData);
  console.log('metadata : ', metadata);
  stream.write(
    `\n\nprint(Solution().${metadata['name']}(${problem.sampleTestCase}))`,
    (err) => console.error
  );
});