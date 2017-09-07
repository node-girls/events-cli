const fs = require('fs');
const clear = require('clear');
const chalk = require('chalk');
const figlet = require('figlet');
const inquirer = require('inquirer');
const questions = require('./questions');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { Script } = require('vm');

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
    console.log(answers)
    prepareTemplate(answers, function (err, eventHTML) {
      if (err) {
        throw err;
      }
      generateHTML(eventHTML);
    });
  });
}

function prepareTemplate (answers, callback) {
  fs.readFile('../website/templates/event.html', 'utf8', function (err, template) {
    if (err) {
      return callback(err);
    }
    let final = template;
    for (let key in answers) {
      final = final.replace(new RegExp('{{' + key + '}}', 'g'), answers[key]);
    }
    return callback(err, final);
  });
}

function generateHTML (eventHTML) {
  fs.readFile('../website/index.html', function (err, html) {
    const indexDom = new JSDOM(html);
    const upcomingEvent = indexDom.window.document.querySelector('.event-container');
    upcomingEvent.innerHTML = eventHTML;
    fs.writeFile('../website/index.html', indexDom.serialize(), (err)=>{});
  });

  ['london'].forEach((page) => {
    fs.readFile(`../website/${page}.html`, function (err, html) {
      const dom = new JSDOM(html, { runScripts: 'outside-only' });
      // const upcomingEvent = dom.window.document.createElement('div');
      // upcomingEvent.innerHTML = eventHTML;
      // console.log(upcomingEvent)
      // const referenceNode = dom.window.document.querySelector('.event-container');
      // referenceNode.parentNode.insertBefore(upcomingEvent, referenceNode);
      const script = new Script(`
        const upcomingEvent = this.document.createElement('div');
        upcomingEvent.innerHTML = eventHTML;
        const referenceNode = this.document.querySelector('.event-container');
        referenceNode.parentNode.insertBefore(upcomingEvent, referenceNode);
      `);
      script.runInNewContext(eventHTML);
      dom.runVMScript(script);
      console.log(dom.serialize())
      // fs.writeFile(`../website/${page}.html`, dom.serialize(), (err) => {});
    });
  })
}
