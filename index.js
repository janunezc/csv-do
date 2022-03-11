(()=>{
  const minimist = require("minimist");
  const csv = require('csvtojson');
  let jnl = require("jnconsole");


  console.log("TITLE","\n".repeat(30) + "WELCOME TO YOUR CSV-DO APP\nYour swiss army knife for manipulating CSV files from the command line");
  console.log("SUBTITLE","With CSV-DO you can do operations on csv files such as split, merge, aggregate, slice/dice through the command line");

  showUsage();

  console.log("Checking for parameters...")

  let args = minimist(process.argv.slice(2), {
      alias: {
          file: 'f',
          action: 'a',
          column: 'c'
      }
  });

  console.log(args);

  switch(args.a){
    case "split_by_num":
      splitByNum(args);
    break;
    default:
    console.error("ERR",`***ERROR: Invalid -a (action) parameter supplied "${args.a}"`);
  }



  /*------------------------------------------------------------------------*/
  ///FUNCTIONS

  async function splitByNum(args){

    const csv = require('csvtojson');

    console.log("HEADING","Split by Number of Records!");

    console.log("BODY","loading the file...");

    try {
        csvJson = await csv({
            noheader: true,
            ignoreEmpty: true
        }).fromFile(args.f);

        console.log("BODY",`File loaded! ${csvJson.length} rows.`);
        console.log("BODY","Assuming first row is headers");
        const row_0 = csvJson.shift();
        console.log(row_0, csvJson.length);

        let files = [];


    } catch (error) {
        console.log("BODY",`***ERROR: "${error}"`);
        console.error(`Error reading CSV file: ${error}`);
    }


    console.log("BODY","Initiating logic...");

    console.log("BODY","Logic Finished!");
  }

  function split(csvContent, maxRecords){

  }

  function sleep(delay) {
    const start = new Date().getTime();
    while (new Date().getTime() < start + delay);
  }

  function showUsage(){
    console.log("HEADING","USAGE:");
    console.log("BODY","Split a large file into chunks of 300 rows each: csv-do -a split_by_num -q 300 -f mylargefile.csv");
  }

})();
