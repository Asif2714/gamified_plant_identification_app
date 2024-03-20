# Generated by Django 4.2.7 on 2024-03-20 08:23

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('identify_app', '0003_plant_rarity'),
    ]

    operations = [
        migrations.CreateModel(
            name='Achievement',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_identification', models.BooleanField(default=False)),
                ('five_identifications', models.BooleanField(default=False)),
                ('first_least_concern', models.BooleanField(default=False)),
                ('first_vulnerable', models.BooleanField(default=False)),
                ('first_endangered', models.BooleanField(default=False)),
                ('first_critical_rare', models.BooleanField(default=False)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='achievements', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
