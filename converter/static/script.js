window.onload = function() {
    updateCurrencyBox('USD', 'BRL', 'box1');
    updateCurrencyBox('USD', 'EUR', 'box2');
    updateCurrencyBox('EUR', 'GBP', 'box3');
    updateCurrencyBox('JPY', 'USD', 'box4');
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/converter/currencies/', true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            var from_currency_select = document.getElementById('from_currency');
            var to_currency_select = document.getElementById('to_currency');

            // now we are correctly iterating over currencies
            data.currencies.forEach(function(currency) {
                var option = document.createElement('option');
                option.text = currency;
                option.value = currency;
                option.dataset.country = currency.slice(0, 2);
                from_currency_select.add(option);
                to_currency_select.add(option.cloneNode(true));
            });  
        }
    };
    xhr.send();

    document.getElementById('convert-button').onclick = function() {
        var amount = document.getElementById('amount').value;
        var from_currency = document.getElementById('from_currency').value;
        var to_currency = document.getElementById('to_currency').value;

        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/converter/convert/?amount=' + amount + '&from_currency=' + from_currency + '&to_currency=' + to_currency, true);
        xhr.onload = function() {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);
                document.getElementById('result').textContent = data.result;
            }
        };
        xhr.send();
    };
};

function updateCurrencyBox(from_currency, to_currency, elementId) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/converter/rate/?from_currency=' + from_currency + '&to_currency=' + to_currency, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            var element = document.getElementById(elementId);
            element.innerHTML = ''; // clear previous content
            element.appendChild(countryToFlag(from_currency.slice(0, 2)));
            element.appendChild(document.createTextNode(' 1 ' + from_currency + ' = ' + data.rate + ' ' + to_currency + ' '));
            element.appendChild(countryToFlag(to_currency.slice(0, 2)));
        }
    };
    xhr.send();
}

function countryToFlag(country) {
    var span = document.createElement('span');
    span.className = 'flag-icon flag-icon-' + country.toLowerCase();
    return span;
}

function formatCurrency (currency) {
    if (!currency.id) {
        return currency.text;
    }
    var countryCode = $(currency.element).data('country');
    var $currency = $(
        '<span><span class="flag-icon flag-icon-' + countryCode.toLowerCase() + '"></span> ' + currency.text + '</span>'
    );
    return $currency;
};

$(document).ready(function() {
    $('#from_currency').select2({
        templateResult: formatCurrency,
        templateSelection: formatCurrency
    });
    $('#to_currency').select2({
        templateResult: formatCurrency,
        templateSelection: formatCurrency
    });
});
