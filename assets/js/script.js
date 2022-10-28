var APIKey = '891e9d3f9aa64c16809947ac6f8de537';

var dishName = document.querySelector('#food');
var cuisineName = document.querySelector('#cuisine');
var submitButtonEl = $('#submit')

var dishesContainer = $('#showIngredients');

var ingredientsContainer = $('#ingredientsAndPrices');
var selectedDish = $('#selectedDishName');

var ingredientButton = $('#ingredientButton');
var ingredientName = document.querySelector('#ingredient');
var ingredientCost = document.querySelector('#ingredientCost');

var sumContainer = $('#sumContainer');
var macroContainer = $('#macroContainer');

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

var clickHandler = function (event) {
    event.preventDefault();

    var ingredientNameEl = ingredientName.value.trim();

    if (ingredientNameEl) {
        getIngredientInfo(ingredientNameEl)
    } else {
        alert("Please enter an ingredient");
    }
};

ingredientButton.on('click', clickHandler);

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

var retrieveData = async function (id) {

    var recipeUrl = 'https://api.spoonacular.com/recipes/' + id + '/information?apiKey=' + APIKey;
    const response = await fetch(recipeUrl);
    const recipeData = await response.json();

    var ingredientCosts = [];
    for (var i = 0; i < recipeData.extendedIngredients.length; i++) {
        ingredientCosts[i] = await getIngredientAmount(recipeData.extendedIngredients[i].id, recipeData.extendedIngredients[i].amount)
    }

    return {
        ingredients: recipeData.extendedIngredients,
        ingredientCosts: ingredientCosts
    };
}

var getIngredientAmount = async function (ingredientId, amount) {
    var apiUrl = 'https://api.spoonacular.com/food/ingredients/' + ingredientId + '/information?apiKey=' + APIKey + '&amount=' + amount;
    const response = await fetch(apiUrl);
    if (response.ok) {
        const ingredientData = await response.json();
        return ingredientData.estimatedCost.value;
    } else {
        return 0;
    }
}

var sum = 0;
var displayIngredients = async function (id) {

    ingredientsContainer.empty();

    var data = await retrieveData(id);

    for (var i = 0; i < data.ingredients.length; i++) {

        var row = $('<div>');
        row.addClass("flex justify-center");

        var listItemContent = data.ingredients[i].name;
        var priceContent = data.ingredientCosts[i];

        var listItem = $('<li>');
        listItem.text(listItemContent + ' ¢ ' + priceContent);
        listItem.addClass("bg-red-700 hover:bg-[#222831] text-white font-semibold py-2 px-4 border-2 border-white rounded shadow w-2/3");
        sum += priceContent;

        var haveButton = $('<button>');
        haveButton.addClass("bg-red-700 hover:bg-[#222831] text-white font-semibold py-2 px-4 border-2 border-white rounded shadow");
        haveButton.text("I have this");
        row.append(listItem, haveButton);
        haveButton.on('click', updateSum);
        haveButton.attr('id', priceContent);
        ingredientsContainer.append(row);
    }
    console.log(sum);
    displaySum(sum);

};

var displaySum = function (sum) {
    sumContainer.empty();
    var sumText = $('<p>');
    sumText.text('$ ' + Math.round(sum / 100));
    sumContainer.append(sumText);
}

var updateSum = function (event) {
    event.preventDefault();
    var buttonClicked = event.target;
    var subtractAmount = parseInt(buttonClicked.id);
    sum = sum - subtractAmount;
    displaySum(sum);
}

var nutrientMap = [{ CHOCDF: 'Carbohydrate' }, { ENERC_KCAL: 'Calories' }, { FAT: 'Fat' }, { FIBTG: 'Fiber' }, { PROCNT: 'Protein' }];

var getIngredientInfo = function (ingredient) {

    var apiUrl = 'https://api.edamam.com/api/food-database/v2/parser?app_id=0c089911&app_key=dfc46540c3734d0319db196d84047446&ingr=' + ingredient + '&nutrition-type=cooking';
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data.parsed[0].food.nutrients);
                    console.log(data.parsed[0]);

                    var nutrientKeys = Object.keys(data.parsed[0].food.nutrients);
                    for (var i = 0; i < nutrientKeys.length; i++) {
                        var nutrient1 = nutrientKeys[0];
                        var nutrient2 = nutrientKeys[1];
                        var listItem1 = $('<li>');
                        listItem1.text("Calories" + data.parsed[0].food.nutrients[nutrient1]);
                        var listItem2 = $('<li>');
                        listItem2.text("Protein" + data.parsed[0].food.nutrients[nutrient2]);
                    }

                    macroContainer.append(listItem1, listItem2);

                });
            }
        })
}



