# Generated by Django 5.1.5 on 2025-02-27 01:15

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("orders", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="order",
            name="description",
            field=models.TextField(default=""),
        ),
        migrations.AddField(
            model_name="order",
            name="name",
            field=models.TextField(default=""),
        ),
        migrations.AddField(
            model_name="order",
            name="price",
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
    ]
