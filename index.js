#!/usr/bin/env node

(() => {
  const minimist = require("minimist");
  
  const csvdo = require('./csv-do-lib');
  const csvDoVersion = require("./package.json").version;
  const fs = require('fs');
  var sc = require('SuperColors.js');
  let jnl = require("jnconsole");
  let lh = logHelper();
  

  lh.splash();
  lh.usage();
  const _args = checkParameters();
  csvdo.Do(_args);


  /*********************/
  /*------------------------------------------------------------------------*/
  ///FUNCTIONS

  function checkParameters() {
    let m_args = minimist(process.argv.slice(2), {
      alias: {
        split: 'sp',
        'file1':'f1',
        'file2':'f2',
        'input-file': 'if',
        'output-folder': 'of',
        'output-file':'ofl',
        'columns': 'c',
        'chunk-size': 'cs'
      }
    });
    console.log("M_ARGS", m_args);
    return m_args;
  }








  function getParamsObject(_args) {
    let action = _args._[0];
    s
  }

  function logHelper() {
    return {
      splash: function () {
        const out = console.info;

        out("\n".repeat(30));
        out("-".repeat(30));
        out("WELCOME TO YOUR CSV-DO APP\nYour swiss army knife for manipulating CSV files from the command line".green);
        out("VERSION: ", `${csvDoVersion}`.brightYellow);
        out("With CSV-DO you can do operations on csv files such as split, join, aggregate, find duplicates through the command line.");
        out("\n (!) NOTICE THIS TOOL IS STILL NOT FUNCTIONAL AT ALL!")
      },
      header: function (text) {
        const out = console.info;
        out("\n".repeat(2));
        out("-".repeat(30));
        out("-".repeat(30));
        out(text);
      },

      footer: function (text) {
        const out = console.info;
        out("\n");
        out("-".repeat(30));
        out(text);
        out("-".repeat(30));
        out("-".repeat(30));
        out("\n");
      },
      usage: function () {
        lh.header("HOW TO USE csv-do");
        const out = console.info;

        out("csv-do can perform the following functions for you on CSV files: split, join, aggregate, find-duplicates");
        out("Examples:");

        out("SPLIT:      csv-do split --input-file ./myfile.csv --columns 2 --output-folder ./split/");
        out("            csv-do split --input-file ./myfile.csv --columns 2,5 --output-folder ./split/");
        out("            csv-do split --input-file myfile.csv --chunk-size 100 --output-folder ./split/");
        out("");
        out("COMPARE:    csv-do compare --file1 ./file1.csv --file2 ./file2.csv --output-file ./compare_result1.csv");
        out("COMPARE:    csv-do compare --file1 ./file1b.csv --file2 ./file2.csv --output-file ./compare_result2.csv");
        //out("            csv-do compare --file1 ./file1.csv --file2 ./file2.csv --columns \"1,2,3\" --outputFile ./file3.csv");
        /**
        out("JOIN:       csv-do join --input-folder ./mycsvs/ --output-file ./mynew.csv");
        out("AGGREGATE:  csv-do aggregate --input-file ./myfile.csv --group-by \"1,2,3\" --function count -function-column 4 --output-file ./count.csv");
        out("FIND DUPS:  csv-do find-duplicates --input-file ./myfile.csv --columns \"1,2,3\" --output-file ./count.csv");
        */
        lh.footer("Have a nice day!")
      }
    }
  }
})();


/*
Thanks:
https://medium.com/netscape/a-guide-to-create-a-nodejs-command-line-package-c2166ad0452e
*/