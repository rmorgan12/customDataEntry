// Available globals
var domo = window.domo; // For more on domo.js: https://developer.domo.com/docs/dev-studio-guides/domo-js#domo.get
var datasets = window.datasets;
var $ = window.jQuery;
var myDiv = document.getElementById('myDiv');
var collectionName = 'form_data';
var syncToDataset = true;
var syncEnabled = true;

// Fetch Data
async function fetchData() {
    const data = await domo.get('/data/v2/dataset0')

    var schoolNames = data.map(item => item['School Name (Display)'])
    var uniqueSchoolNames = [...new Set(schoolNames)];
    console.log(uniqueSchoolNames)
    var accountCategory = data.map(item => item['AccountCategory'])
    var uniqueAccountCategories = [...new Set(accountCategory)];
    var accountSubCategory = data.map(item => item['AccountSubCategory'])
    var uniqueSubAccountCategories = [...new Set(accountSubCategory)];
    buildForm(uniqueSchoolNames, uniqueAccountCategories, uniqueSubAccountCategories);
}

function resetForm() {
  // Reset form fields to their initial state
  document.getElementById('formYear').selectedIndex = 0;
  document.getElementById('formMonth').selectedIndex = 0;
  document.getElementById('schoolSelector').selectedIndex = 0;
  document.getElementById('formAcct').selectedIndex = 0;
  document.getElementById('formSubAcct').selectedIndex = 0;
  document.getElementById('formProjection').value = '';
  document.getElementById('formNote').value = '';
}

function handleSubmit() {
  var formData = {
    fiscalYear: document.getElementById('formYear').value,
    calendarMonth: document.getElementById('formMonth').value,
    schoolName: document.getElementById('schoolSelector').value,
    accountCategory: document.getElementById('formAcct').value,
    accountSubCategory: document.getElementById('formSubAcct').value,
    eoyProjection: document.getElementById('formProjection').value,
    notes: document.getElementById('formNote').value,
  };

  var body = {content:formData}
  addEntry(body)
  resetForm();
}


// Build the form
async function buildForm(schoolData, accountData, subAccountData){
    var $form;
    var formEl = document.getElementById('myForm');
    $form = $(formEl);
    var $body = $form.find('.form-group')
    $body.append(`
      <header>
        <h1>Data Entry Form</h1>
      </header> 
      <label for="formYear">Fiscal Year</label>
      <select class="custom-select" id="formYear">
        <option selected>Select a Year</option>
        <option>2024</option>
        <option>2025</option>
        <option>2026</option>
        <option>2027</option>
        <option>2028</option>
      </select>

      <label for="formMonth">Calendar Month</label>
      <select class="custom-select" id="formMonth">
        <option selected>Select a Month</option>
        <option>January (01)</option>
        <option>February (02)</option>
        <option>March (03)</option>
        <option>April (04)</option>
        <option>May (05)</option>
        <option>June (06)</option>
        <option>July (07)</option>
        <option>August (08)</option>
        <option>September (09)</option>
        <option>October (10)</option>
        <option>November (11)</option>
        <option>December (12)</option>
      </select>
    `)

    $body.append(`
      <label for="schoolSelector">School Name</label>
      <select class="custom-select" id="schoolSelector"></select>`)
      
    const schoolElement = document.getElementById("schoolSelector");
    $body.append(schoolElement); // Append the select element to the form
    populateDropdown(schoolElement, schoolData);

    $body.append(`
          <label for="formAcct">Account Category</label>
      <select class="custom-select" id="formAcct"></select>`)

    const accountElement = document.getElementById("formAcct");
    $body.append(accountElement); // Append the select element to the form
    populateDropdown(accountElement, accountData);

    $body.append(`
          <label for="formSubAcct">Account Sub-Category</label>
      <select class="custom-select" id="formSubAcct"></select>`)

    const subcategoryElement = document.getElementById("formSubAcct");
    $body.append(subcategoryElement); // Append the select element to the form
    populateDropdown(subcategoryElement, subAccountData);

    $body.append(`
      <label for="formProjection">EOY Projection</label>
      <input type="number" class="form-control" id="formProjection" placeholder="Enter EOY Projection ($)">

      <label for="formNote">Notes</label>
      <textarea class="form-control" id="formNote" rows="3" placeholder="Enter Notes Here"></textarea>
      <footer>
          <button class="btn btn-light" onclick="resetForm()">Cancel</button>
          <button class="btn btn-primary" id="submitButton" type="button">Submit</button>
      </footer>
  `);

  // Add event listener to the submit button
  document.getElementById('submitButton').addEventListener('click', handleSubmit);
}
// Default Option
function addDefaultOption(selectElement) {
  const defaultOption = document.createElement('option');
  defaultOption.value = ''; // Set the value if needed
  defaultOption.text = 'Select Value';
  selectElement.appendChild(defaultOption);
}

// Create Dropdown
function populateDropdown(selectElement, optionsData) {
  // Clear existing options
  selectElement.innerHTML = '';
  addDefaultOption(selectElement);

  // Create and append new options
  optionsData.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option; // Set the value if needed
    optionElement.text = option;
    selectElement.appendChild(optionElement);
  });
}
// AppDB Writeback
async function addEntry(data) {
  await domo.post("/domo/datastores/v1/collections/form_data/documents/", data);
}

fetchData()
