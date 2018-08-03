#!/usr/bin/env python

import argparse
import dialogflow
import json
import logging
import os
import time


def create_entity_type(project_id, display_name, kind=dialogflow.enums.EntityType.Kind.KIND_MAP):
    entity_types_client = dialogflow.EntityTypesClient()

    parent = entity_types_client.project_agent_path(project_id)
    entity_type = dialogflow.types.EntityType(display_name=display_name, kind=kind)

    response = entity_types_client.create_entity_type(parent, entity_type)
    logger.debug('Entity type created: \n{}'.format(response))


def _get_entity_type_ids(project_id, display_name):
    entity_types_client = dialogflow.EntityTypesClient()

    parent = entity_types_client.project_agent_path(project_id)
    entity_types = entity_types_client.list_entity_types(parent)
    entity_type_names = [
        entity_type.name for entity_type in entity_types
        if entity_type.display_name == display_name]

    return [entity_type_name.split('/')[-1] for entity_type_name in entity_type_names]


def create_or_update_entities(project_id, entity_type_id, entities_json):
    entity_types_client = dialogflow.EntityTypesClient()
    entity_type_path = entity_types_client.entity_type_path(
        project_id, entity_type_id)

    entities = []
    for entity_json in entities_json:
        # Note: synonyms must be exactly [entity_value] if the
        # entity_type's kind is KIND_LIST
        synonyms = entity_json['synonyms'] or [entity_json['value']]

        entity = dialogflow.types.EntityType.Entity()
        entity.value = entity_json['value']
        entity.synonyms.extend(synonyms)

        entities.append(entity)

    response = entity_types_client.batch_update_entities(entity_type_path, entities)
    logger.debug('Entities batch created or updated: \n{}'.format(response))


def _get_message_from_json(intent):
    messages = []
    for message in intent['messages']:
        messages.append(message['text'])

    text = dialogflow.types.Intent.Message.Text(text=messages)
    message = dialogflow.types.Intent.Message(text=text)
    return message


def _get_training_phrases_from_json(intent):
    training_phrases = []
    for training_phrase in intent.get('training_phrases', []):
        parts = []
        for part in training_phrase['parts']:
            parts.append(dialogflow.types.Intent.TrainingPhrase.Part(
                text=part['text'],
                alias=part.get('alias', ''),
                entity_type=part.get('meta', ''),
                user_defined=part.get('userDefined', False)))
        training_phrases.append(dialogflow.types.Intent.TrainingPhrase(parts=parts))
    return training_phrases


def _get_input_context_names_from_json(project_id, intent):
    input_context_names = []
    for input_context_name in intent.get('inputContextNames', []):
        input_context_names.append("projects/{project_id}/agent/sessions/-/contexts/{name}".format(
                    project_id=project_id, name=input_context_name))
    return input_context_names


def _get_output_contexts_from_json(project_id, intent):
    output_contexts = []
    for context in intent.get('outputContexts', []):
        output_contexts.append(dialogflow.types.Context(
                name="projects/{project_id}/agent/sessions/-/contexts/{name}".format(
                    project_id=project_id, name=context['name']),
                lifespan_count=context['lifespan']))
    return output_contexts


def _get_parameters_from_json(intent):
    parameters = []
    for parameter in intent.get('parameters', []):
        parameters.append(dialogflow.types.Intent.Parameter(
                mandatory=parameter['required'],
                entity_type_display_name=parameter['dataType'],
                display_name=parameter['name'],
                value=parameter['value'],
                is_list=parameter['isList'],
                prompts=parameter['prompts']))
    return parameters


def _get_parent_followup_intent_name_from_json(project_id, intent):
    if 'parent_followup_intent_name' in intent:
        return _get_intent_name(project_id, intent['parent_followup_intent_name'])
    return ''


def create_intent(project_id, intent):
    intents_client = dialogflow.IntentsClient()
    parent = intents_client.project_agent_path(project_id)
    intent = dialogflow.types.Intent(
        display_name=intent['name'],
        priority=intent.get('priority', 3),
        action=intent.get('action_name', ''),
        training_phrases=_get_training_phrases_from_json(intent),
        messages=[_get_message_from_json(intent)],
        input_context_names=_get_input_context_names_from_json(project_id, intent),
        output_contexts=_get_output_contexts_from_json(project_id, intent),
        parameters=_get_parameters_from_json(intent),
        is_fallback=intent.get('is_fallback', False),
        parent_followup_intent_name=_get_parent_followup_intent_name_from_json(project_id, intent))

    response = intents_client.create_intent(parent, intent)
    logger.debug('Intent created: {}'.format(response))


def update_intent(project_id, intent):
    intents_client = dialogflow.IntentsClient()
    intent = dialogflow.types.Intent(
        name=_get_intent_name(project_id, intent['name']),
        display_name=intent['name'],
        priority=intent.get('priority', 3),
        action=intent.get('action_name', ''),
        training_phrases=_get_training_phrases_from_json(intent),
        messages=[_get_message_from_json(intent)],
        input_context_names=_get_input_context_names_from_json(project_id, intent),
        output_contexts=_get_output_contexts_from_json(project_id, intent),
        parameters=_get_parameters_from_json(intent),
        is_fallback=intent.get('is_fallback', False))

    response = intents_client.update_intent(intent, '')
    logger.debug('Intent updated: {}'.format(response))


def _get_intent_name(project_id, display_name):
    intents_client = dialogflow.IntentsClient()

    parent = intents_client.project_agent_path(project_id)
    intents = intents_client.list_intents(parent)
    intent_names = [intent.name for intent in intents if intent.display_name == display_name]

    return intent_names[0]


def _get_intent_ids(project_id, display_name):
    intents_client = dialogflow.IntentsClient()

    parent = intents_client.project_agent_path(project_id)
    intents = intents_client.list_intents(parent)
    intent_names = [
        intent.name for intent in intents
        if intent.display_name == display_name]

    return [intent_name.split('/')[-1] for intent_name in intent_names]


def delete_intent(project_id, intent_id):
    intents_client = dialogflow.IntentsClient()
    intent_path = intents_client.intent_path(project_id, intent_id)
    intents_client.delete_intent(intent_path)
    logger.debug('Intent deleted with id: {}'.format(intent_id))


def create_or_update_intent(project_id, intent):
    logger.info("Creating or updating intent {}...".format(intent['name']))
    if not _get_intent_ids(project_id, intent['name']):
        create_intent(project_id, intent)
    elif (_get_intent_ids(project_id, intent['name'])
            and _get_parent_followup_intent_name_from_json(project_id, intent)):
        delete_intent(project_id, _get_intent_ids(project_id, intent['name'])[0])
        create_intent(project_id, intent)
    else:
        update_intent(project_id, intent)
    time.sleep(15)


def create_entity(project_id, entity_name):
    logger.info("Creating entity {}...".format(entity_name))
    with open("data/entities/{}".format(entity_name)) as entity_file:
        entity = json.load(entity_file)

    if not _get_entity_type_ids(project_id, entity['name']):
        create_entity_type(project_id, entity['name'])
    entity_id = _get_entity_type_ids(project_id, entity['name'])[0]
    create_or_update_entities(project_id, entity_id, entity['entries'])


def parse_args():
    parser = argparse.ArgumentParser(description=__doc__,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--project-id', help='Project/agent id.  Required.', required=True)
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

    for filename in os.listdir('data/entities'):
        create_entity(args.project_id, filename)

    for filename in os.listdir('data'):
        if filename.endswith("intent.json"):
            with open('data/' + filename) as intent_file:
                create_or_update_intent(args.project_id, json.load(intent_file))
        elif filename.endswith("intents.json"):
            with open('data/' + filename) as intents_file:
                intents = json.load(intents_file)
                for intent in intents['intents']:
                    create_or_update_intent(args.project_id, intent)
