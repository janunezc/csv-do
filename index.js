#!/usr/bin/env node
const { Z_DEFAULT_COMPRESSION } = require("zlib");

(() => {
  const minimist = require("minimist");
  const csv = require('csvtojson');
  const fs = require('fs');
  let jnl = require("jnconsole");
  let lh = logHelper();

  lh.splash();
  lh.usage();
  const _args = checkParameters();
  csvdo(_args);


  /*********************/
  /*------------------------------------------------------------------------*/
  ///FUNCTIONS

  function checkParameters() {
    let m_args = minimist(process.argv.slice(2), {
      alias: {
        split: 'sp',
        'input-file': 'if',
        'output-folder': 'of',
        columns: 'c'
      }
    });
    console.log("M_ARGS", m_args);
    return m_args;
  }

  function csvdo(_args) {
    let action = _args._[0];

    console.log("ACTION", action);

    switch (action) {
      case "split":
      case "sp":
        console.log("SPLIT REQUESTED!");
        split(_args);
        break;
      case "join":
      case "jo":
        console.log("JOIN REQUESTED!");
        join();
        break;
      case "aggregate":
      case "ag":
        console.log("AGGREGATE REQUESTED!");
        aggregate();
        break;
      case "find-duplicates":
      case "fd":
        console.log("FIND DUPLICATES REQUESTED!");
        findDuplicates();
        break;
      default:
        console.error(`ERROR: Invalid Action ${action}`);
    }
  }


  function split(_args) {
    const inputFilePath = _args.if;
    const columns = _args.c;
    const outputFolderPath = _args.of;
    const valParams = split_validateParams(inputFilePath, columns, outputFolderPath);

    if (valParams) {

    } else {
      console.error("Parameters are invalid!");
    }
  }

  function split_validateParams(inputFilePath, columns, outputFolderPath) {
    let errorCount = 0;
    if (!fs.existsSync(inputFilePath)) {
      console.error("ERROR", "--input-file parameter is invalid!", inputFilePath);
      errorCount++;
    }

    if (!columns) {
      console.error("ERROR", "--columns parameter is invalid!", columns);
      errorCount++;
    }

    if (!fs.existsSync(outputFolderPath)) {
      console.error("ERROR", "--output-folder parameter is invalid!", outputFolderPath);
      errorCount++;
    }

    if (errorCount === 0) {
      return { inputFilePath, columns, outputFolderPath };
    }

  }

  function join() {

  }

  function aggregate() {

  }

  function findDuplicates() {

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
        out("WELCOME TO YOUR CSV-DO APP\nYour swiss army knife for manipulating CSV files from the command line");
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
        out("SPLIT:      csv-do split --input-file ./myfile.csv --columns 2 --output-folder ./splitted/");
        out("JOIN:       csv-do join --input-folder ./mycsvs/ --output-file ./mynew.csv");
        out("AGGREGATE:  csv-do aggregate --input-file ./myfile.csv --group-by \"1,2,3\" --function count -function-column 4 --output-file ./count.csv");
        out("FIND DUPS:  csv-do find-duplicates --input-file ./myfile.csv --columns \"1,2,3\" --output-file ./count.csv");

        lh.footer("Have a nice day!")
      }
    }
  }
})();


/*
Thanks:
https://medium.com/netscape/a-guide-to-create-a-nodejs-command-line-package-c2166ad0452e
*/