var APIKey = '3b2cd8c9b12f4c8693e10ee77338f3a7';

var userFormEl = document.querySelector('#user-form');
var dishName = document.querySelector('#food');
var cuisineName = document.querySelector('#cuisine');

var formSubmitHandler = function (event) {
    event.preventDefault();

    var dishNameEl = dishName.value.trim();
    var cuisineNameEl = cuisineName.value.trim();

    if (dishNameEl) {
        getDishInfo(dishNameEl, cuisineNameEl)
    } else {
        alert("Please enter a dish and cuisine");
    }
};

userFormEl.addEventListener('submit', formSubmitHandler);

function getDishInfo(dish, cuisine) {
    var apiUrl = 'https://api.spoonacular.com/recipes/complexSearch?query=' + dish + '&cuisine=' + cuisine + '&apiKey=' + APIKey

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    for (var i = 0; i < data.results.length; i++) {
                        console.log(data.results[i].title);
                    }

                })
            }
        }
        )
}

