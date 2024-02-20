# Django imports
import json
import os
from django.shortcuts import render
from django.http import JsonResponse
from django.core.files.base import ContentFile
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password
from django.contrib.auth import get_user_model
User = get_user_model()

# PyTorch related imports
import torch
import torch.nn.functional as F
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
import imghdr
import base64
from io import BytesIO




# Setting up pydenticon
import pydenticon
import hashlib
padding = (20, 20, 20, 20)
foreground = [ "rgb(45,79,255)",
               "rgb(254,180,44)",
               "rgb(226,121,234)",
               "rgb(30,179,253)",
               "rgb(232,77,65)",
               "rgb(49,203,115)",
               "rgb(141,69,170)" ]
background = "rgb(224,224,224)"
generator = pydenticon.Generator(5, 5, digest=hashlib.sha1,
                                 foreground=foreground, background=background)

# View functions for Profile system
@csrf_exempt
def register(request):
    """Handles the user registration

    Args:
        request (HttpRequest): The HTTP request.


    Returns:
        HttpResponse: The rendered response from server
    """

    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
        except json.JSONDecodeError as e:
            return JsonResponse({'error': str(e)}, status=400)
        
        email = data.get('email')
        username = data.get('username')
        password = data.get('password')

        if User.objects.filter(username=username).exists():
            print("User already exists!")
            return JsonResponse({'error': 'User already exists'}, status=400)

        # if User.objects.filter(email=email).exists(): # can add this check if required
        hashed_password = make_password(password)
        user = User.objects.create(username=username, email=email, password=hashed_password)
        identicon = generator.generate(username, 200, 200,
                               padding=padding, inverted=True, output_format="png")
        identicon_file = ContentFile(identicon, name=f"{user.username}_identicon.png")

        user.profile_picture.save(identicon_file.name, identicon_file, save=True)
        return JsonResponse({'success': 'User created'}, status=201)
    else:
        return JsonResponse({'error': 'Invalid request'}, status=400)
# View functions for predictions

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
    # print("Full request data body:", request.body)
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
                        common_name = ordered_species_json[predicted_class_string]['common_name']
                        print("Successful")
                        return JsonResponse({'scientific_name': classification, 'common_name': common_name, 'confidence': confidence.item()})
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


