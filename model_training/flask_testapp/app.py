from flask import Flask, render_template, request
import torch
import torchvision.transforms as transforms
from PIL import Image
import torchvision.models as models
import json
import torch.nn.functional as F
from utils import load_model 

app = Flask(__name__)

# load the pre-trained model
filename = 'xp1_weights_best_acc.tar'
use_gpu = False
model = models.resnet18(num_classes=1081) 
load_model(model, filename=filename, use_gpu=use_gpu)
model.eval()

# loading the names of the species
class_names_file = './ordered_id_species.json'
with open(class_names_file, 'r') as json_input:
    ordered_species_json = json.load(json_input)

# preprocessing the image to do predictiosn
def preprocess_image(image_path):
    input_image = Image.open(image_path).convert('RGB')
    preprocess = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    input_tensor = preprocess(input_image)
    input_batch = input_tensor.unsqueeze(0)
    return input_batch

# Prediction route
@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return "No file part"

    file = request.files['file']

    if file.filename == '':
        return "No selected file"

    # make prediction
    input_batch = preprocess_image(file)
    with torch.no_grad():
        output = model(input_batch)

    probabilities = F.softmax(output, dim=1)
    class_probabilities, predicted_class_str = probabilities.max(1)
    predicted_class_string = predicted_class_str.item()

    if class_probabilities.item() > 0.6:
        if str(predicted_class_str.item()) in ordered_species_json:
            classification = ordered_species_json[str(predicted_class_str.item())]['plant_name']
            confidence = class_probabilities.item()
            return f"Predicted Class: {classification}, Confidence: {confidence}"
        else:
            return "Predicted class not in JSON"
    else:
        return "Confidence too low"

# Routing for the application
@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
