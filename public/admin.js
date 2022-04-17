var user = '';


async function getUser(){
    const token = getCookie('token');
    console.log(token);
    if( token === ""){
        //alert('Session expired!! \n Please login again...');
        window.location = './index.html';
    }
    
        const response = await fetch('/authenticate' , {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
        token, usertype: 'admin'
        })
    }).then((res) => res.json());

    console.log(response);

    if(response.state === 'ok'){
        
        return response.username;
    }
    if(response.state === 'error'){
        alert(response.error);
        window.location  = './index.html';
    }
    return '';
  }


  function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  
  getUser().then(x => { 
    console.log(x);
    user = x; 
});

console.log(user);
async function getData(address) {
            url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=pk.eyJ1IjoicnVwNjIwIiwiYSI6ImNsMjI3ZnE3bjE3azEzcW1pNGJmdXN1YmQifQ.n_whflkiMI4E_UqiKdf5tg&limit=1`;
            const response1 = await fetch(url);
             
            const data1 = await response1.json();
             
            var [long1,lat1] = data1.features[0].center;
            //var long1=111, lat1=222;
            const token = getCookie('token');
            const response = await fetch('/setLocation' , {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token, long1, lat1
                })
            }).then((res) => res.json());

            if(response.state === 'ok'){
                alert("success");

            }
            return {long1,lat1};
}

const form = document.getElementById("reg-form");
  
  form.addEventListener('submit', setLocation );
  //alert("heello");
  async function setLocation(event) {
      event.preventDefault();
      const address = document.getElementById("address").value;
      console.log(address);
      getData(address);
  }


