# This file is for testing the model to ensure it works
# afterwards it's transferred to views.py

import time;
startTimeBeforeImport = time.time()

import torch
from torchvision import transforms
from PIL import Image
import torchvision.models as models
from PIL import Image
import json
import torch.nn.functional as F
import os

startTimeAfterImport = time.time()


filename = './saved_models/final_model_weights.tar' # pre-trained model 
use_gpu = True  # load weights on the gpu
model = models.resnet18(num_classes=1081) # 1081 classes in Pl@ntNet-300K

# Code below for loading model state taken from utils.py in https://github.com/plantnet/PlantNet-300K
# loading up model weights 
if not os.path.exists(filename):
    raise FileNotFoundError

device = 'cuda:0' if use_gpu else 'cpu'
d = torch.load(filename, map_location=device)
model.load_state_dict(d['model_state_dict'])

model.eval()


# defining the class names from a JSON file 
# class_names_file = './plantnet300K_species_id_2_name.json' 
class_names_file = './ordered_id_species.json'
with open(class_names_file, 'r') as json_input:
    ordered_species_json = json.load(json_input)

# Load and preprocess the input image - all downloaded from direct google search.
# image_path = './test_images/pelarogonium_echinatum4.jpg'  # Test file path
# image_path = './test_images/Trifolium fragiferum L..jpg'
image_path = './test_images/Humulus lupulus L..jpg'

# Note: pelarogonium_echinatum4.jpg gives Pelargonium graveolens
# Trifolium fragiferum L..jpg gives Trifolium pratense L.
# hibiscus not in Dataset, gives Pelargonium inquinans (L.) Aiton - conf: 0.36
# Best conf Humulus lupulus L. 0.999998
# observation: gets Genus right, Species Wrong

# preprocesssing the testing image
# matching 
preprocess = transforms.Compose([
    transforms.Resize((224, 224)), # default inputsize for ResNet
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]) # normalizing with mean and standard deviation
])

# leading up the images
image = Image.open(image_path)
image = preprocess(image)
image = image.unsqueeze(0)  # add batch dimension (1 image)


# making predictions with the loaded model
with torch.no_grad():
    outputs = model(image)
    # probabilities = torch.softmax(outputs, dim=1)

probabilities = F.softmax(outputs, dim=1)

# getting confidence/probabilities and the class 
class_probabilities, predicted_class_str = probabilities.max(1)
predicted_class_string = predicted_class_str.item()  # Get the integer value as predicted_class_str gives tensor index


print(predicted_class_string)

if(class_probabilities.item() > 0.6):
    if str(predicted_class_str.item()) in ordered_species_json:
        classification = ordered_species_json[str(predicted_class_str.item())]['plant_name']
        print(classification)
        print("Confidence: "+str(class_probabilities.item()))
else:
    print("Predicted classs not in JSON")


# get the end time
et = time.time()

# get the execution time
elapsed_time = et - startTimeAfterImport
print('Execution time after imports:', elapsed_time, 'seconds')

total_time = et - startTimeBeforeImport
print('Execution time with imports:', total_time, 'seconds')



