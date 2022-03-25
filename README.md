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

1. `compare`: You provide two file paths (`--file1` and `--file2`) and the system will highlight differences between the two files in records found by those columns.

```bash
#compare file0.csv against file2.csv row by row.
csv-do compare --file1 ./file1.csv --file2 ./file2.csv

#compare file1b.csv against file2.csv row by row.
csv-do compare --file1 ./file1b.csv --file2 ./file2.csv
```
