//Get needed element rom the DOM
const map = document.querySelector("svg");
const countries = document.querySelectorAll("path");
const sidePanel = document.querySelector(".side-panel");
const container = document.querySelector(".side-panel .container");
const closeBtn = document.querySelector(".close-btn");
const loading = document.querySelector(".loading");
const zoomInBtn = document.querySelector(".zoom-in");
const zoomOutBtn = document.querySelector(".zoom-out");
const zoomValueOutput = document.querySelector(".zoom-value");
//Data Outputs
const countryNameOutput = document.querySelector(".country-name");
const countryFlagOutput = document.querySelector(".country-flag");
const cityOutput = document.querySelector(".city");
const areaOutput = document.querySelector(".area");
const currencyOutput = document.querySelector(".currency");
const languagesOutput = document.querySelector(".languages");

//Loop through all countries
countries.forEach(country => {
  //Add mouse enter event to each country (cursor enters a country)
  country.addEventListener("mouseenter", function() { 
    //Get all classes of element the mouse enters
    const classList = [...this.classList].join('.');  
    console.log(classList);
    //Create a selector for matching classes
    const selector = '.' + classList;  
    /*Select all matching elements / 
    Select all pieces of land (svg paths) 
    that belong to the same country*/
    const matchingElements = document.querySelectorAll(selector);  
    //Add hover effect to matching elements 
    matchingElements.forEach(el => el.style.fill = "#c99aff");
  });
  //Add a mouse out event (cursor leaves a country)
  country.addEventListener("mouseout", function() {
    /*Repeat the same steps from before to remove hovered 
    styles from matching elements /
    Remove hovered effect from all pieces of land 
    (svg paths) that have the same class names 
    (Belong to the same country)*/ 
    const classList = [...this.classList].join('.'); 
    const selector = '.' + classList;  
    const matchingElements = document.querySelectorAll(selector);  
    matchingElements.forEach(el => el.style.fill = "#443d4b");
  });
  //Add click event to each country
  country.addEventListener("click", function(e) {
    //Set loading text
    loading.innerText = "Loading...";
    //Hide country data container
    container.classList.add("hide");
    //Show loading screen
    loading.classList.remove("hide");
    //Variable to hold the country name
    let clickedCountryName;
    //If the clicked svg path (country) has a name attribute
    if(e.target.hasAttribute("name")) {
      //Get the value of the name attribute (country name)
      clickedCountryName = e.target.getAttribute("name");
    //If it doesn't have a name attribute 
    } else {
      //Get the class name (country name)
      clickedCountryName = e.target.classList.value;
    }
    //Open the side panel
    sidePanel.classList.add("side-panel-open");
    //Use fetch to get data from the API (Add the extracted country name)
    fetch(`https://restcountries.com/v3.1/name/${clickedCountryName}?fullText=true`)
    .then(response => {
      //Check if the response is OK (status code 200)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      //Parse the response as JSON
      return response.json();
    })
    .then(data => {
      /*You can console log the data and 
      view it in the developer console*/
      console.log(data);
      //Delay the code inside for half a second
      setTimeout(() => {
        //Extract data and output to the side panel
        //Country Name
        countryNameOutput.innerText = data[0].name.common; 
        //Flag image
        countryFlagOutput.src = data[0].flags.png;
        //Capital City
        cityOutput.innerText = data[0].capital;
        //Area
        //Change number format to include dots in big numbers
        const formatedNumber = data[0].area.toLocaleString('de-DE');
        areaOutput.innerHTML = formatedNumber + ` km<sup>2</sup>`;
        //Currency
        //Get the currencies object
        const currencies = data[0].currencies;
        /*Set currency output to empty string
        (Remove data from previous country)*/
        currencyOutput.innerText = "";
        //Loop through each object key
        Object.keys(currencies).forEach(key => {
          //Output the name of each currency of the selected country
          currencyOutput.innerHTML += `<li>${currencies[key].name}</li>`;
        });
        //Languages (Repeat the same steps as with the currency object)
        const languages = data[0].languages;
        languagesOutput.innerText = "";
        Object.keys(languages).forEach(key => {
          languagesOutput.innerHTML += `<li>${languages[key]}</li>`;
        });
        //Wait for new flag image to load
        countryFlagOutput.onload = () => {
          //Show the container with country info
          container.classList.remove("hide");
          //Hide loading screen
          loading.classList.add("hide");
        };
      }, 500);
    })
    //Handle errors
    .catch(error => {
      //Output explanation for the user
      loading.innerText = "No data to show for selected country";
      //Console log the error
      console.error("There was a problem with the fetch operation:", error);
    });
  });
});

//Add click event to side panel close button 
closeBtn.addEventListener("click", () => {
  //Close the side panel
  sidePanel.classList.remove("side-panel-open");
});

//Variable to contain the current zoom value
let zoomValue = 100;
//Disable zoom out button on load 
zoomOutBtn.disabled = true;

//Add click event to zoom in button
zoomInBtn.addEventListener("click", () => {
  //Enable the zoom out button
  zoomOutBtn.disabled = false;
  //Increment zoom value by 100
  zoomValue += 100;
  /*If the zoom value is under 500 
  (Or whatever you want the zoom in limit to be)*/
  if(zoomValue < 500) {
    //Enable the zoom in button
    zoomInBtn.disabled = false;
  //And if it eaches the limit
  } else {
    //Disable the zoom in button
    zoomInBtn.disabled = true;
  }
  //Set map width and height to zoom value
  map.style.width = zoomValue + "vw";
  map.style.height = zoomValue + "vh";
  //Output zoom value percentage
  zoomValueOutput.innerText = zoomValue + "%";
});
/*Repeat the same process with the zoom out button, 
just decrement the zoom value by 100 and check if it 
is over 100*/ 
zoomOutBtn.addEventListener("click", () => {
  zoomInBtn.disabled = false;
  zoomValue -= 100;
  if(zoomValue > 100) {
    zoomOutBtn.disabled = false;
  } else {
    zoomOutBtn.disabled = true;
  }
  map.style.width = zoomValue + "vw";
  map.style.height = zoomValue + "vh";
  zoomValueOutput.innerText = zoomValue + "%";
});