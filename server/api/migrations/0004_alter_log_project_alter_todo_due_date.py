# Generated by Django 5.0.6 on 2024-12-23 11:06

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_membership_unique_membership'),
    ]

    operations = [
        migrations.AlterField(
            model_name='log',
            name='project',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='logs', to='api.project'),
        ),
        migrations.AlterField(
            model_name='todo',
            name='due_date',
            field=models.DateField(null=True),
        ),
    ]