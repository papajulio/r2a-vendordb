#!/bin/bash
set -euxo pipefail

function replace_strings() {
    sed -i "s/@sys.geo-country/@continent/g" $1
    sed -i "s/country/continent/g" $1
    sed -i "s/Spain/Europe/g" $1
    sed -i "s/Australia/Asia/g" $1
    sed -i "s/Spanish/European/g" $1
    sed -i "s/countries/continents/g" $1
    sed -i "s/?continent=/?country=/g" $1
}

git clean -fd data

cp data/country_question_intent.json data/continent_question_intent.json
replace_strings data/continent_question_intent.json

cp data/country_tech_usecase_intents.json data/continent_tech_usecase_intents.json
replace_strings data/continent_tech_usecase_intents.json

cp data/all_together_intent.json data/all_together_intent_continent.json
replace_strings data/all_together_intent_continent.json

cp data/two_technology_intents.json data/two_technology_continent_intents.json
replace_strings data/two_technology_continent_intents.json

cp data/two_usecase_intents.json data/two_usecase_continent_intents.json
replace_strings data/two_usecase_continent_intents.json
