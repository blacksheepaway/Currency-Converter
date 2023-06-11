from django.urls import path
from .views import ConvertCurrencyView, SupportedCurrenciesView, CurrencyRateView, index

urlpatterns = [
    path('', index, name='index'),
    path('convert/', ConvertCurrencyView.as_view(), name='convert_currency'),
    path('currencies/', SupportedCurrenciesView.as_view(), name='supported_currencies'),
    path('rate/', CurrencyRateView.as_view(), name='currency_rate'),
]
