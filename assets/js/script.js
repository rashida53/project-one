var APIKey = '891e9d3f9aa64c16809947ac6f8de537';

var submitButtonEl = $('#submit')
var dishName = document.querySelector('#food');
var cuisineName = document.querySelector('#cuisine');
var submitButtonEl = $('#submit')

var dishesContainer = $('#showIngredients');

var ingredientsContainer = $('#ingredientsAndPrices');

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

submitButtonEl.on('click', formSubmitHandler);

function getDishInfo(dish, cuisine) {
    var apiUrl = 'https://api.spoonacular.com/recipes/complexSearch?query=' + dish + '&cuisine=' + cuisine + '&apiKey=' + APIKey

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    for (var i = 0; i < data.results.length; i++) {
                        console.log(data.results[i].title);
                        displayDishName(data.results[i]);
                    }
                })
            }
        })
}

var displayDishName = function (dish) {

    var buttonContent = dish.title;

    var button = $('<button>');
    button.text(buttonContent);
    button.attr('id', dish.id);
    button.on('click', clickDish);
    dishesContainer.append(button);

}

function clickDish(event) {
    event.preventDefault();

    var buttonClicked = event.target;
    displayIngredients(buttonClicked.id);
}

var displayIngredients = function (id) {
    ingredientsContainer.empty();
    var apiUrl = 'https://api.spoonacular.com/recipes/' + id + '/information?apiKey=' + APIKey

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    for (var i = 0; i < data.extendedIngredients.length; i++) {

                        var listItemContent = data.extendedIngredients[i].name;
                        var priceContent = data.extendedIngredients[i].amount + 'USD';

                        var listItem = $('<li>');
                        listItem.text(listItemContent);
                        var priceItem = $('<li>');
                        priceItem.text(priceContent);

                        ingredientsContainer.append(listItem);
                        ingredientsContainer.append(priceItem);
                    }

                });
            }
        })
};





