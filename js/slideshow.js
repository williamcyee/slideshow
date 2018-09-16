// contains, in order, the slideshow data required for each image
const slideshowValues = [];
// the list of image input fields
const $inputFormList = $("#url-forms");

let currentImageId = 0;
let overridenSlideIndex = null;
let timer;


// const preLoadedImages = [];
let preLoadedImages = ["https://img.medscape.com/thumbnail_library/is_151022_doctor_patient_computer_ehr_800x600.jpg",
"https://www.healthcareitnews.com/sites/default/files/doctor%20with%20ehr%20712_3.jpg",
"https://www.healthcareitnews.com/sites/default/files/doctor-patient-tablet-stock-712_0.jpg",
"http://www.mosmedicalrecordreview.com/blog/wp-content/uploads/2017/09/physician-patient-interaction.jpg"];
// preLoadedImages = [];

$(document).ready(event => {
  setTimerActions(event);
  hasPreloadedImages = (preLoadedImages != null && preLoadedImages.length > 0);
  setTimer(hasPreloadedImages ? 3 : 4);

  if (hasPreloadedImages) {
    setPresetImages(preLoadedImages);
  }
  setFileUploadInput();
  prepopulateImage(1);
});

const buildSlideshowData =
$slideWrapper =>
$dotContainer => 
imageValue =>
{
  const mappedValue = [$slideWrapper, $dotContainer, imageValue];
  slideshowValues.push(mappedValue);
  return mappedValue;
}

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
  const $timer = $('#timer');
  $timer.keydown(function(event) {
    if (event.keyCode == 13) {
      setTimer(this.valueAsNumber);
      this.blur();
      return false;
    }
  });

  let wto;
  $timer.keyup(function() {
    clearTimeout(wto);
    let val = this.valueAsNumber;
    wto = setTimeout(function() {
      setTimer(val);
    }, 1000);
  });
}

const setSlideStyleDisplay = (slides, index, display) => {
  slides[index].style.display = display;
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
  imageId = "image-text-" + id;
  const url = $("#" + imageId).val();
  if (url != null && url != "") {
    addImageUrlToSlideShow(url, "Caption", id);
    addImageFormToHtml(true, "");
    currentImageId++;
  }
}

function addImageUrlToSlideShow(url, captionText, id) {
  const image = document.createElement("img");
  image.src = url;
  setImageToSlideShow(id, image);
}

function addUploadedImageToSlideShow(image, captionText, id) {  
  setImageToSlideShow(id, image);
}

const setDimensionOfImage = (img) => {
  const heightDif = window.innerHeight - img.height;
  const widthDif = window.innerWidth - img.width;
  if (heightDif < widthDif) {
    img.height = window.innerHeight;  
  } else {
    img.width = window.innerWidth;  
  }
}

const buildDotContainer = (id) => {
  return $dotContainer = $("<span>", {id: 'dot-' + id, class: 'dot'})
};

const getSlideImageWrapper = (id, display) => $("<div>", {id: 'image-' + id, class: 'mySlides fade-image', 'style':'display:' + display});

function setImageToSlideShow(id, image) {  
  const $dot = buildDotContainer(id);
  const display = slideshowValues.length === 0 ? "inline-block" : "none";
  const $slideWrapper = getSlideImageWrapper(id, display);
  const info = buildSlideshowData($slideWrapper)($dot)(image);

  setDimensionOfImage(info[2]);
  $(".slideshow-container").append(info[0]);
  $(".dot-container").append(info[1]);
  $("#image-" + id).append(info[2]);
  
  setActionToDot(info[1]);

  if (slideshowValues.length === 1) {
   showSlides(0, true);
 }
}

const setActionToDot = (dot) => {
  let id = dot[0].getAttribute('id');
  $('#' + id).on('click', function() {
    overridenSlideIndex = getSlideshowValueIndexOnDotId(id);
  });
}

function showSlides(slideIndex, shouldShowNextSlide) {
  if (overridenSlideIndex != null) {
    slideIndex = overridenSlideIndex;
    overridenSlideIndex = null;
  }
  for (let i=0; i < slideshowValues.length; i++) {
    const isCurrentIndex = i === slideIndex ? true : false;
    const current = slideshowValues[i]
    const $wrapper = current[0][0];
    const $dot = current[1];

    $wrapper.style.display = isCurrentIndex ? 'inline-block': 'none';

    if (isCurrentIndex) {
      $dot.addClass("active-dot");
    } else {
      $dot.removeClass("active-dot");
    }
  }

  wto = setTimeout(function() {
    if (shouldShowNextSlide) {
      slideIndex++;
      if (slideIndex >= slideshowValues.length) {
        slideIndex = 0;
      }
      showSlides(slideIndex, shouldShowNextSlide)
    };
  }, timer);
}

function removeImageFromSlideShow(id) {
  idImage = "image-" + id;
  idDot = "dot-" + id;
  idForm = "image-text-" + id;
  idUrlForm = "url-form-" + id;
  removeImageFromData(idDot);
  document.getElementById(idDot).remove();
  document.getElementById(idUrlForm).remove();
  document.getElementById(idImage).remove();
  $("#" + idForm).val("");
}

const getSlideshowValueIndexOnDotId = (idDot) => {
  for (let i = 0 ; i < slideshowValues.length; i++) {
    // figure a better way to get the right object
    if (idDot === slideshowValues[i][1].attr('id')) {
      return i;
    }
  }
}

const removeImageFromData = (idDot) =>{
  const index = getSlideshowValueIndexOnDotId(idDot);
  slideshowValues.splice(index,1);
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