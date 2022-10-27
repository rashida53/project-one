var APIKey = 'be1a3b16ffa44575b01cb470f3ce3e58';

var submitButtonEl = $('#submit')
var dishName = document.querySelector('#food');
var cuisineName = document.querySelector('#cuisine');
var submitButtonEl = $('#submit')

var dishesContainer = $('#showIngredients');

var ingredientsContainer = $('#ingredientsAndPrices');
var selectedDish = $('#selectedDishName');

selectedDish.hide();

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
    ingredientsContainer.empty();
    selectedDish.hide();

    var buttonContent = dish.title;

    var button = $('<button>');
    button.text(buttonContent);
    button.attr('id', dish.id);
    button.addClass("text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 object-scale-down");
    button.on('click', clickDish);
    dishesContainer.append(button);

}

function clickDish(event) {
    event.preventDefault();


    var buttonClicked = event.target;
    displayIngredients(buttonClicked.id);
    dishesContainer.empty();
    selectedDish.show();
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
                        var priceContent = data.extendedIngredients[i].amount + ' USD';

                        var listItem = $('<li>');
                        listItem.text(listItemContent + ' - ' + priceContent);
                        listItem.addClass("bg-red-700 hover:bg-[#222831] text-white font-semibold py-2 px-4 border-2 border-white rounded shadow");


                        ingredientsContainer.append(listItem);
                    }

                });
            }
        })
};





