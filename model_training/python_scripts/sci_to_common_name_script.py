# This script uses Trefle API to get the name of the common name from the scientific names
#
# NOTE: The common names might not be 100% accurate, as i put an algoritm to check for substring of scientific
# name if it's not available in the API and also skip the valid responses with None/null values for 'common_name'. 
# Approx 20% are confirmed to be fully accurate, others should be mostly accurate or close.
#
# This is done due to unique extra strings at the end of the scientific names creating issues with the API queries. 

import requests
import json

# Get API KEY from https://trefle.io/
api_key = 'YOUR_API_KEY'

def get_common_name(scientific_name):
    name_parts = scientific_name.split()


    while name_parts:

        search_query = ' '.join(name_parts)
        print(f"Trying search for: {search_query}")


        api_url = f'https://trefle.io/api/v1/plants/search?token={api_key}&q={search_query}'
        response = requests.get(api_url)

        if response.status_code == 200:
            results = response.json().get('data')
            if results:
                # Iterating through all results to avoid the null/None issue
                for result in results:
                    common_name = result.get('common_name')
                    if common_name:
                        print(f"200: Common name for {search_query} found: {common_name}")
                        return common_name
                # The first result (if there are multiple) is the most relevant
                # and to be used
                name_parts.pop()
            else:
                # For exhaustive search, we check with substrings of scientific names, removing last part
                print(f"No results for: {search_query}")
                name_parts.pop()
        else:
            print(f"404: Failed to fetch data for: {scientific_name}")
            return "TODO: did not found"
        
    print(f"404: Common name for {scientific_name} not found after exhaustive search.")
    return "TODO: did not found"

# TODO: for the 'TODO' outputs, we need to manually find the scientific name or the closest one, otherwise: Unavailable
# TODO Example: "common_name": "TODO: did not found"
# NOTE: 167 Out of 1081 had TODO outputs
    

# ================================
# Read the file without common name
with open('../ordered_id_species_wo_common_name.json', 'r') as file:
    data = json.load(file)

# Iterate through each plant species 
for item in data.values():
    scientific_name = item['plant_name']
    common_name = get_common_name(scientific_name)
    item['common_name'] = common_name  #adding common name

# Saving the updated JSON with common names
new_filename = 'ordered_id_species.json'
with open(new_filename, 'w') as outfile:
    json.dump(data, outfile, indent=4)

print(f"TASK COMPLETE: Species added to new JSON:{new_filename}")