const ObjectsToCsv = require('objects-to-csv');

(() => {

    const fs = require('fs');
    const csv = require('csvtojson');
    const objectsToCsv = require('objects-to-csv');

    function doAction(_args) {
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
        const chunkSize = _args.cs;
        const outputFolderPath = _args.of;
        const valParams = split_validateParams(inputFilePath, columns, chunkSize, outputFolderPath);

        if (valParams) {
            console.log("Parameters are valid".green);
            console.log("Will split file: ", inputFilePath);
            console.log("Columns Spec:", columns);
            console.log("Chunk Size:", chunkSize);
            console.log("Output Folder:", outputFolderPath);

            console.log("Reading the file...");
            csv()
                .fromFile(inputFilePath)
                .then((inputArray) => {
                    console.log("Reading file Complete!".green);

                    let splitContent = {};
                    if (chunkSize > 0) {
                        console.log(`SPLITTING BY CHUNKS.  ${inputArray.length} lines`);
                        splitContent = split_by_chunks(inputArray, valParams);
                    } else {
                        console.log(`SPLITTING BY COLUMNS.  ${inputArray.length} lines`);
                        splitContent = split_by_cols(inputArray, valParams)
                    }
                    console.log("Spliting complete!".green);
                    console.log("Split Keys: ".yellow, Object.keys(splitContent).length);
                    console.log(Object.keys(splitContent));
                    console.log("Saving files...");

                    split_saveFiles(splitContent, outputFolderPath);
                });
        } else {
            console.error("Parameters are invalid!".red);
        }
    }

    function split_by_chunks(inputArray, valParams) {
        let splitContent = inputArray.reduce((resultArray, item, index) => {
            const chunkIndex = Math.floor(index / valParams.chunkSize);
            if (!resultArray[chunkIndex]) {
                resultArray[chunkIndex] = [];
            }
            resultArray[chunkIndex].push(item);
            return resultArray;
        }, []);

        return splitContent;
    }
    function split_by_cols(inputArray, valParams) {
        let splitContent = {};
        for (i = 0; i < inputArray.length; i++) {
            let item = inputArray[i];
            let splitKeys = valParams.columns.map((colNumber) => {
                return Object.keys(item)[colNumber - 1];
            });

            let splitKey = "";
            for (j = 0; j < splitKeys.length; j++) {
                splitKey += (j === 0) ? item[splitKeys[j]] : "|" + item[splitKeys[j]];
            }

            if (splitContent[splitKey] === undefined) {
                splitContent[splitKey] = [];
            }

            splitContent[splitKey].push(item);

        }
        return splitContent;
    }

    function split_saveFiles(splitContent, folder) {
        let totalLines = 0;
        let totalFiles = 0;
        for (item in splitContent) {
            let sanitizedFolder = (folder.slice(-1) === "/" || folder.slice(-1) === "\\") ?
                folder : `${folder}/`;
            let destinationFileName = `${folder}${item.replace(/ /g, "_").toLowerCase()}_${splitContent[item].length}.csv`
            let data = splitContent[item];

            (async () => {
                const tocsv = new ObjectsToCsv(data);
                await tocsv.toDisk(destinationFileName);
            })();

            console.log("File Saved!".green, destinationFileName);
            totalFiles++;
            totalLines += splitContent[item].length;
        }
        console.log(`Finished saving ${totalFiles} files!`.green);
        console.log(`Total Lines: ${totalLines}`);
    }

    /**
     * Validates parameters for the split command. Returns an object with the validated parameters if validation passess. Generates errors if not.
     * @param {*} inputFilePath 
     * @param {*} columns 
     * @param {*} chunkSize 
     * @param {*} outputFolderPath 
     * @returns 
     */
    function split_validateParams(inputFilePath, columns, chunkSize, outputFolderPath) {
        let errorCount = 0;
        if (!fs.existsSync(inputFilePath)) {
            console.error("ERROR", "--input-file parameter is invalid!", inputFilePath);
            errorCount++;
        }

        if (
            (!columns && !chunkSize)
            || (!columns && !chunkSize > 0)
        ) {
            console.error("ERROR", "--columns or --chunk-size parameters are invalid!", columns, chunkSize);
            errorCount++;
        }

        if (!chunkSize) {
            try {
                let colArray = JSON.parse(`[${columns}]`);
                console.log("COLARRAY", colArray)
                if (colArray && colArray.length === 0) {
                    console.error("ERROR", "Invalid column array specification ( --columns )", columns, chunkSize);
                    errorCount++;
                } else {
                    columns = colArray;
                }
            } catch (ex) {
                console.error("ERROR", "Invalid column array specification ( --columns )", columns, chunkSize);
                errorCount++;
            }
        }


        if (!fs.existsSync(outputFolderPath)) {
            console.error("ERROR", "--output-folder parameter is invalid!", outputFolderPath);
            errorCount++;
        }

        if (errorCount === 0) {
            return { inputFilePath, columns, chunkSize, outputFolderPath };
        }

    }

    function join() {
        console.error("OUR APOLOGIES. JOIN IS NOT IMPLEMENTED YET. PLEASE COME BACK SOON!".bgRed);
    }

    function aggregate() {
        console.error("OUR APOLOGIES. AGGREGATE IS NOT IMPLEMENTED YET. PLEASE COME BACK SOON!".bgRed);
    }

    function findDuplicates() {
        console.error("OUR APOLOGIES. FIND DUPLICATES IS NOT IMPLEMENTED YET. PLEASE COME BACK SOON!".bgRed);
    }

    exports.Do = doAction;

})();