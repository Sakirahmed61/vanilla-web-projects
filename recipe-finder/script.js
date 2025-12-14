const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const mealsContainer = document.getElementById("meals");
const resultHeading = document.getElementById("result-heading");
const errorContainer = document.getElementById("error-container");
const mealDetails = document.getElementById("meal-details");
const mealDetailsContent = document.querySelector(".meal-details-content");
const backBtn = document.getElementById("back-btn");

const BASE_URL = "https://www.themealdb.com/api/json/v1/1/";
const SEARCH_URL = `${BASE_URL}search.php?s=`;
const LOOKUP_URL = `${BASE_URL}lookup.php?i=`;

// Adding most important eventlisteners.
searchBtn.addEventListener("click", () => {
  searchMeals()
})

mealsContainer.addEventListener("click", handleMealClick)

backBtn.addEventListener("click", () => {
  mealDetails.classList.remove("active");
})

searchInput.addEventListener("keypress",(e) => {
  if(e.key === "Enter") searchMeals();
})


async function searchMeals() {
  /*This function serves as the main function that returns the search results using the API and gives errors if nothing happens*/
  mealDetails.classList.remove("active"); //UI reset.
  const searchTerm = searchInput.value.trim() // search term

  // if user makes a blank search
  if(!searchTerm) {
    errorContainer.textContent = "Please give us something to search for";
    errorContainer.classList.remove("hidden");
    return;
  }

  // If there is something in the text field
  try {
    resultHeading.textContent =  `Searching for ${searchTerm}`
    mealsContainer.innerHTML = "";
    errorContainer.classList.add("hidden")

    // send a fetch request and wait for the response.
    const response = await fetch(`${SEARCH_URL}${searchTerm}`);
    const data = await response.json(); // store the data we got as a response

    console.log("Data is here", data); // for assurance

    // if the search returned something that doesn't exist.
    if(data.meals === null) {

      // No meals found
      resultHeading.textContent = ``;
      mealsContainer.innerHTML = "";
      errorContainer.textContent = `No recipes found for "${searchTerm}. Try another term"`
      errorContainer.classList.remove("hidden");


    } else {

      // we got something.
      resultHeading.textContent = `Search results for "${searchTerm}"`;
      displayMeals(data.meals)
      searchInput.value = "";
    }

  } catch (error) {
    errorContainer.textContent = "something went wrong. Please try again later"
    errorContainer.classList.remove("hidden");
  }
}

function displayMeals(meals) {
  mealsContainer.innerHTML = "";

  meals.forEach((meal) => {
    mealsContainer.innerHTML += `
      <div class="meal" data-meal-id="${meal.idMeal}">
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <div class="meal-info">
          <h3 class="meal-title">${meal.strMeal}</h3>
          ${meal.strCategory ? `<div class="meal-category">${meal.strCategory}</div>` : ""}
        </div>
      </div>
      `
  });
}

async function handleMealClick(e) {
  const mealEl = e.target.closest(".meal")
  if(!mealEl) return
  const mealId = mealEl.getAttribute("data-meal-id")

  try {

    const response = await fetch(`${LOOKUP_URL}${mealId}`)
    const data = await response.json()

    console.log(data)
    if(data.meals && data.meals[0]) {
      const meal = data.meals[0]

      const ingredients = [];

      for(let i = 1; i<=30; i++) {
        if(meal[`strIngredient${i}`] && meal[`strIngredient${i}`].trim() !== "") {
          ingredients.push({
            ingredient: meal[`strIngredient${i}`],
            measure: meal[`strMeasure${i}`]
          });
        }
      }

      mealDetailsContent.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="meal-details-img">
        <h2 class="meal-details-title">${meal.strMeal}</h2>
        <div class="meal-details-category">
          <span>${meal.strCategory || "Uncategorized"}</span>
        </div>
        <div class="meal-details-instructions">
          <h3>Instructions</h3>
          <p>${meal.strInstructions}</p>
        </div>
        <div class="meal-details-ingredients">
          <h3>Ingredients</h3>
          <ul class="ingredients-list">
            ${console.log(ingredients),
              ingredients.map((item) => `
              <li><i class="fas fa-check-circle"></i> ${item.measure} ${item.ingredient}</li>
              `).join("")}
          </ul>
        </div>
        ${
          meal.strYoutube? `
            <a href="${meal.strYoutube}" target="_blank" class="youtube-link">
              <i class="fab fa-youtube"></i> Watch Video
            </a>` : ""}
      `; // end of mealContainer innerHTML
      
      mealDetails.classList.add("active")
      
    }
    
  } catch (error) {
      errorContainer.textContent = "Could not load recipe details. Please try again later.";
      errorContainer.classList.remove("hidden");
  }
}