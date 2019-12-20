const inquirer = require('inquirer');

class Questions {

  chooseYear(races) {
    const questions = [{
      type: "list",
      name: "year",
      message: "Choose the year of the race.",
      choices: Object.keys(races),
    }];
    return inquirer.prompt(questions);
  };

  chooseMonth(year) {
    const questions = [{
      type: "list",
      name: "month",
      message: "Choose the month of the race.",
      choices: Object.keys(year),
    }];
    return inquirer.prompt(questions);
  };

  chooseDate(month) {
    const questions = [{
      type: "list",
      name: "date",
      message: "Choose the date of the race.",
      choices: Object.keys(month),
    }];
    return inquirer.prompt(questions);
  };

  chooseRace(date) {
    const questions = [{
      type: "list",
      name: "race",
      message: "Which race?",
      choices: Object.keys(date),
    }];
    return inquirer.prompt(questions);
  };

  chooseSearch(fields) {
    const questions = [{
      type: "list",
      name: "search",
      message: "How would you like to find your result?",
      choices: fields,
    }];
    return inquirer.prompt(questions);
  }

  chooseName(fields) {
    const questions = [{
      type: "list",
      name: "chosen",
      message: "Did you mean?",
      choices: fields,
    }];
    return inquirer.prompt(questions);
  }

  getBib() {
    const questions = [{
      type: "input",
      name: "bib",
      message: "What was your bib number?",
    }];
    return inquirer.prompt(questions);
  }

  getName() {
    const questions = [{
      type: "input",
      name: "name",
      message: "What is the name of the racer?",
    }];
    return inquirer.prompt(questions);
  }

};

module.exports = new Questions();