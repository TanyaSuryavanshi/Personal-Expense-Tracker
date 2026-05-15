from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView,
    APIRootView,
    TransactionListCreateView,
    TransactionRetrieveUpdateDestroyView,
    AnalyticsView,
    BudgetListCreateView,
    BudgetRetrieveUpdateDestroyView,
    ExportCSVView,
)

urlpatterns = [
    path('', APIRootView.as_view(), name='api-root'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('transactions/', TransactionListCreateView.as_view(), name='transactions'),
    path('transactions/<int:pk>/', TransactionRetrieveUpdateDestroyView.as_view(), name='transaction-detail'),
    path('analytics/', AnalyticsView.as_view(), name='analytics'),
    path('budget/', BudgetListCreateView.as_view(), name='budget'),
    path('budget/<int:pk>/', BudgetRetrieveUpdateDestroyView.as_view(), name='budget-detail'),
    path('export/csv/', ExportCSVView.as_view(), name='export-csv'),
]
