# csv-do

Command line utilities for CSV based on NodeJS. Split, Group, Aggregate, Mix, Merge csv files.

## Install

```bash
npm i csv-do -g
```

## How to Use

`csv-do` is a command line utility that provides the following commands:

1. `split`: You provide an `input-file` and a `column` number that has values to group content by and splits one csv file into different files based on the content of that column.

```bash
#split myfile.csv by the content of the 2nd column. Drop the files in folder ./splitted
csv-do split --input-file ./myfile.csv --columns 2 --output-folder ./splitted/

#split myfile.csv by the content of the 2nd and 5th columns combined. Drop the files in folder ./splitted
csv-do split --input-file ./myfile.csv --columns 2,5 --output-folder ./splitted/

#split myfile.csv in files of 100 rows maximum. Drop the files in folder ./splitted
csv-do split --input-file myfile.csv --chunk-size 100 --output-folder ./splitted/
```

1. `join`: You provide an `input-folder` and an `output-file` path. The system will concatenate all CSV files in the input folder (ordered by name) and save it to the output file.

```bash
csv-do join --input-folder ./mycsvs/ --output-file ./mynew.csv
```

1. `aggregate`: You provide a series of `group-by` columns, an aggregate `function` (sum, count, average) and an `output-file` path and the system will generate a new CSV with the result of the aggregation.

```bash
csv-do aggregate --input-file ./myfile.csv --group-by "1,2,3" --function count --function-column 4 --output-file ./count.csv
```

1. `find-duplicates`: You provide an `input-file`, one or more `columns` to search for duplicate values in the file and an `output-file` path. The system will generate an output file with the results of duplicates search.

```bash
csv-do find-duplicates --input-file ./myfile.csv --columns "1,2,3" --output-file ./count.csv
```
