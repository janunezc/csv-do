# csv-do

Command line utilities for CSV based on NodeJS. Split, Group, Aggregate, Mix, Merge csv files.

## Install

```bash
npm i csv-do -g
```

## How to Use

`csv-do` is a command line utility that provides the following commands:

1. `split`: You provide an `--input-file` and a `--column` number that has values to group content by and splits one csv file into different files based on the content of that column.

```bash
#split myfile.csv by the content of the 2nd column. Drop the files in folder ./split
csv-do split --input-file ./myfile.csv --columns 2 --output-folder ./split/

#split myfile.csv by the content of the 2nd and 5th columns combined. Drop the files in folder ./split
csv-do split --input-file ./myfile.csv --columns 2,5 --output-folder ./split/

#split myfile.csv in files of 100 rows maximum. Drop the files in folder ./split
csv-do split --input-file myfile.csv --chunk-size 100 --output-folder ./split/
```

1. `compare`: You provide two file paths (`--file1` and `--file2`) and a list of column numbers to match rows by (`--colKeys`) and the system will highlight differences between the two files in records found by those columns.

```bash
#compare file0.csv against file2.csv row by row. Dump the result into result.csv
csv-do compare --file1 ./file0.csv --file2 ./file2.csv  --output-file ./result.csv

#(Not Implemented Yet!) compare file0.csv against file2.csv row by row. using columns 5,16,20 as search keys. Dump the result into result.csv
csv-do compare --file1 ./file0.csv --file2 ./file2.csv --key-columns "5,16,20" --output-file ./result.csv

```

1. `join` (not implemented yet): You provide an `input-folder` and an `output-file` path. The system will concatenate all CSV files in the input folder (ordered by name) and save it to the output file.

```bash
csv-do join --input-folder ./mycsvs/ --output-file ./mynew.csv
```

1. `aggregate` (not implemented yet): You provide a series of `group-by` columns, an aggregate `function` (sum, count, average) and an `output-file` path and the system will generate a new CSV with the result of the aggregation.

```bash
csv-do aggregate --input-file ./myfile.csv --group-by "1,2,3" --function count --function-column 4 --output-file ./count.csv
```

1. `find-duplicates` (not implemented yet): You provide an `input-file`, one or more `columns` to search for duplicate values in the file and an `output-file` path. The system will generate an output file with the results of duplicates search.

```bash
csv-do find-duplicates --input-file ./myfile.csv --columns "1,2,3" --output-file ./count.csv
```
