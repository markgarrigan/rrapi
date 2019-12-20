#!/usr/bin/env node

const FuzzySet = require('fuzzyset.js');

const scraper = require('./lib/scraper');

const questions = require('./lib/questions');

const {
  getHTML,
  getRaces,
  getResults
} = scraper;

const {
  chooseDate,
  chooseMonth,
  chooseYear,
  chooseName,
  chooseRace,
  chooseSearch,
  getBib,
  getName
} = questions;

async function askWhichRace(races) {
  const {
    year
  } = await chooseYear(races);
  const {
    month
  } = await chooseMonth(races[year]);
  const {
    date
  } = await chooseDate(races[year][month]);
  const {
    race
  } = await chooseRace(races[year][month][date]);
  return races[year][month][date][race];
}

async function askHowToSearch(fields) {
  const {
    search
  } = await chooseSearch(fields);
  return search;
}

async function askForBibNumber(results) {
  const {
    bib
  } = await getBib();
  const bibs = results.get(bib);
  if (!bibs) {
    console.log('Hmm? We couldn\'t find that bib number.');
    return askForBibNumber(results);
  }
  if (bibs.length == 1 && bibs[0][0] == 1) {
    return bibs[0][1];
  } else {
    const {
      chosen
    } = await chooseName(bibs.map((n) => n[1]).slice(0, 5))
    return chosen;
  }
}

async function askForName(results) {
  const {
    name
  } = await getName();
  const names = results.get(name);
  if (!names) {
    console.log('Hmm? We couldn\'t find anyone by that name.');
    return askForName(results);
  }
  if (names.length == 1 && names[0][0] == 1) {
    return names[0][1];
  } else {
    const {
      chosen
    } = await chooseName(names.map((n) => n[1]).slice(0, 5))
    return chosen;
  }
}

const baseURL = 'http://www.racesplitter.com';
const searchFields = ['Bib Number', 'Racer\'s Name'];
const [bib, name] = searchFields;

async function go() {
  const races = getRaces(await getHTML(`${baseURL}/nurun`));
  const raceURL = await askWhichRace(races);
  const [allResults, fuzzyResults] = getResults(await getHTML(`${baseURL}${raceURL}`));
  const searchBy = await askHowToSearch(searchFields);
  let input = '';
  if (searchBy == bib) {
    input = await askForBibNumber(fuzzyResults);
  }
  if (searchBy == name) {
    input = await askForName(fuzzyResults);
  }
  console.log(`${baseURL}${allResults[input]}`);
}

go();