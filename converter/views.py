from django.http import JsonResponse
from django.views import View
from django.shortcuts import render
import requests

class ConvertCurrencyView(View):
    def get(self, request, *args, **kwargs):
        from_currency = request.GET.get('from_currency')
        to_currency = request.GET.get('to_currency')
        amount = float(request.GET.get('amount'))

        url = f"https://api.exchangerate-api.com/v4/latest/{from_currency}"
        response = requests.get(url)

        if response.status_code != 200:
            return JsonResponse({"error": "Could not get exchange rate"})

        data = response.json()

        if to_currency in data['rates']:
            rate = data['rates'][to_currency]
            result = amount * rate
            return JsonResponse({
                'result': f'{amount} {from_currency} = {result} {to_currency}'
            })

        return JsonResponse({"error": "Could not get exchange rate"})

def index(request):
    return render(request, 'index.html')

class SupportedCurrenciesView(View):
    def get(self, request, *args, **kwargs):
        url = f"https://api.exchangerate-api.com/v4/latest/USD"
        response = requests.get(url)

        if response.status_code != 200:
            return JsonResponse({"error": "Could not get supported currencies"})

        data = response.json()
        return JsonResponse({"currencies": list(data['rates'].keys())}) # we return a dictionary here

class CurrencyRateView(View):
    def get(self, request, *args, **kwargs):
        from_currency = request.GET.get('from_currency', 'USD')
        to_currency = request.GET.get('to_currency', 'BRL')

        url = f"https://api.exchangerate-api.com/v4/latest/{from_currency}"
        response = requests.get(url)

        if response.status_code != 200:
            return JsonResponse({"error": "Could not get exchange rate"})

        data = response.json()

        if to_currency in data['rates']:
            return JsonResponse({"rate": data['rates'][to_currency]})

        return JsonResponse({"error": "Currency not supported"})
