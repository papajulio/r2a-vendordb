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


def delete_entity_type(project_id, entity_type_id):

    entity_types_client = dialogflow.EntityTypesClient()

    entity_type_path = entity_types_client.entity_type_path(
        project_id, entity_type_id)

    entity_types_client.delete_entity_type(entity_type_path)


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


def create_entity(project_id, entity_type_id, entity_value, synonyms):
    entity_types_client = dialogflow.EntityTypesClient()

    # Note: synonyms must be exactly [entity_value] if the
    # entity_type's kind is KIND_LIST
    synonyms = synonyms or [entity_value]

    entity_type_path = entity_types_client.entity_type_path(
        project_id, entity_type_id)

    entity = dialogflow.types.EntityType.Entity()
    entity.value = entity_value
    entity.synonyms.extend(synonyms)

    entity_types_client.batch_create_entities(entity_type_path, [entity])


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--project-id', help='Project/agent id.  Required.', required=True)
    args = parser.parse_args()

    with open('data/technology.json') as technology_entity_file:
        technology_entity = json.load(technology_entity_file)
    delete_entity_type(args.project_id, _get_entity_type_ids(args.project_id, technology_entity['name'])[0])
    create_entity_type(args.project_id, technology_entity['name'])

    technology_entity_id = _get_entity_type_ids(args.project_id, technology_entity['name'])[0]
    for entity in technology_entity['entries']:
        create_entity(args.project_id, technology_entity_id, entity['value'], entity['synonyms'])

    print('Entities for technology created\n')

    list_entity_types(args.project_id)
