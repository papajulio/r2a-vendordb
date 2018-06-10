import csv
import json


def main():
    data = {
        'technologies': parse_technologies(),
        'objectives': parse_objectives(),
        'personas': parse_personas(),
        'vendors': parse_vendors(),
    }

    with open('result.json', 'w') as json_file:
        json.dump(data, json_file)


def parse_technologies():
    technologies = read_csv('technologies.csv', 'id', ['n', 'id'])
    technologies = parse_int_field(technologies, 'id')
    return build_dict(technologies, 'id')


def parse_objectives():
    objectives = read_csv('objectives.csv', 'id', ['id', 'n', 'uc', 'd', 't'])
    objectives = parse_int_field(objectives, 'id')
    objectives = parse_list_field(objectives, 't', integer=True)
    return build_dict(objectives, 'id')


def parse_personas():
    personas = read_csv('personas.csv', 'id', ['id', 'n', 'o'])
    personas = parse_int_field(personas, 'id')
    personas = parse_list_field(personas, 'o', integer=True)
    return build_dict(personas, 'id')


def parse_vendors():
    vendors = read_csv('vendors.csv', 'id', ['o', 't', 'n', 'id', 'fo', 'u', 'g', 'l', 'tl', 'd', 'c', 'lu'])
    parse_int_field(vendors, 'id')
    parse_int_field(vendors, 'o')
    parse_int_field(vendors, 't')
    parse_list_field(vendors, 'g')
    return flat_vendors(vendors, 'id')


def read_csv(filename, id_column, fieldnames):
    dict_reader = csv.DictReader(open(filename, 'rb'), fieldnames=fieldnames, delimiter=',', quotechar='"')
    return parse_dict_reader(dict_reader, id_column)


def parse_dict_reader(dict_reader, id_column):
    skip_header(dict_reader)
    return [row for row in dict_reader]


def skip_header(dict_reader):
    next(dict_reader, None)


def parse_int_field(values, field_name):
    result = []
    for value in values:
        value[field_name] = int(value[field_name])
        result.append(value)
    return result


def parse_list_field(values, field_name, integer=False):
    result = []
    for value in values:
        value[field_name] = [x for x in value[field_name].split(',')]
        if integer:
            value[field_name] = [int(x) for x in value[field_name]]
        result.append(value)

    return result


def build_dict(values, id_field):
    return {value[id_field]: value for value in values}


def flat_vendors(vendors, id_field):
    flat_vendors = {}
    for vendor in vendors:
        vendor_id = vendor[id_field]
        if vendor[id_field] not in flat_vendors.keys():
            flat_vendors[vendor_id] = vendor
            flat_vendors[vendor_id]['o'] = [flat_vendors[vendor_id]['o']]
            flat_vendors[vendor_id]['t'] = [flat_vendors[vendor_id]['t']]
        else:
            if vendor['o'] not in flat_vendors[vendor_id]['o']:
                flat_vendors[vendor_id]['o'].append(vendor['o'])
            if vendor['t'] not in flat_vendors[vendor_id]['t']:
                flat_vendors[vendor_id]['t'].append(vendor['t'])
    return flat_vendors


if __name__ == "__main__":
    main()
