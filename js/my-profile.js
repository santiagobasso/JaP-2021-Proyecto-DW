const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
const yearSelect = document.getElementById("year");
const monthSelect = document.getElementById("month");
const daySelect = document.getElementById("day");

document.addEventListener("DOMContentLoaded", function (e) {
  populateMonths();
  populateDays(monthSelect.value);
  populateYears();
  loadProfile();
  document
    .getElementById("saveChanges")
    .addEventListener("click", function (e) {
      e.preventDefault();
      saveProfile();
    });
});

function populateMonths() {
  for (let i = 0; i < months.length; i++) {
    const option = document.createElement("option");
    option.textContent = months[i];
    monthSelect.appendChild(option);
  }
  monthSelect.value = "Enero";
}

let previousDay;

function populateDays(month) {
  while (daySelect.firstChild) {
    daySelect.removeChild(daySelect.firstChild);
  }

  let dayNum;

  let year = yearSelect.value;

  if (
    month === "Enero" ||
    month === "Marzo" ||
    month === "Mayo" ||
    month === "Julio" ||
    month === "Agosto" ||
    month === "Octubre" ||
    month === "Diciembre"
  ) {
    dayNum = 31;
  } else if (
    month === "Abril" ||
    month === "Junio" ||
    month === "Septiembre" ||
    month === "Noviembre"
  ) {
    dayNum = 30;
  } else {
    if (new Date(year, 1, 29).getMonth() === 1) {
      dayNum = 29;
    } else {
      dayNum = 28;
    }
  }
  for (let i = 1; i <= dayNum; i++) {
    const option = document.createElement("option");
    option.textContent = i;
    daySelect.appendChild(option);
  }
  if (previousDay) {
    daySelect.value = previousDay;
    if (daySelect.value === "") {
      daySelect.value = previousDay - 1;
    }
    if (daySelect.value === "") {
      daySelect.value = previousDay - 2;
    }
    if (daySelect.value === "") {
      daySelect.value = previousDay - 3;
    }
  }
}

function populateYears() {
  let year = new Date().getFullYear();
  for (let i = 0; i < 121; i++) {
    const option = document.createElement("option");
    option.textContent = year - i;
    yearSelect.appendChild(option);
  }
}

yearSelect.onchange = function () {
  populateDays(monthSelect.value);
};
monthSelect.onchange = function () {
  populateDays(monthSelect.value);
};
daySelect.onchange = function () {
  previousDay = daySelect.value;
};

function previewProfilePic() {
  let preview = document.getElementById("img-profile");
  let img = document.getElementById("fileInput").files[0];
  let reader = new FileReader();
  reader.onloadend = function () {
    preview.src = reader.result;
  };
  if (img) {
    reader.readAsDataURL(img);
  } else {
    preview.src = "img/img_avatar.jpg";
  }
}

function saveProfile() {
  document.getElementsByTagName("form")[0].classList.add("was-validated");
  if (document.getElementsByTagName("form")[0].checkValidity() === true) {
    let profilePic = document.getElementById("img-profile");
    let userLogin = JSON.parse(localStorage.getItem("user"));
    let profile = {};

    profile.firstNames = document.getElementById("firstNames").value;
    profile.lastNames = document.getElementById("lastNames").value;
    profile.birthDate = `${document.getElementById("day").value}/${document.getElementById("month").value}/${document.getElementById("year").value}`;
    profile.email = document.getElementById("email").value;
    profile.phoneNumber = document.getElementById("phoneNumber").value;
    profile.profilePic = profilePic.src;


    var bday = document.getElementById("day").value;
    var bmonth = document.getElementById("month").selectedIndex;
    var byear = document.getElementById("year").value;
    profile.age = calculateAge(bday, bmonth, byear);

    localStorage.setItem(
      "userProfile_" + userLogin.user,
      JSON.stringify(profile)
    );
    document.getElementById("confirmation").classList.add("show");
  }
}

function loadProfile() {
  let userLogin = JSON.parse(localStorage.getItem("user"));
  let userProfile = JSON.parse(
    localStorage.getItem("userProfile_" + userLogin.user)
  );
  if (userProfile != null || userProfile != undefined) {
    document.getElementById("firstNames").value = userProfile.firstNames;
    document.getElementById("lastNames").value = userProfile.lastNames;
    document.getElementById("email").value = userProfile.email;
    document.getElementById("phoneNumber").value = userProfile.phoneNumber;
    document.getElementById("img-profile").src = userProfile.profilePic;
    var birthDate = userProfile.birthDate.split("/");
    document.getElementById("day").value = birthDate[0];
    document.getElementById("month").value = birthDate[1];
    document.getElementById("year").value = birthDate[2];
  }
}

function calculateAge(bday, bmonth, byear) {
  var today = new Date();
  var birthdate = new Date(byear, bmonth, bday);
  var age = today.getFullYear() - birthdate.getFullYear();
  var month = today.getMonth() - birthdate.getMonth();

  if (month < 0 || (month === 0 && today.getDate() < birthdate.getDate())) {
    age--;
  }

  return age;
}
