const startPrice = () => {
  // find prices element
  const adult = document.getElementById('adult');
  const child = document.getElementById('child');
  const sumPrice = document.getElementById('sum');

  const inputNumb = e => {
    // result parameters
    let prices = { adult: 8, child: 5 };
    
    const arrVal = () => {
      // value of inputs for input fields valid
      if (e.target.value.indexOf('.') !== -1)
        e.target.value = Math.trunc(e.target.value);
      if (e.target.value.indexOf('-') !== -1)
        e.target.value = e.target.value.substr(1);
      if (e.target.value.length > 2 && parseInt(e.target.value < 100))
        e.target.value = e.target.value.substr(1);
     if (parseInt(e.target.value) >= 99)
        e.target.value = 99;
      if (parseInt(e.target.value) == 0 && e.target.value.length > 2)
        e.target.value = 0;
      if (!Number.isInteger(parseInt(e.target.value)))
        e.target.value = 0;
      const eValue = parseInt(e.target.value);

      // definition and consideration of user data
      if(typeof localStorage!='undefined') {
        if (!isNaN(eValue) && eValue < 100) {
          // user data for the input child field
          if (e.target == child && e.target.value != '') {
            if (e.keyCode === 13)
              child.blur();
            e.stopPropagation();
            localStorage.setItem('child', parseInt(e.target.value));
          }
          // user data for the input adult field
          if (e.target == adult && e.target.value != '') {
            if (e.keyCode === 13) {
              if (adult.nextElementSibling.control == child)
                child.focus();
            }
            e.stopPropagation();
            localStorage.setItem('adult', parseInt(e.target.value));
          }
          // stores user data in the browser
          let adultNb = parseInt(localStorage.getItem('adult'));
          let childNb = parseInt(localStorage.getItem('child'));
          // display of the result according to the data supplied by the user
          if (!isNaN(adultNb)) {
            adult.value = adultNb;
            if (adultNb >= 0 && isNaN(childNb)) {
              localStorage.setItem('child', 0);
              child.value = 0;
              childNb = 0;
            }
          } else if (isNaN(adult) && eValue !== '') {
            adult.value = adultNb;
          }
          if (!isNaN(childNb)) {
            child.value = childNb;
            if (childNb >= 0 && isNaN(adultNb)) {
              localStorage.setItem('adult', 0);
              adult.value = 0;
              adultNb = 0;
            }
          } else if (isNaN(childNb) && eValue !== '') {
            child.value = childNb;
          }
          // perform the calculation and then display the result
          const result = adultNb * prices.adult + childNb * prices.child;
          localStorage.setItem('price', result);
          sumPrice.innerHTML = result + '$';
        }
      } else {
        // user warning if localStorage functionality is not supported
        warning();
      }
    };
    // recovery of user data to localStorage
    arrVal();
  };

  const warning = () => {
    // user warning price functionnality unavailable
    adult.parentNode.querySelector('h4').innerText = 'Sorry price estimate unavailable';
    console.log('localStorage is not supported');
  };

  // define the first use
  if (sumPrice.innerHTML == '')
    sumPrice.innerHTML = '0$';
  if(typeof localStorage!='undefined') {
      // stores user data in the browser
      let adultNb = parseInt(localStorage.getItem('adult'));
      let childNb = parseInt(localStorage.getItem('child'));
      let priceNb = parseInt(localStorage.getItem('price'));
      if (!isNaN(adultNb))
        adult.value = adultNb;
      if (!isNaN(childNb))
        child.value = childNb;
      if (!isNaN(priceNb)) {
        sumPrice.innerHTML = priceNb + '$';
      } else {
        sumPrice.innerHTML = '0$';
      }
  } else {
    // user warning if localStorage functionality is not supported
    warning();
  }

  // event handler for entries in input fields
  adult.addEventListener('mouseup', inputNumb);
  adult.addEventListener("keyup", inputNumb);

  child.addEventListener('mouseup', inputNumb);
  child.addEventListener("keyup", inputNumb);
};
// calculate the price of show tickets
startPrice();


// provided the web page scroll Y (multi-browser compatible)
let scrollY = () => {
  let offset = window.pageXOffset !== undefined;
  let mode = ((document.compatMode || '') === 'CSS1Compat');
  
  return offset ? window.pageYOffset : mode ? document.documentElement.scrollTop : document.body.scrollTop;
};

const scroll = () => {
  // find menu element
  const el = document.querySelector('.menu');
  
  // set the final scroll
  const dim = el.getBoundingClientRect();
  const top = dim.top + scrollY();
  const w = dim.width;
  const h = dim.height;
  
  // complete the div element for the scroll Y (top menu)
  let solid = document.createElement('div');
  solid.style.width = w + 'px';
  solid.style.height = h + 'px';

  // emits the fixed class
  let onScroll = () => {
    let isFixed = el.classList.contains('fixed');
    if (scrollY() > top && !isFixed) {
      el.classList.add('fixed');
      el.style.width = w + 'px';
      el.parentNode.insertBefore(solid, el);
    } else if (scrollY() < top && isFixed) {
      el.classList.remove('fixed');
      el.parentNode.removeChild(solid);
    }
  };
  const reload = () => {
    /* hide only with codepen */
    window.location.reload();
  };
  window.addEventListener('scroll', onScroll);
  window.addEventListener('resize', reload);
};
// added a sticky menu at the top of the page with the scroll
scroll();

const currentTab = e => {
  // initializing arrays
  let arrHash = [], arrTop = [], arrHeight = [];
  let noActive = [];

  // find menu items
  const nav = document.querySelector('nav');
  const li = nav.querySelectorAll('li');
  [...li].map(x => {
    let liHash = x.childNodes[0].hash;
    arrHash.push(liHash);
  });

  // set the final scroll and others setting
  [...arrHash].map(secHash => {
    const section = document.querySelector(secHash);
    const dim = section.getBoundingClientRect();
    const top = dim.top + scrollY();
    const height = dim.height;
    arrTop.push(top);
    arrHeight.push(height);
  });

  // provides active class on flyover
  const overview = () => {
    // add the active class
    [...li].map((x, i) => {
      const liHash = x.childNodes[0].hash;
      const halfH = arrHeight[i] / 2;

      if (arrTop[i] - halfH<= scrollY() && arrTop[i] + halfH > scrollY()) {
        if (liHash == arrHash[i])
          x.classList.add('active');
        noActive = arrHash.filter(hash => hash !== arrHash[i]);
      }
    });

    // delete non active classes
    [...li].map(x => {
      let liHash = x.childNodes[0].hash;
      [...noActive].map(y => {
        if (liHash == y)
          x.classList.remove('active');
      });
    });
  };
  window.addEventListener('scroll', overview);
};
// adding an active class to the section overview
currentTab();
