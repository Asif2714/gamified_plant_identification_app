import json


with open('plantnet300K_species_id_2_name_formatted.json', "r") as file:
    original_json = json.load(file)


# new dict for converted data
formatted_output_data = {}

# the original json is in format plant_id: plant_sci_name
for index, (plant_id, plant_sci_name) in enumerate(original_json.items()):
    formatted_output_data[index] = {
        "plant_id": plant_id,
        "plant_name": plant_sci_name,
    }

# saving data - we need ensure_ascii = False to decode Unicode escape sequnces
# such as "capitatum (L.) L'Hér" coming as capitatum (L.) L'H\u00c3\u00a9r
with open('ordered_id_species.json', 'w') as file:
    json.dump(formatted_output_data, file, ensure_ascii=False, indent=4)