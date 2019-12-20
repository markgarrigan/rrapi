const axios = require('axios');
const cheerio = require('cheerio');

const Scraper = () => {
  const getHTML = async (url) => {
    const {
      data: html
    } = await axios.get(url);
    return html;
  }

  const getResults = (html) => {
    const $ = cheerio.load(html);
    const results = {};
    const fuzzy = FuzzySet();

    $('.participants').find('tbody tr').each(function () {
      const bib = $(this).find('.bib').text().replace(/\n/g, '');
      fuzzy.add(bib);
      const nameObj = $(this).find('.name-container');
      const name = nameObj.attr('title');
      const url = nameObj.find('a').attr('href');
      fuzzy.add(name);

      results[bib] = url;
      results[name] = url;
    });

    return [results, fuzzy];
  }

  const getRaces = (html) => {
    const $ = cheerio.load(html);
    const races = {};

    $('.race-list-month').each(function () {
      const [month, year] = $(this)
        .find('.race-list-title')
        .text()
        .replace(/\n/g, '')
        .split(' ');
      $(this).find('.race-list-item').each(function () {
        const url = $(this).find('a').attr('href');
        const [monthAbbr, date] = $(this).find('.race-list-item-activity')
          .text()
          .replace(/[-\n]/g, '')
          .split(' ');
        const name = $(this).find('.race-list-item-title')
          .text()
          .replace(/[-\n]/g, '');

        if (!races[year]) {
          races[year] = {}
        }
        if (!races[year][month]) {
          races[year][month] = {}
        }
        if (!races[year][month][date]) {
          races[year][month][date] = {}
        }
        if (!races[year][month][date][name]) {
          races[year][month][date][name] = url
        }
      });
    });
    return races;
  }
  return {
    getHTML,
    getRaces,
    getResults
  }
}

// class Scraper {

//   async getHTML(url) {
//     const {
//       data: html
//     } = await axios.get(url);
//     return html;
//   }

//   getResults(html) {
//     const $ = cheerio.load(html);
//     const results = {};
//     const fuzzy = FuzzySet();

//     $('.participants').find('tbody tr').each(function () {
//       const bib = $(this).find('.bib').text().replace(/\n/g, '');
//       const nameObj = $(this).find('.name-container');
//       const name = nameObj.attr('title');
//       const url = nameObj.find('a').attr('href');
//       fuzzy.add(name);

//       results[bib] = url;
//       results[name] = url;
//     });

//     return [results, fuzzy];
//   }

//   getRaces(html) {
//     const $ = cheerio.load(html);
//     const races = {};

//     $('.race-list-month').each(function () {
//       const [month, year] = $(this)
//         .find('.race-list-title')
//         .text()
//         .replace(/\n/g, '')
//         .split(' ');
//       $(this).find('.race-list-item').each(function () {
//         const url = $(this).find('a').attr('href');
//         const [monthAbbr, date] = $(this).find('.race-list-item-activity')
//           .text()
//           .replace(/[-\n]/g, '')
//           .split(' ');
//         const name = $(this).find('.race-list-item-title')
//           .text()
//           .replace(/[-\n]/g, '');

//         if (!races[year]) {
//           races[year] = {}
//         }
//         if (!races[year][month]) {
//           races[year][month] = {}
//         }
//         if (!races[year][month][date]) {
//           races[year][month][date] = {}
//         }
//         if (!races[year][month][date][name]) {
//           races[year][month][date][name] = url
//         }
//       });
//     });
//     return races;
//   }

// };

module.exports = Scraper();