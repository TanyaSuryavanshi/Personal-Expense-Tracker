from django.contrib import admin
from .models import Transaction, Budget


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['user', 'type', 'amount', 'category', 'date']
    list_filter = ['type', 'category', 'date']
    search_fields = ['description', 'category', 'user__username']


@admin.register(Budget)
class BudgetAdmin(admin.ModelAdmin):
    list_display = ['user', 'category', 'limit_amount']
    search_fields = ['category', 'user__username']
