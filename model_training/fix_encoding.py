import json

def fix_encoding(text):
   fixed_text = text.encode('latin1', 'ignore').decode('utf-8', 'ignore')
   return fixed_text

with open('ordered_id_species.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

for item in data.values():
    item['plant_name'] = fix_encoding(item['plant_name'])
    if 'common_name' in item:
        item['common_name'] = fix_encoding(item['common_name'])

with open('fixed_file.json', 'w', encoding='utf-8') as file:
    json.dump(data, file, indent=4, ensure_ascii=False)

print("Encoding fixed and saved as: 'fixed_file.json'")
