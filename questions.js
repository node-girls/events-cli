const argv  = require('minimist')(process.argv.slice(2));
const chalk = require('chalk');
const moment = require('moment');

const questions = [
  {
    name: 'date',
    type: 'input',
    message: 'When is the event? (DD/MM/YYYY)',
    validate: function (value) {
      if (/\d{1,2}\/\d{1,2}\/\d{4}/.test(value) === false) {
        return 'Please use DD/MM/YYYY format';
      }
      const eventDate = moment(value, 'DD-MM-YYYY');
      if (!eventDate.isValid()) {
        return 'Invalid date. Please re-enter.'
      }
      if (eventDate.isBefore(new Date, 'day')) {
        return 'Sorry, that\'s in the past. Pick another date.';
      }
      return true;
      // check if is a saturday
    }
  },
  {
    name: 'title',
    type: 'list',
    message: 'Select an event type:',
    choices: [
      'Introduction to JavaScript',
      'Introduction to Node.js',
      'Introduction to Node.js and JavaScript'
    ]
  },
  {
    name: 'description',
    type: 'input',
    message: 'Give an event description:'
  },
  {
    name: 'startTime',
    type: 'input',
    message: 'What time does it start?',
    default: '10:00',
    validate: function (time) {
      if (/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time) === false) {
        return 'Please use HH:MM format (including leading zeros)';
      }
      return true;
    }
  },
  {
    name: 'endTime',
    type: 'input',
    message: 'What time does it end?',
    default: '16:00',
    validate: function (time) {
      if (/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time) === false) {
        return 'Please use HH:MM format (including leading zeros)';
      }
      return true;
    }
  },
  {
    name: 'signupURL',
    type: 'input',
    message: 'Enter the URL where people can sign up (e.g. Typeform)'
  },
  {
    name: 'sponsor',
    type: 'input',
    message: 'Who is sponsoring the event?',
    default: 'TBC'
  },
  {
    name: 'location',
    type: 'input',
    message: 'Where is the event happening?',
    default: 'TBC'
  },
  {
    name: 'sponsorWebsite',
    type: 'input',
    message: 'What is the sponsor\'s website?'
  },
  {
    name: 'sponsorImage',
    type: 'input',
    message: 'Do you have an logo for the sponsor?\nIt can be a URL or a local image (relative to the root dir)'
  },
  {
    name: 'confirm',
    type: 'confirm',
    message: 'Are you happy with this?',
    when: finalCheck
  }
];
function finalCheck (answers) {
  questions.forEach((question) => {
    if (question.name !== 'confirm') {
      console.log(`${question.name}:\n ${chalk.inverse(answers[question.name])}`);
    }
  });
  return true;
}
module.exports = questions;
