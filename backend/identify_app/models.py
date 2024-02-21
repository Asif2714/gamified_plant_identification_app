from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

# Create your models here.
class User(AbstractUser):
    '''
    TODO DOCSTRING
    '''
    # We have first_name and last_name, but still using this for simplicity
    profile_name = models.CharField(max_length=255, blank=True, null=True) 
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    experience_points = models.PositiveIntegerField(default=0)


class Plant(models.Model):
    '''
    TODO DOCSTRING
    '''
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='plants')
    scientific_name = models.CharField(max_length=255)
    common_name = models.CharField(max_length=255)
    date_time_taken = models.DateTimeField()
    gps_coordinates = models.CharField(max_length=100) # Could use GeoDjango if required(!)
    image = models.ImageField(upload_to='plant_images/')


    def __str__(self):
        return f"{self.common_name} by {self.user.profile_name}"


#
# Other methods
#
    
