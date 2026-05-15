import csv
from django.http import HttpResponse
from django.db.models import Sum, Count
from django.db.models.functions import TruncMonth
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Transaction, Budget
from .serializers import (
    RegisterSerializer,
    TransactionSerializer,
    BudgetSerializer,
)
from .permissions import IsOwner


class RegisterView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer


class APIRootView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({
            'message': 'Expense Tracker API',
            'endpoints': {
                'register': '/api/auth/register/',
                'login': '/api/auth/login/',
                'transactions': '/api/transactions/',
                'analytics': '/api/analytics/',
                'budget': '/api/budget/',
                'export_csv': '/api/export/csv/',
            },
        })


class TransactionListCreateView(generics.ListCreateAPIView):
    serializer_class = TransactionSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = Transaction.objects.filter(user=user)
        category = self.request.query_params.get('category')
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        if category:
            queryset = queryset.filter(category__iexact=category)
        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TransactionRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsOwner]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)


class AnalyticsView(APIView):
    def get(self, request):
        user = request.user
        transactions = Transaction.objects.filter(user=user)
        income = transactions.filter(type='income').aggregate(total=Sum('amount'))['total'] or 0
        expenses = transactions.filter(type='expense').aggregate(total=Sum('amount'))['total'] or 0
        savings = income - expenses

        category_data = (
            transactions.values('category')
            .annotate(total=Sum('amount'), count=Count('id'))
            .order_by('-total')
        )

        expense_by_category = (
            transactions.filter(type='expense')
            .values('category')
            .annotate(total=Sum('amount'))
            .order_by('-total')
        )

        monthly_qs = (
            transactions.annotate(month=TruncMonth('date'))
            .values('month', 'type')
            .annotate(total=Sum('amount'))
            .order_by('month')
        )
        monthly = [
            {
                'month': item['month'].strftime('%Y-%m') if item['month'] else '',
                'type': item['type'],
                'total': item['total'],
            }
            for item in monthly_qs
        ]

        recent = TransactionSerializer(transactions[:8], many=True).data
        return Response({
            'income': income,
            'expenses': expenses,
            'savings': savings,
            'categories': category_data,
            'expense_by_category': expense_by_category,
            'monthly_trends': monthly,
            'recent_transactions': recent,
        })


class BudgetListCreateView(generics.ListCreateAPIView):
    serializer_class = BudgetSerializer

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class BudgetRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BudgetSerializer
    permission_classes = [IsOwner]

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)


class ExportCSVView(APIView):
    def get(self, request):
        transactions = Transaction.objects.filter(user=request.user).order_by('-date')
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename=transactions.csv'
        writer = csv.writer(response)
        writer.writerow(['Date', 'Type', 'Category', 'Amount', 'Description'])
        for tx in transactions:
            writer.writerow([tx.date, tx.type, tx.category, tx.amount, tx.description])
        return response
