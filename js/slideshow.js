const imageData = new Map();
// list of all the input fields
const $inputFormList = $("#url-forms");

let slideIndex = 0;
let currentImageId = 0;
let timer = 4;

// const preLoadedImages = [];
const preLoadedImages = ["https://img.medscape.com/thumbnail_library/is_151022_doctor_patient_computer_ehr_800x600.jpg",
  "https://www.healthcareitnews.com/sites/default/files/doctor%20with%20ehr%20712_3.jpg",
  "https://www.healthcareitnews.com/sites/default/files/doctor-patient-tablet-stock-712_0.jpg",
  "http://www.mosmedicalrecordreview.com/blog/wp-content/uploads/2017/09/physician-patient-interaction.jpg"];

$(document).ready(function(event) {
  if (preLoadedImages != null && preLoadedImages.length > 0) {
    timer = 15;
    setPresetImages(preLoadedImages);
  }
  setFileUploadInput();
  setTimerActions(event);
  prepopulateImage(1);
});

const getImageData = image => {
  return {"image" : image};
};

const setTimer = timeInSeconds => {
  timer = isNaN(timeInSeconds) || timeInSeconds < .1 ? 1000 : timeInSeconds * 1000;
  $('#currentTime').text(timer/1000 + " seconds");
}

const setPresetImages = presetImages => {
  presetImages.forEach(element => {
    addDisabledImageForm(element);
    addImageUrlToSlideShow(element, "Caption", currentImageId);
    currentImageId++;
  }); 
}

function setFileUploadInput() {
  const fileInput = document.getElementById("upload-image");
  fileInput.addEventListener("change",function(e){
    let files = this.files
    showThumbnail(files)
  },false)
}

function setTimerActions(event) {
  $('#timer').keydown(function(event) {
    if (event.keyCode == 13) {
      setTimer(this.valueAsNumber);
      this.blur();
      return false;
    }
  });

  let wto;
  $('#timer').keyup(function() {
    clearTimeout(wto);
    let val = this.valueAsNumber;
    wto = setTimeout(function() {
      setTimer(val);
    }, 1000);
  });

  setTimer(timer);
}

const setSlideStyleDisplay = (slides, index, display) => {
  slides[index].style.display = display;
 }

function showSlides() {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");

  if (slides.length != 0) {
    for (i = 0; i < slides.length; i++) {
      setSlideStyleDisplay(slides, i, "none");
    }
    // resetting slideIndex back to 0 
    if (slideIndex + 1 > slides.length) {
      slideIndex = 0;
    }
    
    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active-dot", "");
    }
    slides[slideIndex].style.display = "inline-block";  
    dots[slideIndex].className += " active-dot";
    slideIndex++;
  }
    setTimeout(showSlides, timer);
  
}

function prepopulateImage(numForms) {
  for (let i = 0; i < numForms; i++) {
    addImageFormToHtml(true);
    currentImageId++;
  }
}

function addDisabledImageForm(imageName) {
  addImageFormToHtml(false, imageName);
}

function addImageFormToHtml(isEnabled, imageName) {
  const $textField = isEnabled ? buildTextField(currentImageId) : buildDisabledTextField(currentImageId, imageName);
  let currIndex = currentImageId;
  $textField.keydown(event => {
    if (event.keyCode == 13) {
      addImageToSlideShow(currIndex);
    }
  });

  let itemId = "url-form-" + currentImageId;
  let $formItem = $("<li height='35'>", {id: itemId, "class": "row fade-image form-list"});
  $formItem.attr('id', itemId);
  $formItem.attr('class', 'fade-image');
  $formItem.append($textField);
  $formItem.append(buildButtons(currentImageId));
  $inputFormList.append($formItem);

  $textField.focus();
}


function buildTextField(id) {
  return $("<input>", {id: "image-text-" + id, type: "text"});
}
function buildDisabledTextField(id, text) {
  let $field = $("<input>", {id: "image-text-" + id, type: "text", value: text});
  $($field).prop('disabled', true);
  return $field;
}
function buildButtons(id) {
  return buildButtonEnabledDisabled(id, true);
}

function buildButtonEnabledDisabled(id, isEnabled) {
  let onAddAction = isEnabled ? "' onclick='addImageToSlideShow(" + id + ")'"
  : " disabled'";
  let onDeleteAction = "' onclick='removeImageFromSlideShow(" + id + ")'";
  return " <button class='btn btn-success" + onAddAction + "><i class='fa fa-check'></i></button>"
  + " <button class='btn btn-danger" + onDeleteAction + "><i class='fa fa-close'></i></button>";
}

function addImageToSlideShow(id) {
  currentImageId = "image-text-" + id;
  const url = $("#" + currentImageId).val();
  if (url != null && url != "") {
    addImageUrlToSlideShow(url, "Caption", id);
    addImageFormToHtml(true, "");
    currentImageId++;
  }
}

function addImageUrlToSlideShow(url, captionText, id) {
  const image = document.createElement("img");
  image.src = url;
  imageData.set(id, getImageData(image));
  setImageToSlideShow(id);
}

function addUploadedImageToSlideShow(image, captionText, id) {  
  imageData.set(id, getImageData(image));
  setImageToSlideShow(id);
}

function setImageToSlideShow(id) {
  let info = imageData.get(id);
  let display = slideIndex === 0 ? "inline-block" : "none";

  const getSlideImageWrapper = (id, display) => "<div class='mySlides fade-image' id='image-" + id + "'style='display:" + display + ";'><div class='numbertext'></div>" +
  "<div class='text'></div></div>";
  const getDotContainer = (id) => "<span class='dot' id='dot-" + id + "'></span>";
  const setDimensionOfImage = (info) => {
    const heightDif = window.innerHeight - info.image.height;
    const widthDif = window.innerWidth - info.image.width;
    if (heightDif < widthDif) {
      info.image.height = window.innerHeight;  
    } else {
      info.image.width = window.innerWidth;  
    }
  }

  setDimensionOfImage(info);

  $(".slideshow-container").append(getSlideImageWrapper(id, display));
  $("#image-" + id).append(info.image);
  $(".dot-container").append(getDotContainer(id));

  if (imageData.size === 1) {
   showSlides();
  }
}

function removeImageFromSlideShow(id) {
  idImage = "image-" + id;
  idDot = "dot-" + id;
  idForm = "image-text-" + id;
  idUrlForm = "url-form-" + id;
  document.getElementById(idDot).remove();
  document.getElementById(idUrlForm).remove();
  document.getElementById(idImage).remove();
  $("#" + idForm).val("");
}

function showThumbnail(files){
  for(let i=0;i<files.length;i++){
    currentImageId++;
    const file = files[i]
    const imageType = /image.*/
    if(!file.type.match(imageType)){
      const warningText = file.name + " is not an image.";
      console.log(warningText);
      alert(warningText);
      continue;
    }

    const image = document.createElement("img");
    image.file = file;
    addUploadedImageToSlideShow(image, "Caption", currentImageId);
    addDisabledImageForm(file.name);

    const reader = new FileReader()
    reader.onload = (function(aImg){
      return function(e){
        aImg.src = e.target.result;
      };
    }(image))
    const ret = reader.readAsDataURL(file);
    const canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
    image.onload= function(){
      ctx.drawImage(image,20,20)
    }
  }
}