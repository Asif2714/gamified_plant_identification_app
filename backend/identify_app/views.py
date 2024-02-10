# Django imports
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import os

# PyTorch related imports
import torch
import torch.nn.functional as F
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
import imghdr

import base64
from io import BytesIO




@csrf_exempt  # TODO: exempt for simplicity, disabling CSRF. For production, we need to include tokens
def upload_image(request):
    print(request.body)
    if request.method == 'POST':
        data = request.body.decode('utf-8') 
        json_data = json.loads(data)
        image_data = json_data.get('image')

        if image_data:
            
            image_data = base64.b64decode(image_data.split(',')[1])
            image_file = BytesIO(image_data)

            if image_file:
                # Reset the file pointer to the start
                image_file.seek(0)
                
                # Check the image type using imghdr
                file_type = imghdr.what(image_file)
                print(file_type)  # Prints the detected image type

                # Ensure the file is an image
                if file_type in ['jpeg', 'png', 'gif']:  # Add other image types as needed
                    # Process the image or save it here
                    print(f"Received file: {image_file.name}, Type: {file_type}")
                    return JsonResponse({'message': 'Image received successfully!'}, status=200)
                else:
                    return JsonResponse({'error': 'Unsupported image type'}, status=400)
            else:
                return JsonResponse({'error': 'No image provided'}, status=400)

        return JsonResponse({'error': 'Invalid request'}, status=400)



# Loading resources and models
model_path = os.path.join(os.path.dirname(__file__), 'xp1_weights_best_acc.tar')

loaded_model = torch.load(model_path, map_location=torch.device('cpu'))
# print(checkpoint.keys()) # for debugging. Output: dict_keys(['epoch', 'model', 'optimizer'])

model = models.resnet18(pretrained=False)
num_ftrs = model.fc.in_features
model.fc = torch.nn.Linear(num_ftrs, 1081)
model.load_state_dict(loaded_model['model'])
model.eval()

class_names_file = './identify_app/ordered_id_species.json'
with open(class_names_file, 'r') as json_input:
    ordered_species_json = json.load(json_input)



def test_get_request(request):
    if request.method == 'GET':
        return JsonResponse({'message': 'GET request received!'}, status=200)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)


@csrf_exempt
def predict_image(request):
    print("predicting image")
    print("Full request data body:", request.body)
    if request.method == 'POST':
        print("in post")
        image_file = request.FILES.get('file')
        print(request.FILES)


        if not image_file:
            print("no image!")
            return JsonResponse({'error': 'No image provided'})
        
        try:
            print("preprocessing")
            input_img = preprocess_img(image_file)
            with torch.no_grad():
                output = model(input_img)
                probabilities = F.softmax(output, dim=1)
                confidence, predicted_class = probabilities.max(1)

                if confidence.item() > 0.1:
                    print("inside confidence")
                    predicted_class_string = str(predicted_class.item())
                    if predicted_class_string in ordered_species_json:
                        classification = ordered_species_json[predicted_class_string]['plant_name']
                        print("Successful")
                        return JsonResponse({'Predicted Class': classification, 'Confidence': confidence.item()})
                    else:
                        print("")
                        return JsonResponse({'error': 'Predicted class not in JSON'})
                else:
                    return JsonResponse({'error': 'Confidence too low'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500) #TODO: check,and change to suitable code
 
    return JsonResponse({'error': 'Invalid request method'}, status=400)  #TODO: check if 400 is correct one for this






# Other methods
def preprocess_img(image):
    input_image = Image.open(image).convert('RGB')
    preprocess = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    input_tensor = preprocess(input_image)
    input_batch = input_tensor.unsqueeze(0)
    return input_batch


