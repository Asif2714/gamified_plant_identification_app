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


class Achievement(models.Model):
    '''
    TODO: Docstring
    '''

    user = models.OneToOneField(settings.AUTH_USER_MODEL, 
                                on_delete=models.CASCADE, 
                                related_name='achievements')
    # The achievements:
    first_identification = models.BooleanField(default=False)
    five_identifications = models.BooleanField(default=False)
    first_least_concern = models.BooleanField(default=False)
    first_near_threatened = models.BooleanField(default=False)
    first_vulnerable = models.BooleanField(default=False)  
    first_endangered = models.BooleanField(default=False)  
    first_critical = models.BooleanField(default=False) 
    xp_at_1000_or_more = models.BooleanField(default=False)





class Plant(models.Model):
    '''
    TODO DOCSTRING
    '''
    user = models.ForeignKey(settings.AUTH_USER_MODEL, 
                             on_delete=models.CASCADE, 
                             related_name='plants')
    scientific_name = models.CharField(max_length=255)
    common_name = models.CharField(max_length=255)
    date_time_taken = models.DateTimeField()
    gps_coordinates = models.CharField(max_length=100) # Could use GeoDjango if required(!)
    image = models.ImageField(upload_to='plant_images/')
    rarity = models.CharField(max_length=30, default='None')


    def __str__(self):
        return f"{self.common_name} ({self.scientific_name}) by {self.user.username}"




#
# Other methods
#
    
