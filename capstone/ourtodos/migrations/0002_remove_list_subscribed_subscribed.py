# Generated by Django 4.0.5 on 2022-06-29 17:05

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('ourtodos', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='list',
            name='subscribed',
        ),
        migrations.CreateModel(
            name='Subscribed',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('masterlist', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='master', to='ourtodos.list')),
                ('subscribed', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='subscribed', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
