let increment = 0;
let total = 0;
getCategories();
getProducts();

function getCategories() {
  fetch("https://dummyjson.com/products/categories")
    .then((res) => res.json())
    .then((res) => {
      res.forEach((category) => {
        let categories = document.getElementById("categories");
        const option = document.createElement("option");
        option.setAttribute("value", "category");
        option.innerText = category;
        categories.appendChild(option);
      });
    })
    .catch((error) => {});
}
function selectCategory() {
  let e = document.getElementById("categories");
  var text = e.options[e.selectedIndex].text;
  if (text) {
    let container = document.querySelector(".grid-container");
    container.innerHTML = "";
    getProducts(0, `https://dummyjson.com/products/category/${text}`);
  }
}
function getProducts(skipNumber = 0, apiUrl) {
  skipNumber = skipNumber * increment;
  increment += 1;
  let url;
  if (apiUrl) {
    url = apiUrl;
  } else {
    url = "https://dummyjson.com/products?limit=12";
    url += `&skip=${skipNumber}`;
  }
  let viewMore = document.querySelector(".view-more");
  if (viewMore) {
    toggleViewMoreBtn(true);
    toggleLoader();
  }
  fetch(url)
    .then((res) => res.json())
    .then((products) => {
      total = products.total;
      products.products.forEach((product) => {
        createCart(product);
      });
      toggleViewMoreBtn(false);
      toggleLoader(true);
      if (skipNumber == total - 4 || total <= 12) {
        toggleViewMoreBtn(true);
      }
    })
    .catch((error) => {
      toggleLoader(true);
    });
}

function createCart(product) {
  const div = document.createElement("div");
  div.classList.add("grid-item");
  div.innerHTML = `
  <img class='image' src='${product.thumbnail}'>
  <h3 class='title'>${product.title}</h3>
  <span class='price'>${product.price}</span>
  <span class='currency'>EGP</span>
  <button class='add-to-card' data-id='${product.id}' data-title='${product.title}' data-image='${product.thumbnail}' data-price='${product.price}' onclick='addToCart(event)'>Add to Cart</button>
  `;
  let container = document.querySelector(".grid-container");
  container.appendChild(div);
}

function toggleViewMoreBtn(removeBtn = false) {
  if (removeBtn) {
    let viewMore = document.querySelector(".view-more");
    viewMore?.remove();
  } else {
    const button = document.createElement("button");
    button.innerText = "View More";
    button.setAttribute("onclick", "getProducts(12);");
    button.classList.add("view-more");
    document.body.appendChild(button);
  }
}

function toggleLoader(remove = false) {
  if (remove) {
    let loader = document.querySelector(".loader");
    if (loader) {
      loader.remove();
    }
  } else {
    const span = document.createElement("span");
    span.classList.add("loader");
    document.body.appendChild(span);
  }
}

let allSelectedItems = {};
function addToCart(e) {
  let selectedItem = {
    title: e.target.getAttribute("data-title"),
    price: e.target.getAttribute("data-price"),
    image: e.target.getAttribute("data-image"),
    id: e.target.getAttribute("data-id"),
  };
  allSelectedItems[selectedItem.id] = selectedItem;
  localStorage.setItem("allSelectedItems", JSON.stringify(allSelectedItems));
  e.target.classList.add("dimmed");
}
