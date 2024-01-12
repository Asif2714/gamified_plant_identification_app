
import time;

# get the start time before imports
startTimeBeforeImport = time.time()

import torch
from torchvision import transforms
from PIL import Image
import torchvision.models as models
from utils import load_model
from PIL import Image
import json
import torch.nn.functional as F

startTimeAfterImport = time.time()

# model = models.resnet18(pretrained=True)
# model_weights = torch.load('./results/xp1/xp1_weights_best_acc.tar') 
# model.load_state_dict(model_weights)
# model.eval()  # Set the model to evaluation mode

filename = './results/xp1/xp1_weights_best_acc.tar' # pre-trained model path
# filename = './results/xp1/resnet18_weights_best_acc.tar' - The one from plantnet directly
use_gpu = True  # load weights on the gpu
model = models.resnet18(num_classes=1081) # 1081 classes in Pl@ntNet-300K

# loading up model weights 
load_model(model, filename=filename, use_gpu=use_gpu)
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


# Use the predicted 7-digit string to get the class name
# predicted_class_name = ordered_species_json.get(predicted_class_str, 'Unknown Class')
# print(f'Predicted class: {predicted_class_name}')

# # Make predictions
# with torch.no_grad():
#     outputs = model(image)
#     probabilities = torch.softmax(outputs, dim=1)

# # Interpret the results
# class_probabilities, predicted_class = torch.max(probabilities, 1)
# predicted_class = predicted_class.item()  
# print(predicted_class)
# confidence = class_probabilities.item()
# print(f'Confidence: {confidence}')
# predicted_class_str = str(predicted_class)  
# # print(predicted_class_str)
# predicted_class_name = class_names.get(predicted_class_str, 'Unknown Class')
# print(f'Predicted class: {predicted_class_name}')







# # Preprocess the input image
# image_path = './test_images/pelarogonium_echinatum.jpg'  
# preprocess = transforms.Compose([
#     transforms.Resize((224, 224)),  # Match the crop size you used during training
#     transforms.ToTensor(),
#     transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),  # Match your training data normalization
# ])
# image = Image.open(image_path)
# image = preprocess(image)
# image = image.unsqueeze(0)  # Add batch dimension (1 image)

# # Make predictions
# with torch.no_grad():
#     outputs = model(image)
#     probabilities = torch.softmax(outputs, dim=1)  # Convert to class probabilities

# # Interpret the results (e.g., find the class with the highest probability)
# class_probabilities, predicted_class = torch.max(probabilities, 1)
# print(f'Predicted class: {predicted_class.item()}')

# # You may also map the class index to the actual plant species name based on your dataset
# class_names = ['Class 0', 'Class 1', 'something', ...]  
# print(f'Predicted class: {class_names[predicted_class.item()]}')
