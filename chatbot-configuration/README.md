Project structure and content
=============================

* `data` folder contains the intents and entitites of the chatbot in json format
* `load_data.py` script to update or create the chatbot configuration in the dialogflow platform
* `generate_csv_from_intents.py` python script to generate txt files to ease revision from json files
* `replace_string_in_intents.sh` simple script to substitue strings in the json config files easily
* `requirements.txt` list of the python packages required to run the load_data.py script

DialogFlow chatbot configuration
================================

This folder contains the dialogflow configuration of the chatbot

Follow these steps to configure your google project so you can upload/edit the chatbot:
* https://github.com/dialogflow/dialogflow-python-client-v2#before-you-begin

Execute the script in the following way to create or update the chatbot:

```
GOOGLE_APPLICATION_CREDENTIALS={PATH_TO_JSON_FILE_WITH_THE_GOOGLE_CREDENTIALS} python load_data.py --project-id {PROJECT_ID}
```

Generate txt files from intents and entities
============================================

To ease the review from a non technical people we can generate a couple of simple txt files to be reviewed

To do so execute the following command:

```
python generate_csv_from_intents.py
```

This will generate two files, intents.txt and entities.txt, that will contain the phrases from the configuration in the data folder

Links
=====

* Configuration console for dialogflow platform: https://console.dialogflow.com
* Documentation about the dialogflow platform: https://dialogflow.com/docs/getting-started
