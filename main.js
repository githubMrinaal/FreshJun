// Get needed elements from the DOM
const map = document.querySelector("svg");
const countries = document.querySelectorAll("path");
const sidePanel = document.querySelector(".side-panel");
const container = document.querySelector(".side-panel .container");
const closeBtn = document.querySelector(".closeBtn");
const loading = document.querySelector(".loading");
const zoomInBtn = document.querySelector(".zoom-in");
const zoomOutBtn = document.querySelector(".zoom-out");
const zoomValueOutput = document.querySelector(".zoom-value");

// Data Outputs
const countryNameOutput = document.querySelector(".country-name");
const countryFlagOutput = document.querySelector(".country-flag");
const diseasetypeOutput = document.querySelector(".types-of-diseases");
const airrateOutput = document.querySelector(".air-rate");
const sanitationOutput = document.querySelector(".Percent-Sanitation");
const tuberOutput = document.querySelector(".Tuberculosis");
const malariaOutput = document.querySelector(".Malaria");
//const washFacilOutput = document.querySelector(".wash-facil");

// Loop through all countries
countries.forEach(country => {
  // Mouse enter event to highlight country
  country.addEventListener("mouseenter", function() { 
    const classList = [...this.classList].join('.');
    const selector = '.' + classList;  
    const matchingElements = document.querySelectorAll(selector);  
    matchingElements.forEach(el => el.style.fill = "#c99aff");
  });
  
  // Mouse out event to remove highlight
  country.addEventListener("mouseout", function() {
    const classList = [...this.classList].join('.'); 
    const selector = '.' + classList;  
    const matchingElements = document.querySelectorAll(selector);  
    matchingElements.forEach(el => el.style.fill = "#443d4b");
  });
  
  // Click event to fetch and display country data
  country.addEventListener("click", function(e) {
    // Show loading text and hide data container
    loading.innerText = "Loading...";
    container.classList.add("hide");
    loading.classList.remove("hide");

    // Get the clicked country's name (from a name attribute or its class)
    let clickedCountryName;
    if(e.target.hasAttribute("name")) {
      clickedCountryName = e.target.getAttribute("name");
    } else {
      clickedCountryName = e.target.classList.value;
    }

    // Open the side panel
    sidePanel.classList.add("side-panel-open");

    // Fetch country data from the API
    fetch(`https://restcountries.com/v3.1/name/${clickedCountryName}?fullText=true`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        // Delay for a smoother transition
        setTimeout(() => {
          console.log("This is where we are")
          // Output country name and flag
          countryNameOutput.innerText = data[0].name.common; 
          countryFlagOutput.src = data[0].flags.png;

          const csvCountryData = csvData.find(item =>
            item.Location.toLowerCase() === data[0].name.common.toLowerCase()
          );

          if (csvCountryData) {
            // For example, use the "tuberculosis" value as a disease indicator;
            // adjust these as needed for your data
            // diseasetypeOutput.innerText = csvCountryData.tuberculosis !== null ? csvCountryData.tuberculosis : "Data not available";
            tuberOutput.innerText = csvCountryData.tuberculosis !== null ? `Tuberculosis: ${csvCountryData.tuberculosis} (Per 100,000)`  : `Tuberculosis: Data not available`;
            malariaOutput.innerText = csvCountryData.malaria !== null ? `Malaria: ${csvCountryData.malaria} (Per 1,000)` : `Malaria: Data not available`;
            airrateOutput.innerText = csvCountryData.airpollution !== null ? `${csvCountryData.airpollution} (Per 100,000)` : "Data not available";
            sanitationOutput.innerText = csvCountryData.sanitation !== null ? `${csvCountryData.sanitation}%` : "Data not available";
            //washFacilOutput.innerText = csvCountryData.Handwashing !== null ? csvCountryData.Handwashing : "Data not available";
          } else {
            // Fallback if no CSV data was found
            diseasetypeOutput.innerText = "Data not available";
            airrateOutput.innerText = "Data not available";
            sanitationOutput.innerText = "Data not available";
            //washFacilOutput.innerText = "Data not available";
          }
          // Output placeholder values for additional data

          // Show the container with country info and hide the loading indicator
          container.classList.remove("hide");
          loading.classList.add("hide");
        }, 500);
      })
      .catch(error => {
        loading.innerText = "No data to show for selected country";
        console.error("There was a problem with the fetch operation:", error);
      });
  });
});

// Close button event to close the side panel
closeBtn.addEventListener("click", () => {
  sidePanel.classList.remove("side-panel-open");
});

// Zoom functionality
let zoomValue = 100;
zoomOutBtn.disabled = true;

zoomInBtn.addEventListener("click", () => {
  zoomOutBtn.disabled = false;
  zoomValue += 100;
  if (zoomValue < 500) {
    zoomInBtn.disabled = false;
  } else {
    zoomInBtn.disabled = true;
  }
  map.style.width = zoomValue + "vw";
  map.style.height = zoomValue + "vh";
  zoomValueOutput.innerText = zoomValue + "%";
});

zoomOutBtn.addEventListener("click", () => {
  zoomInBtn.disabled = false;
  zoomValue -= 100;
  if (zoomValue > 100) {
    zoomOutBtn.disabled = false;
  } else {
    zoomOutBtn.disabled = true;
  }
  map.style.width = zoomValue + "vw";
  map.style.height = zoomValue + "vh";
  zoomValueOutput.innerText = zoomValue + "%";
});

