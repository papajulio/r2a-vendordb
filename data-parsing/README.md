# Data tools information

## Contents of the folder

* `*.xlsx` contains the raw information provided
* `*.csv` files contains the processed information (using Google Spreadsheet)
* `*.py` scripts to generate the output we need

## Executing the script

```
python csv_data_to_json.py
```

That will generate a `result.json` containing a dictionary with multiple dictionaries (id-data):

* personas
* technologies
* objectives
* vendors

We can beautify the JSON file using any online tool.
