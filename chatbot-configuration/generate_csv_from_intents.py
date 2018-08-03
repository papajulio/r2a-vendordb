#!/usr/bin/env python

import argparse
import json
import logging
import os


def print_intent(intent):
    logger.info("Generating Info for intent {}...".format(intent['name']))
    with open('intents.txt', 'a') as intents_file:

        intents_file.write(intent['name'])
        intents_file.write("\n\n")
        for message in intent['messages']:
            intents_file.write(message['text'].encode('utf-8'))
            intents_file.write("\n")

        intents_file.write("\n")
        for training_phrase in intent.get('training_phrases', []):
            parts = ""
            for part in training_phrase['parts']:
                parts = parts + part['text']
            intents_file.write(parts)
            intents_file.write("\n")

        intents_file.write("\n")
        for parameter in intent.get('parameters', []):
            for prompt in parameter['prompts']:
                intents_file.write(prompt)
                intents_file.write("\n")
        intents_file.write("\n\n")


def print_entity(entity_name):
    logger.info("Generating Info for entity {}...".format(entity_name))
    with open("data/entities/{}".format(entity_name)) as entity_file:
        entity = json.load(entity_file)
        with open('entities.txt', 'a') as entities_file:
            entities_file.write(entity['name'].encode('utf-8'))
            entities_file.write("\n\n")
            for entry in entity['entries']:
                entities_file.write("\n")
                for synonym in entry['synonyms']:
                    entities_file.write(synonym.encode('utf-8'))
                    entities_file.write("\n")


def parse_args():
    parser = argparse.ArgumentParser(description=__doc__,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--verbose', dest='verbose', action='store_true')
    parser.set_defaults(verbose=False)
    return parser.parse_args()


def configure_logging(verbose):
    if args.verbose:
        logging.basicConfig(level=logging.DEBUG)
    else:
        logging.basicConfig(level=logging.INFO)
    return logging.getLogger(__name__)


if __name__ == '__main__':
    args = parse_args()
    logger = configure_logging(args.verbose)

    for filename in os.listdir('data'):
        if filename.endswith("intent.json"):
            with open('data/' + filename) as intent_file:
                print_intent(json.load(intent_file))
        elif filename.endswith("intents.json"):
            with open('data/' + filename) as intents_file:
                intents = json.load(intents_file)
                for intent in intents['intents']:
                    print_intent(intent)

    for filename in os.listdir('data/entities'):
        print_entity(filename)
