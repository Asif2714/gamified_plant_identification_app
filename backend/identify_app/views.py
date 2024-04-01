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
from django.contrib import auth
from rest_framework.authtoken.models import Token
from django.core.files.storage import default_storage
from .models import Plant, Achievement, UserMetrics
from datetime import datetime
import logging
logger = logging.getLogger(__name__)

User = auth.get_user_model()

# PyTorch related imports
import torch
import torch.nn.functional as torch_functional
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
import imghdr
import base64
from io import BytesIO
from django.utils import timezone
from django.core.serializers import serialize
from django.db.models import F, Count
import random




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
        JsonResponse: The  response from server indicating status of registering
    """

    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
        except json.JSONDecodeError as e:
            return JsonResponse({'error': str(e)}, status=400)
        
        email: str = data.get('email')
        username: str = data.get('username')
        password: str = data.get('password')
        first_name = data.get('first_name')
        last_name = data.get('last_name')

        if User.objects.filter(username=username).exists():
            print("User already exists!")
            return JsonResponse({'error': 'User already exists'}, status=400)

        # if User.objects.filter(email=email).exists(): # can add this check if required
        hashed_password = make_password(password)
        user = User.objects.create(username=username, email=email, password=hashed_password, 
                                   first_name=first_name,last_name=last_name)
        
        Achievement.objects.create(user=user)
        UserMetrics.objects.create(user=user)

        identicon = generator.generate(username, 200, 200,
                               padding=padding, inverted=True, output_format="png")
        identicon_file = ContentFile(identicon, name=f"{user.username}_identicon.png")

        user.profile_picture.save(identicon_file.name, identicon_file, save=True)
        return JsonResponse({'success': 'User created'}, status=201)
    else:
        return JsonResponse({'error': 'Invalid request'}, status=400)

@csrf_exempt
def login(request):
    """Handle user's login

    Args:
        request (HttpRequest): The HTTP request to log in user

    Returns:
        TODO:
    """

    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
        except json.JSONDecodeError as e:
            return JsonResponse({'error': str(e)}, status=400)

        username: str = data.get('username')
        password: str = data.get('password')
        user = auth.authenticate(username=username, password=password)

        if user is not None:
            # Update the daily streak
            user.update_daily_streak()
            token, _ = Token.objects.get_or_create(user=user)
            print({'token': token.key, 'username': user.username})
            return JsonResponse({'token': token.key, 'username': user.username})
        else:
            return JsonResponse({'error': 'Invalid user name or password'}, status=400)

    else:
        return JsonResponse({'error': 'Invalid request'}, status=400)


@csrf_exempt
def logout(request):
    if request.method == 'POST':
        auth.logout(request)
    
        # TODO: not sure if this will still work as I have changed thigns. need to check
        if hasattr(request.user, 'auth_token'):
                request.user.auth_token.delete()

        return JsonResponse({'success': 'Logged out successfully'}, status=200)


    else:
        return JsonResponse({'error': 'Invalid request'}, status=400)


@csrf_exempt
def get_user_details(request):
    if request.method == 'GET':
        #TODO: in prod, include request.user.is_authenticated: or something similar
        username = request.GET.get('username') 
        if username:
            try:
                user = User.objects.get(username=username)  

                profile_name = user.profile_name if user.profile_name else f"{user.first_name} {user.last_name}".strip()
                current_streak = user.current_streak if hasattr(user, 'current_streak') else 0

                user_data = {
                    'username': user.username,
                    'email': user.email,
                    'profile_name': profile_name,
                    'profile_picture': user.profile_picture.url if user.profile_picture else None,
                    'experience_points': getattr(user, 'experience_points', 0),
                    'current_streak': current_streak,
                }
                return JsonResponse(user_data)
            except User.DoesNotExist:
                return JsonResponse({'error': 'User not found'}, status=404)
           
        else:
            return JsonResponse({'error': 'ID not provided'}, status=401)

    else:
        return JsonResponse({'error': 'Invalid request'}, status=400)
    


# View functions for relevant plant details

CONSERVATION_STATUS_SCORES = {
    "CR": 500, # Critically Endangered
    "EN": 300, # Endangered
    "VU": 250, # Vulnerable
    "NT": 200, # Near Threatened
    "LC": 150, # Least Concerned
    "Not Listed": 100 # The baseline score
}

@csrf_exempt
def save_plant_details(request):
    print("attempting to save plant details")
    if request.method == 'POST':
        print("in POST of plant details")
        try:
            print(request)
            user = User.objects.get(username=request.POST.get('username'))
            print("got username!")
            scientific_name = request.POST.get('scientific_name')
            common_name = request.POST.get('common_name')

            # Check if the plant with the same name already exists for the user
            existing_plant = Plant.objects.filter(user=user, scientific_name=scientific_name).exists() or Plant.objects.filter(user=user, common_name=common_name).exists()

            if existing_plant:
                # the plant already exists, return an error response
                return JsonResponse({'error': 'Plant with this name already exists.'}, status=400)



            conservation_status = request.POST.get('conservation_status')
            gps_coordinates = request.POST.get('gps_coordinates')
            confidence = float(request.POST.get('confidence', 50)) # if confidence missing by any change, we do the midpoint 
            image_file = request.FILES.get('file')

            filename = f"{user}_{scientific_name}.{image_file.name.split('.')[-1]}"

            # Create and save the Plant instance
            plant = Plant.objects.create(
                user=user,
                scientific_name=scientific_name,
                common_name=common_name,
                rarity= conservation_status,
                gps_coordinates=gps_coordinates,
                image=image_file,
                confidence=confidence,
                date_time_taken=timezone.now()
            )
            # Baseline score baesd on Conservation status / rarity
            score_increase = CONSERVATION_STATUS_SCORES.get(conservation_status, 100)

            # Multiplier based on confidence
            multiplier = 0
            if 0.0 <= confidence <= 0.3:
                multiplier = 0.3
            elif 0.31 <= confidence <= 0.5:
                multiplier = 0.5
            elif 0.51 <= confidence <= 0.75:
                multiplier = 0.75
            else: 
                multiplier = 1.0

            final_score_increment = score_increase * multiplier

            # multiplier = getConfidenceMultiplier(request.POST.get('confidence'))
            print("USer xp before", user.experience_points)
            user.experience_points = F('experience_points') + final_score_increment
            user.save()
            user.refresh_from_db()
            print("USer xp after", user.experience_points)

            plant.image.save(filename, image_file, save=True)

            # Call the achievement checker and get updates if any
            achievements_updates = update_achievements(user)
        
            if not isinstance(achievements_updates, list):
                achievements_updates = [achievements_updates]

            # Return a success response
            return JsonResponse({
                'success': 'Plant details saved successfully!',
                'final_score_increased': final_score_increment,
                'total_experience_points': user.experience_points,
                'achievements_updates' : achievements_updates
            }, status=200)

        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except KeyError as e:
            return JsonResponse({'error': f'Missing field: {str(e)}'}, status=400)
        except Exception as e:
            # Log the error to the server's error log for more detailed debugging.
            logger.error(f'Error saving plant details: {str(e)}', exc_info=True)
            return JsonResponse({'error': str(e)}, status=500)

    else:
        # Only allow POST requests
        return JsonResponse({'error': 'Invalid request'}, status=400)

@csrf_exempt
def get_user_plants(request, username):
    
    try:
        user = User.objects.get(username=username)
        plants = Plant.objects.filter(user=user)
        plant_names = [plant.common_name for plant in plants]
        return JsonResponse({'plants': plant_names})
    
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found!'}, status=404)
    
@csrf_exempt
def get_user_plant_with_details(request, username):
    if request.method == 'GET':
        user = User.objects.get(username=username)
        plants = Plant.objects.filter(user=user).order_by('-date_time_taken')
        serialized_plants_data = serialize("json", plants)
        return JsonResponse({'plants_data': serialized_plants_data})
    else:
        # Only allow GET requests
        return JsonResponse({'error': 'Invalid request method'}, status=400)


#Leaderboard system view functions
def get_leaderboard(request):
    if request.method == 'GET':
        # sorting by descending on XP points
        users = User.objects.all().exclude(username='admin').order_by('-experience_points')

        users_data = []
        for user in users:
            user_data = {
                'id': user.id,
                'username': user.username,
                'profile_name': user.profile_name,
                'experience_points': user.experience_points,
                'profile_picture': user.profile_picture.url if user.profile_picture else None
            }
            users_data.append(user_data)


        return JsonResponse(users_data, safe=False)
    else:
        return JsonResponse({'error':  'Invalid request method'}, status=400)
        


# Home feed: Getting recent user images
    
def get_plants_for_homepage(request):
    if request.method == 'GET':

        # Getting top/most recent 15 and then selecting 10 of them randomly
        # (creating uniqueness to feed)
        plants_top15 = Plant.objects.all().order_by('-date_time_taken')[:15]
        plants_top15_list = list(plants_top15)
        random.shuffle(plants_top15_list)
        plants = plants_top15_list[:10]
        

        plants_data = []
        for plant in plants:
            plant_data = {
                'id': plant.id,
                'user': plant.user.username,
                'user_profile_picture': plant.user.profile_picture.url if plant.user.profile_picture else None,
                'scientific_name': plant.scientific_name,
                'common_name': plant.common_name,
                'date_time_taken': plant.date_time_taken,
                'plant_image': plant.image.url if plant.image else None,
                'rarity': plant.rarity,
                'type':"user_submitted_plant",
            }
            plants_data.append(plant_data)

        return JsonResponse(plants_data, safe=False)
    
    else:
        return JsonResponse({'error':  'Invalid request method'}, status=400)

'''
CR -> Critically Endangered
EN -> Endangered
VU -> Vulnerable
NT -> Near Threatened
LC -> Least Concerned
Not Listed
'''

@csrf_exempt
def get_user_plant_counts(request, username):
    if request.method == 'GET':
        try:
            RARITY= ['CR', 'EN', 'VU', 'NT', 'LC', 'Not Listed']
            rarity_counts  = {rarity: 0 for rarity in RARITY}

            user = User.objects.get(username = username)

            # Count the plants by grouping them based on rarity
            plants = Plant.objects.filter(user=user)
            counts  = plants.values('rarity').annotate(count = Count('id')).order_by('rarity')

            # Populating the rarity_counts array
            for count in counts:
                # Getting the Key from the data
                rarity = count['rarity']
                
                # Setting the value
                rarity_counts[rarity] = count['count']

            # Restructure the response
            formatted_counts = [{"rarity": rarity, "count": count} for rarity, count in rarity_counts.items()]

            return JsonResponse({"rarity_counts": formatted_counts})
    
        except User.DoesNotExist:
                return JsonResponse({'error': 'User not found'}, status=404)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)


# Challenges Section view endpoints
def get_user_achievements(request, username):
    if request.method == 'GET':
        try:
            user = User.objects.get(username=username)
            achievements = Achievement.objects.get(user=user)

            achievements_data = {
                "first_identification": achievements.first_identification,
                "five_identifications": achievements.five_identifications,
                "first_least_concern": achievements.first_least_concern,
                "first_near_threatened": achievements.first_near_threatened,
                "first_vulnerable": achievements.first_vulnerable,
                "first_endangered": achievements.first_endangered,
                "first_critical": achievements.first_critical,
                "xp_at_1000_or_more": achievements.xp_at_1000_or_more,
            }

            return JsonResponse(achievements_data)
    
        except User.DoesNotExist:
                return JsonResponse({'error': 'User not found'}, status=404)

    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

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
                probabilities = torch_functional.softmax(output, dim=1)
                confidence, predicted_class = probabilities.max(1)

                if confidence.item() > 0.1:
                    print("inside confidence")
                    predicted_class_string = str(predicted_class.item())
                    if predicted_class_string in ordered_species_json:
                        classification = ordered_species_json[predicted_class_string]['plant_name']
                        common_name = ordered_species_json[predicted_class_string]['common_name']
                        conservation_status = ordered_species_json[predicted_class_string]['conservation_status']
                        print("Successful")
                        return JsonResponse({'scientific_name': classification, 'common_name': common_name, 'conservation_status': conservation_status, 'confidence': confidence.item()})
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



# User metrics for the spider graph
def update_user_metrics(user, new_plant_confidence):
    metrics, created = UserMetrics.objects.get_or_create(user=user)

    # Accuracy
    total_confidence = user.plants.aggregate(total=Sum('confidence'))['total'] or 0
    total_plants = user.plants.count()
    metrics.accuracy = total_confidence / total_plants if total_plants else 0
    
    # Variety
    rarities = user.plants.values_list('rarity', flat=True).distinct()
    metrics.variety = len(rarities) / 6  # 6 Rarities including Not Listed + others

    # Explorer: updating user's 
    update_explorer_metric(user, metrics)

    # Achiever: count the achievemetns which is set to True
    achievements = Achievement.objects.get(user=user)
    total_achievements = 8 
    unlocked_achievements = 0
    
    # Iterate through each field in the Achievement model
    for field in achievements._meta.get_fields():
        if isinstance(field, models.BooleanField): 
            if getattr(achievements, field.name):  # if field is True, increment the count
                unlocked_achievements += 1
    metrics.achiever = unlocked_achievements / total_achievements
    
    # Update consistency
    metrics.consistency = min(user.current_streak / 20, 1)  # Assuming max streak is 20 days

    metrics.save()

# Exploerer metrics: calculating based on maximum lat long value upto 5km
# Can be changed later with a better logic.
def update_explorer_metric(user, metrics):
    plants = user.plants.all()
    latitudes = []
    longitudes = []
    
    for plant in plants:
        gps_coordinates = plant.gps_coordinates.split(',')
        latitudes.append(float(gps_coordinates[0]))
        longitudes.append(float(gps_coordinates[1]))
    
    if not latitudes or not longitudes:
        metrics.explorer = 0
        return
    
    # Assuming 1 degree of latitude or longitude is approximately equal to 111 km
    # 0.045 degrees will be approximately 5 km
    # ref: https://education.nationalgeographic.org/resource/longitude/
    max_lat_spread = 0.045
    max_lon_spread = 0.045
    
    lat_range = max(latitudes) - min(latitudes)
    lon_range = max(longitudes) - min(longitudes)
    
    # get a score between 0 and 1
    lat_score = min(lat_range / max_lat_spread, 1)
    lon_score = min(lon_range / max_lon_spread, 1)
    
    # Use the average of latitude and longitude scores as the explorer score
    metrics.explorer = (lat_score + lon_score) / 2

def update_achievements(user):
    achievements, created = Achievement.objects.get_or_create(user=user)

    # The return string 
    achievement_messages = []

    # TODO: Info: add more points for getting any achievements

    #Identification count achievements
    if not achievements.first_identification and user.plants.count() >= 1:
        achievements.first_identification = True
        achievements.save()
        achievement_messages.append("First Plant Identified!") 
    if not achievements.five_identifications and user.plants.count() >= 5:
        achievements.five_identifications = True
        achievements.save()
        achievement_messages.append("Five Plants Identified!") 

    # Achievements for plant rarity
    if not achievements.first_least_concern and user.plants.filter(rarity='LC').exists():
        achievements.first_least_concern = True
        achievements.save()
        achievement_messages.append("First 'Least Concern' Plant Identified!") 
    if not achievements.first_near_threatened and user.plants.filter(rarity='NT').exists():
        achievements.first_near_threatened = True
        achievements.save()
        achievement_messages.append("First 'Near Threatened' Plant Identified!") 
    if not achievements.first_vulnerable and user.plants.filter(rarity='VU').exists():
        achievements.first_vulnerable = True
        achievements.save()
        achievement_messages.append("First 'Vulnerable' Plant Identified!") 
    if not achievements.first_endangered and user.plants.filter(rarity='EN').exists():
        achievements.first_endangered = True
        achievements.save()
        achievement_messages.append("First 'Endangered' Plant Identified!") 
    if not achievements.first_critical and user.plants.filter(rarity='CR').exists():
        achievements.first_critical = True
        achievements.save()
        achievement_messages.append("First 'Critically Endangered' Plant Identified!") 

    # XP Achievements
    if not achievements.xp_at_1000_or_more and user.experience_points > 1000:
        achievements.xp_at_1000_or_more = True
        achievements.save()
        achievement_messages.append("Total 1000 XP Achieved!")


    return achievement_messages
