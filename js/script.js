const btn = document.getElementById('menu-btn')
const menu = document.getElementById('menu')

btn.addEventListener('click', navToggle)

function navToggle() {
  btn.classList.toggle('open')
  menu.classList.toggle('flex')
  menu.classList.toggle('hidden')
}

// iletisim section
let contact_info = document.querySelector("#contact_info");
let contact_us = document.querySelector("#contact_us");
let swtich_to_contact_us = document.querySelector("#swtich_to_contact_us");
let swtich_to_contact_info = document.querySelector(
  "#swtich_to_contact_info"
);

swtich_to_contact_us.addEventListener("click", () => {
  contact_info.style.display = "none";
  contact_us.style.display = "block";
});

swtich_to_contact_info.addEventListener("click", () => {
  contact_info.style.display = "block";
  contact_us.style.display = "none";
});


// 
let span = document.querySelector(".up");

window.onscroll = function () {
  this.scrollY >= 1000 ? span.classList.add("show") : span.classList.remove("show");
};

span.onclick = function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};



// 
const counts = document.querySelectorAll('.count')
const speed = 97

counts.forEach((counter) => {
    function upDate(){
        const target = Number(counter.getAttribute('data-target'))
        const count = Number(counter.innerText)
        const inc = target / speed        
        if(count < target){
            counter.innerText = Math.floor(inc + count) 
            setTimeout(upDate, 15)
        }else{
            counter.innerText = target
        }
    }
    upDate()
})
