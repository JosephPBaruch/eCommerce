# Generated by Django 5.1.5 on 2025-02-27 01:27

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("orders", "0002_order_description_order_name_order_price"),
        ("products", "0002_remove_product_stock_product_user"),
        ("users", "0002_remove_user_name_user_username_alter_user_id"),
    ]

    operations = [
        migrations.AlterField(
            model_name="order",
            name="product",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="products.product",
            ),
        ),
        migrations.AlterField(
            model_name="order",
            name="user",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="users.user",
            ),
        ),
    ]
