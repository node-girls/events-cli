const clear = require('clear');
const chalk = require('chalk');
const figlet = require('figlet');
const inquirer = require('inquirer');
const questions = require('./questions');


init();
askQuestions();

function init () {
  clear();
  console.log(
    chalk.green(
      figlet.textSync('Node Girls\nevent cli', { horizontalLayout: 'full' })
    )
  );
}
function askQuestions () {
  inquirer.prompt(questions).then((answers) => {
    if (answers.confirm === false) {
      init();
      askQuestions();
    }
    // generate HTML
  });
}
