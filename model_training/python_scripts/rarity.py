import requests
import json

# File path for adding rarity/conservation status to plants
file_path = './model_training/python_scripts/source_jsons/ordered_id_species_wo_rarity.json'
with open(file_path, 'r') as file:
    plants_json = json.load(file)

# Public API token available at IUCN website, system for getting personal 
# API token is down. See https://github.com/ropensci/rredlist/issues/52
api_token = '9bb4facb6d23f48efbf424bb05c0c1ef1cf6f468393bc745d42179ac4aca5fee'


# Fetching conservation status from IUCN Red List API
def fetch_conservation_status(plant_name):
    name_parts = plant_name.split()
    while name_parts:
        search_query = '%20'.join(name_parts)  # Adding with '%20' for URL encoding
        print(f"Searching for search query: {search_query}")
        url = f'https://apiv3.iucnredlist.org/api/v3/species/{search_query}?token={api_token}'
        
        response = requests.get(url)

        # Exhaustive search, popping the last part of result is unsuccessful
        if response.status_code == 200:
            data = response.json()
            if 'result' in data and data['result']:
                status = data['result'][0]['category']
                return status
            name_parts.pop()  
        else:
            name_parts.pop() 
    
    return 'Not Listed'

successes = 0
not_LC = 0

# Update the JSON with conservation status (rarity)
for plant in plants_json.values():
    plant_name = plant['plant_name']
    status = fetch_conservation_status(plant_name)
    plant['conservation_status'] = status
    
    if status not in ['Not Listed', 'Error']:
        successes += 1
        if status not in ["LC"]:
            not_LC +=1
    print(f"Current successful retrievals: {successes}")
    print(f"Current Non \'Least Concern\'s: {not_LC}")


with open('./model_training/python_scripts/output_jsons/output_from_rarity_script.json', 'w') as file:
    json.dump(plants_json, file, indent=4)