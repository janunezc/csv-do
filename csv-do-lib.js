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
            case "compare":
            case "co":
                console.log("COMPARE REQUESTED");
                compare(_args);
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

    function compare(_args) {
        const file1 = _args.f1;
        const file2 = _args.f2;
        const columns = _args.c;
        const outputFile = _args.ofl;

        const valParams = compare_validateParams(file1, file2, columns, outputFile);

        if (valParams) {

            console.log("Parameters are valid".green);
            console.log("Will compare files: ", file1, file2);
            console.log("Columns Spec:", columns);
            console.log("Output File:", outputFile);

            console.log("Reading File1...", file1);
            csv()
                .fromFile(file1)
                .then((csv1) => {
                    console.log("File 1 read!", csv1.length);
                    console.log("Reading File2...", file2);
                    csv()
                        .fromFile(file2)
                        .then((csv2) => {
                            console.log("File 2 read!", csv2.length);

                            if (!columns) {
                                const result = compare_wo_cols(csv1, csv2, outputFile);
                                console.log("result wo cols");
                            } else {
                                const result = compare_by_cols(csv1, csv2, columns, outputFile);
                                console.log("result by cols", result);
                            }
                        })
                        .error((e) => {
                            console.error("ERROR!", e);
                        });
                })
                .error((e) => {
                    console.error("ERROR!", e);
                });


        } else {
            console.error("Parameters are invalid!".red);
        }
    }

    /**
     * Compares two csv contents row by row and outputs the results of the comparison.
     * @param {fs file} csv1 
     * @param {fs file} csv2 
     * @param {output file path} outputFile 
     */
    function compare_wo_cols(csv1, csv2, outputFile) {
        let findings = [];
        let rowsWithFindings = 0;
        let cellsWithFindings = 0;

        for (rowNum = 0; rowNum < csv1.length; rowNum++) {
            let row1 = csv1[rowNum];
            let row2 = csv2[rowNum];
            let rowComparison = compareRows(rowNum, row1, row2);

            if (rowComparison.length > 0) {
                rowsWithFindings++;
                cellsWithFindings += rowComparison.length;
                findings.push(rowComparison);
            }
        }

        if (findings === undefined || findings.length === 0) {
            if (csv1.length === csv2.length) {
                console.log(`No differences found on files. Both have ${csv1.length} rows that match field by field`.green);
            } else {
                console.log(`All rows in file1 match rows in file2.`.green);
                console.log(`   Though file2 has more rows! ${csv1.length} rows in file1 vs. ${csv2.length} rows in file2`.green);
            }
        } else {
            console.log(`Issues found in ${cellsWithFindings} cells within ${rowsWithFindings} rows!`.red);

        }
        return findings;

    }

    function compareRows(rowNum, row1, row2) {
        let row1Keys = Object.keys(row1);
        let keyIndex = 0;

        let issuesFound = [];

        for (key of row1Keys) {
            if (rowNum === 0) {
                console.log(`Analyzing row ${rowNum} for key ${key}`);
            }
            if (row1[key] !== row2[key]) {
                issuesFound.push(`Column "${key}"! V1:"${row1[key]}" should match V2:"${row2[key]}" @ row ${rowNum}`.yellow);
            }
            keyIndex++;
        }

        if (issuesFound.length === 0) {
            //console.log(`ROW: ${rowNum} is a full match!`.green);
        } else {
            console.log(`ROW: ${rowNum} has differences!`.red);
            issuesFound.map((issue) => {
                console.log(`    Item: ${issue}`);
            });
        }

        return issuesFound;

    }

    /**
     * Compares two csv contents finding matching rows by the provided columns.
     * @param {*} csv1 
     * @param {*} csv2 
     * @param {*} columns 
     * @param {*} outputFile 
     */
    function compare_by_cols(csv1, csv2, columns, outputFile) {

    }

    function compare_validateParams(file1, file2, columns, outputFile) {
        let errorCount = 0;
        if (!fs.existsSync(file1)) {
            console.error("ERROR", "--file1 parameter is invalid!", file1);
            errorCount++;
        }

        if (!fs.existsSync(file2)) {
            console.error("ERROR", "--file2 parameter is invalid!", file2);
            errorCount++;
        }

        /*
        if (!outputFile) {
            console.error("ERROR", "--output-file parameter is invalid!", file2);
            errorCount++;
        }
        */

        if (columns) {
            let colArray = JSON.parse(`[${columns}]`);

            if (colArray.length == 0) {
                console.error("ERROR", "--columns parameter is invalid!", file2);
                errorCount++;
            }
        }

        if (errorCount === 0) {
            return { file1, file2, columns, outputFile };
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