#!/usr/bin/env python

import argparse
import dialogflow
import json


def list_entity_types(project_id):
    entity_types_client = dialogflow.EntityTypesClient()

    parent = entity_types_client.project_agent_path(project_id)

    entity_types = entity_types_client.list_entity_types(parent)

    for entity_type in entity_types:
        print('Entity type name: {}'.format(entity_type.name))
        print('Entity type display name: {}'.format(entity_type.display_name))
        print('Number of entities: {}\n'.format(len(entity_type.entities)))


def create_entity_type(project_id, display_name, kind=dialogflow.enums.EntityType.Kind.KIND_MAP):
    entity_types_client = dialogflow.EntityTypesClient()

    parent = entity_types_client.project_agent_path(project_id)
    entity_type = dialogflow.types.EntityType(
        display_name=display_name, kind=kind)

    response = entity_types_client.create_entity_type(parent, entity_type)

    print('Entity type created: \n{}'.format(response))


def _get_entity_type_ids(project_id, display_name):
    entity_types_client = dialogflow.EntityTypesClient()

    parent = entity_types_client.project_agent_path(project_id)
    entity_types = entity_types_client.list_entity_types(parent)
    entity_type_names = [
        entity_type.name for entity_type in entity_types
        if entity_type.display_name == display_name]

    entity_type_ids = [
        entity_type_name.split('/')[-1] for entity_type_name
        in entity_type_names]

    return entity_type_ids


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

    entity_types_client.batch_update_entities(entity_type_path, entities)


def list_intents(project_id):
    intents_client = dialogflow.IntentsClient()
    parent = intents_client.project_agent_path(project_id)
    intents = intents_client.list_intents(parent)

    for intent in intents:
        print('=' * 20)
        print('Intent name: {}'.format(intent.name))
        print('Intent display_name: {}'.format(intent.display_name))
        print('Action: {}\n'.format(intent.action))
        print('Root followup intent: {}'.format(
            intent.root_followup_intent_name))
        print('Parent followup intent: {}\n'.format(
            intent.parent_followup_intent_name))

        print('Input contexts:')
        for input_context_name in intent.input_context_names:
            print('\tName: {}'.format(input_context_name))

        print('Output contexts:')
        for output_context in intent.output_contexts:
            print('\tName: {}'.format(output_context.name))


def create_intent(project_id, intent):
    intents_client = dialogflow.IntentsClient()
    parent = intents_client.project_agent_path(project_id)
    # training_phrases = []
    # for training_phrases_part in training_phrases_parts:
    #    part = dialogflow.types.Intent.TrainingPhrase.Part(
    #        text=training_phrases_part)
    #    # Here we create a new training phrase for each provided part.
    #    training_phrase = dialogflow.types.Intent.TrainingPhrase(parts=[part])
    #    training_phrases.append(training_phrase)

    for message in intent['messages']:
        text = dialogflow.types.Intent.Message.Text(text=message['text'])
        message = dialogflow.types.Intent.Message(text=text)

    intent = dialogflow.types.Intent(
        display_name=intent['name'],
        # training_phrases=training_phrases,
        messages=[message],
        is_fallback=intent['is_fallback'])

    response = intents_client.create_intent(parent, intent)

    print('Intent created: {}'.format(response))


def update_intent(project_id, intent):
    intents_client = dialogflow.IntentsClient()
    # training_phrases = []
    # for training_phrases_part in training_phrases_parts:
    #    part = dialogflow.types.Intent.TrainingPhrase.Part(
    #        text=training_phrases_part)
    #    # Here we create a new training phrase for each provided part.
    #    training_phrase = dialogflow.types.Intent.TrainingPhrase(parts=[part])
    #    training_phrases.append(training_phrase)

    messages = []
    for message in intent['messages']:
        messages.append(message['text'])

    text = dialogflow.types.Intent.Message.Text(text=messages)
    message = dialogflow.types.Intent.Message(text=text)

    intent = dialogflow.types.Intent(
        name=_get_intent_name(project_id, intent['name']),
        display_name=intent['name'],
        # training_phrases=training_phrases,
        messages=[message],
        is_fallback=intent['is_fallback'])

    response = intents_client.update_intent(intent, '')

    print('Intent updated: {}'.format(response))


def _get_intent_name(project_id, display_name):
    intents_client = dialogflow.IntentsClient()

    parent = intents_client.project_agent_path(project_id)
    intents = intents_client.list_intents(parent)
    intent_names = [
        intent.name for intent in intents
        if intent.display_name == display_name]

    return intent_names[0]


def _get_intent_ids(project_id, display_name):
    intents_client = dialogflow.IntentsClient()

    parent = intents_client.project_agent_path(project_id)
    intents = intents_client.list_intents(parent)
    intent_names = [
        intent.name for intent in intents
        if intent.display_name == display_name]

    intent_ids = [
        intent_name.split('/')[-1] for intent_name
        in intent_names]

    return intent_ids


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--project-id', help='Project/agent id.  Required.', required=True)
    args = parser.parse_args()

    with open('data/intents.json') as intents_file:
        intents = json.load(intents_file)
    for intent in intents['intents']:
        if _get_intent_ids(args.project_id, intent['name']):
            update_intent(args.project_id, intent)
        else:
            create_intent(args.project_id, intent)
    list_intents(args.project_id)

    with open('data/technology.json') as technology_entity_file:
        technology_entity = json.load(technology_entity_file)

    if not _get_entity_type_ids(args.project_id, technology_entity['name']):
        create_entity_type(args.project_id, technology_entity['name'])
    technology_entity_id = _get_entity_type_ids(args.project_id, technology_entity['name'])[0]
    create_or_update_entities(args.project_id, technology_entity_id, technology_entity['entries'])

    list_entity_types(args.project_id)
