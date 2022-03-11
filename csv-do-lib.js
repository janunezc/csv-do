(() => {

    const fs = require('fs');

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

        } else {
            console.error("Parameters are invalid!".red);
        }
    }

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
                console.log("COLARRAY", colArray, chunkSize)
                if (colArray && colArray.length === 0) {
                    console.error("ERROR", "Invalid column array specification ( --columns )", columns, chunkSize);
                    errorCount++;
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
            return { inputFilePath, columns, outputFolderPath };
        }

    }


    exports.Do = doAction;

})();