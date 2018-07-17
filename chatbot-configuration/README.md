DialogFlow chatbot configuration
================================

This folder contains the dialogflow configuration of the chatbot

Follow these steps to configure your google project so you can upload/edit the chatbot:
* https://github.com/dialogflow/dialogflow-python-client-v2#before-you-begin

Execute the script in the following way to create or update the chatbot:

```
GOOGLE_APPLICATION_CREDENTIALS={PATH_TO_JSON_FILE_WITH_THE_GOOGLE_CREDENTIALS} python load_data.py --project-id {PROJECT_ID}
```
