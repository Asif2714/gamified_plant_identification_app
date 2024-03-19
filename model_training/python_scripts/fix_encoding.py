import json

def fix_encoding(text):
   fixed_text = text.encode('latin1', 'ignore').decode('utf-8', 'ignore')
   return fixed_text

with open('model_training\python_scripts\output_jsons\output_from_rarity_script.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

for item in data.values():
    item['plant_name'] = fix_encoding(item['plant_name'])
    if 'common_name' in item:
        item['common_name'] = fix_encoding(item['common_name'])

with open('model_training\python_scripts\output_jsons\output_from_rarity_script_fixed_encoding.json', 'w', encoding='utf-8') as file:
    json.dump(data, file, indent=4, ensure_ascii=False)

print("Encoding fixed")
