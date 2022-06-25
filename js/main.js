//loading screen fadeout when data is loaded
$(document).ready(function () {
  $(".loading-screen").fadeOut(500);
});

let closedSidebar = true,
  imgBaseUrl = "https://image.tmdb.org/t/p/w500/",
  defaultPage = 1,
  defaultCategory = 0,
  urls = [
    `https://api.themoviedb.org/3/movie/now_playing?api_key=622b35560587232b7de804a3c947af08`,
    `https://api.themoviedb.org/3/movie/popular?api_key=622b35560587232b7de804a3c947af08`,
    `https://api.themoviedb.org/3/movie/top_rated?api_key=622b35560587232b7de804a3c947af08`,
    `https://api.themoviedb.org/3/trending/all/day?api_key=622b35560587232b7de804a3c947af08`,
    `https://api.themoviedb.org/3/movie/upcoming?api_key=622b35560587232b7de804a3c947af08`,
  ],
  moviesArray = [],
  alerts = document.querySelectorAll("p.alert"),
  contactInputs = document.querySelectorAll("#contact .data-inputs input"),
  nameInput = contactInputs[0],
  emailInput = contactInputs[1],
  phoneInput = contactInputs[2],
  ageInput = contactInputs[3],
  passwordInput = contactInputs[4],
  confirmPasswordInput = contactInputs[5],
  userMessages = [];

//get messages from local storage if found
if (localStorage.getItem("userMessage")) {
  userMessages = JSON.parse(localStorage.getItem("userMessage"));
}

//function to open and close sidebar
$(".toggle-sidebar i").click(function () {
  let slideSidebarWidth = $(".slide-sidebar").innerWidth();
  if (closedSidebar) {
    $(".toggle-sidebar i.fa-align-justify").addClass("fa-times");
    $(".slide-sidebar").animate({ left: "0px" }, 500, function () {
      let time = 600;
      for (let i = 0; i < $(".slide-sidebar ul li").length; i++) {
        $(".slide-sidebar ul li")
          .eq(i)
          .animate({ opacity: "1", paddingTop: "25px" }, (time += 100));
      }
    });
    $(".fixed-sidebar").animate({ left: slideSidebarWidth }, 500);
    closedSidebar = false;
  } else {
    $(".toggle-sidebar i.fa-times").removeClass("fa-times");
    $(".slide-sidebar ul li").animate(
      { opacity: "0", paddingTop: "100%" },
      500
    );
    $(".slide-sidebar").animate({ left: -slideSidebarWidth }, 500);
    $(".fixed-sidebar").animate({ left: "0px" }, 500);
    closedSidebar = true;
  }
});

//add click event on the list of the sidebar
for (let i = 0; i < $(".slide-sidebar ul li").length - 1; i++) {
  $(".slide-sidebar ul li")
    .eq(i)
    .click(function () {
      defaultCategory = i;
      defaultPage = 1;
      restDefaultNumberPage();
      fetchURL();
    });
}

/*check if url has value or not then connect to the api and display movies data */
async function fetchURL(url) {
  url == undefined
    ? (url = urls[defaultCategory] + `&page=${defaultPage}`)
    : url;
  let response = await fetch(url);
  let data = await response.json();
  moviesArray = data.results;
  displayMovies(moviesArray);
}
fetchURL();

/*empty the movies div then create new movies divs and display them */
displayMovies = (movies) => {
  $(".movies").empty();
  for (let i = 0; i < movies.length; i++) {
    let movie = `<div class="col-md-6 col-xl-4 rounded rounded-3">
        <div class="movie position-relative overflow-hidden">
            <div class="cover-photo">
                <img
                    src="${imgBaseUrl + movies[i].poster_path}"
                    class="img-fluid rounded"
                />
                </div>
                <div
                class="movie-info position-absolute bottom-0 w-100 rounded px-3 text-center text-black"
                >
                <h2 class="pt-5">
                    ${movies[i].original_title || movies[i].original_name}
                </h2>
                <p>
                    ${movies[i].overview}
                </p>
                <p>Rate: <span>${movies[i].vote_average}</span> / 10
                        <i class="fa-solid fa-star"></i>
                </p>
                <p>Release Date: <span>${movies[i].release_date}</span></p>
            </div>
        </div>
      </div>`;
    $(".movies").append(movie);
  }
};

//search moveies by name
$(".data-inputs input")
  .eq(0)
  .keyup(function () {
    if (this.value == "") {
      fetchURL();
      return;
    }
    let searchWord = this.value,
      searchURL = `https://api.themoviedb.org/3/search/movie?api_key=622b35560587232b7de804a3c947af08&language=en-US&query=${searchWord}&include_adult=false`;
    fetchURL(searchURL);
  });

//search movies in the shown data
$(".data-inputs input")
  .eq(1)
  .keyup(function () {
    if (this.value == "") {
      displayMovies(moviesArray);
      $(".data-inputs input").eq(1).blur();
    }
    let searchWord = this.value.toLowerCase();
    let matchedMovies = moviesArray.filter((movie) => {
      return movie.original_title.toLowerCase().includes(searchWord);
    });
    displayMovies(matchedMovies);
  });

//pagination to set page variable with the number of the page
$("ul.pagination li").click(function () {
  $("ul.pagination li").removeClass("active");
  $(this).addClass("active");
  defaultPage = +$(this).text();
  let page = $(this).text();
  if (page == "Next") {
    next3Pages();
    $(this).removeClass("active");
  } else if (page == "Previous") {
    if ($("ul.pagination li").eq(1).text() != "1") {
      previous3Pages();
      $(this).removeClass("active");
    } else {
      return;
    }
  }
  fetchURL(urls[defaultCategory] + `&page=${defaultPage}`);
});

//get next 3 Pages
function next3Pages() {
  $("ul.pagination li a")
    .eq(1)
    .text(+$("ul.pagination li").eq(1).text() + 3);
  $("ul.pagination li").eq(1).addClass("active");
  $("ul.pagination li a")
    .eq(2)
    .text(+$("ul.pagination li").eq(2).text() + 3);
  $("ul.pagination li a")
    .eq(3)
    .text(+$("ul.pagination li").eq(3).text() + 3);
  defaultPage = +$("ul.pagination li").eq(1).text();
}

//get previous 3 Pages
function previous3Pages() {
  $("ul.pagination li a")
    .eq(1)
    .text(+$("ul.pagination li").eq(1).text() - 3);
  $("ul.pagination li").eq(1).addClass("active");
  $("ul.pagination li a")
    .eq(2)
    .text(+$("ul.pagination li").eq(2).text() - 3);
  $("ul.pagination li a")
    .eq(3)
    .text(+$("ul.pagination li").eq(3).text() - 3);
  defaultPage = +$("ul.pagination li").eq(1).text();
}

//rest the default page to 1
function restDefaultNumberPage() {
  $("ul.pagination li").removeClass("active");
  $("ul.pagination li a").eq(1).text(1);
  $("ul.pagination li a").eq(2).text(2);
  $("ul.pagination li a").eq(3).text(3);
  $("ul.pagination li").eq(1).addClass("active");
}

//name validation
nameInput.addEventListener("keyup", checkName);
function checkName() {
  alerts[0].classList.replace("d-block", "d-none");
  let nameRegex = /^[a-zA-Z0-9]+$/;
  if (nameRegex.test(nameInput.value) == false) {
    alerts[0].classList.replace("d-none", "d-block");
    return false;
  }
  return true;
}

//email validation
emailInput.addEventListener("keyup", checkEmail);
function checkEmail() {
  alerts[1].classList.replace("d-block", "d-none");
  let emailRegex = /.+@.{2,}\..{2,4}$/;
  if (emailRegex.test(emailInput.value) == false) {
    alerts[1].classList.replace("d-none", "d-block");
    return false;
  }
  return true;
}

//phone number validation
phoneInput.addEventListener("keyup", checkPhoneNumber);
function checkPhoneNumber() {
  alerts[2].classList.replace("d-block", "d-none");
  let phoneRegex = /^(01)[0-25][0-9]{8}$/;
  if (phoneRegex.test(phoneInput.value) == false) {
    alerts[2].classList.replace("d-none", "d-block");
    return false;
  }
  return true;
}

//age validation
ageInput.addEventListener("keyup", checkAge);
function checkAge() {
  alerts[3].classList.replace("d-block", "d-none");
  let ageRegex = /^[0-9]{1,2}$/;
  if (ageRegex.test(ageInput.value) == false) {
    alerts[3].classList.replace("d-none", "d-block");
    return false;
  }
  return true;
}

//show or hide password when eye icon is clicked
$(".show-password").click(function () {
  $(this).toggleClass("fa-eye fa-eye-slash");
  let passwordInput = $(this).prev();
  passwordInput.attr("type") == "password"
    ? passwordInput.attr("type", "text")
    : passwordInput.attr("type", "password");
});

//password validation
passwordInput.addEventListener("keyup", checkPassword);
function checkPassword() {
  alerts[4].classList.replace("d-block", "d-none");
  let passwordRegex = /^(?=.*?[A-Za-z])(?=.*?[0-9])(?=.*?[!@#$%^&*?]).{8,}$/;
  if (passwordRegex.test(passwordInput.value) == false) {
    alerts[4].classList.replace("d-none", "d-block");
    return false;
  }
  return true;
}

//confirm password validation
confirmPasswordInput.addEventListener("keyup", checkConfirmPassword);
function checkConfirmPassword() {
  alerts[5].classList.replace("d-block", "d-none");
  if (passwordInput.value != confirmPasswordInput.value) {
    alerts[5].classList.replace("d-none", "d-block");
    return false;
  }
  return true;
}

//submit the form and check if all the inputs are valid or not
document.getElementById("contact").addEventListener("click", function () {
  let submit =
    checkName() &&
    checkEmail() &&
    checkPhoneNumber() &&
    checkAge() &&
    checkPassword() &&
    checkConfirmPassword();
  submit
    ? document.querySelector(".submit-button").classList.remove("disabled")
    : document.querySelector(".submit-button").classList.add("disabled");
});

//add click event and clear the inputs
$(".submit-button").click(function () {
  let userMessage = {
    name: nameInput.value,
    email: emailInput.value,
    phone: phoneInput.value,
    age: ageInput.value,
    password: passwordInput.value,
  };
  userMessages.push(userMessage);
  localStorage.setItem("userMessage", JSON.stringify(userMessages));
  clearInputs();
});

//function to clear the inputs
clearInputs = () => {
  nameInput.value = "";
  emailInput.value = "";
  phoneInput.value = "";
  ageInput.value = "";
  passwordInput.value = "";
  confirmPasswordInput.value = "";
};
