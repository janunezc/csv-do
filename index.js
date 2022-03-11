const { Z_DEFAULT_COMPRESSION } = require("zlib");

(() => {
  const minimist = require("minimist");
  const csv = require('csvtojson');
  const fs = require('fs');
  let jnl = require("jnconsole");
  let lh = logHelper();

  lh.splash();
  lh.usage();

  console.log("Checking for parameters...")

  let args = minimist(process.argv.slice(2), {
    alias: {
      file: 'f',
      action: 'a',
      column: 'c'
    }
  });

  console.log(args);

  switch (args.a) {
    case "split_by_num":
      splitByNum(args);
      break;
    default:
      console.error("ERR", `***ERROR: Invalid -a (action) parameter supplied "${args.a}"`);
  }



  /*------------------------------------------------------------------------*/
  ///FUNCTIONS

  function checkParameters() {

  }

  function csvdo() {

  }


  function split(csvContent, maxRecords) {

  }

  function join() {

  }

  function aggregate() {

  }

  function findDuplicates() {

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
        out("SPLIT:      csv-do split -input-file ./myfile.csv -column 2 -output-folder ./splitted/");
        out("JOIN:       csv-do join -input-folder ./mycsvs/ -output-file ./mynew.csv");
        out("AGGREGATE:  csv-do aggregate -input-file ./myfile.csv -group-by \"1,2,3\" -function count -function-column 4 -output-file ./count.csv");
        out("FIND DUPS:  csv-do find-duplicates -input-file ./myfile.csv -columns \"1,2,3\" -output-file ./count.csv");

        lh.footer("Have a nice day!")
      }
    }
  }
})();
