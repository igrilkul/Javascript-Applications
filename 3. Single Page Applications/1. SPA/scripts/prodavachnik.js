function startApp() {
    $('header').find('a').show();
    const baseUrl = "https://console.kinvey.com/apps/Prodavachnik-78029/environments/kid_H1AVWn2VQ/";
    const appKey = "kid_H1AVWn2VQ";
    const appSecret = "36528219e9ad47dfacdeed025a098a4f";
    const BASE64 = btoa(appKey + ":" + appSecret);
    const auth = {"Authorization": "Basic "+ BASE64};

    $('#viewHome').show();
  function navigateTo(e) {
      $('section').hide();
      let target = $(e.target).attr('data-target');
      $('#' + target).show();
  }
showHideMenuLinks();
  $('header').find('a[data-target]').click(navigateTo);

  //Event Listeners
    $('#buttonRegisterUser').on('click',requestRegister);
    $('#buttonLoginUser').on('click',loginUser);
    $('#linkLogout').on('click',logoutUser);
    $('#linkListAds').on('click',listAds);
    $('#buttonCreateAd').on('click',createAd);
    $('#buttonEditAd').on('click',editAd);

    console.log(sessionStorage.getItem('userId'));

    function showHideMenuLinks() {
    if(sessionStorage.getItem('userId'))
    {
        $('#linkLogin').hide();
        $('#linkRegister').hide();
        $('#linkLogout').show();
    }
    else{
        $('#linkLogin').show();
        $('#linkRegister').show();
        $('#linkLogout').hide();
    }

}
    //Listener functions
    function requestRegister() {
        let form = $('#formRegister');
        let username = form.find('input[name="username"]').val();
        let password = form.find('input[name="passwd"]').val();
        console.log(username);

        $.ajax({
            url:'https://baas.kinvey.com/user/'+appKey+'/',
            method:"POST",
            headers:auth,
            data:{
                username:username,
                password:password
            },
            success:registerSuccess,
            error:showError
        });

        function registerSuccess(userInfo) {
            saveAuthInSession(userInfo);
            showHideMenuLinks();
            listAds();
            showInfo('User registration successful.');
        }
    }

    function loginUser() {
        let userData = {
            username:$('#formLogin input[name=username]').val(),
            password:$('#formLogin input[name=passwd]').val()
        };

        console.log(userData);
        $.ajax({
            method: "POST",
            url:'https://baas.kinvey.com/user/'+appKey+"/login",
            headers:auth,
            data:userData,
            success:loginSuccess,
            error:handleAjaxError
        });

        function loginSuccess(userInfo) {
            saveAuthInSession(userInfo);
            $('#linkLogin').hide();
            $('#linkRegister').hide();
            showHideMenuLinks();
            listAds();
            showInfo('Login successful.');
        }
    }

    function logoutUser() {
        sessionStorage.clear();
        $('#loggedInUser').text("");
        showHideMenuLinks();
        navigateTo('#linkHome');
        showInfo('Logout successful.');
        console.log('logged out');
    }

    function createAd() {

        const kinveyUserUrl =
            'https://baas.kinvey.com/user/'+appKey+'/'+sessionStorage.getItem('userId');

        let adData;

            //get publisher
            $.ajax({
                method:"GET",
                url:kinveyUserUrl,
                headers:getKinveyUserAuthHeaders(),
                success:afterPublisherRequest,
                error:handleAjaxError
            });

            function afterPublisherRequest(publisherInfo) {
                adData = {
                    title: $('#formCreateAd input[name=title]').val(),
                    publisher: publisherInfo.username,
                    description: $('#formCreateAd textarea').val(),
                    price: $('#formCreateAd input[name=price]').val(),
                    datePublished: $('#formCreateAd input[name=datePublished]').val(),
                };
                postData();

                $('#formCreateAd input[name=title]').val('');
                $('#formCreateAd textarea').val('');
                $('#formCreateAd input[name=price]').val('');
                $('#formCreateAd input[name=datePublished]').val('');
            }

      //post Ad
    function postData() {
        $.ajax({
            method: "POST",
            url: "https://baas.kinvey.com/appdata/" + appKey + "/Ads",
            headers: getKinveyUserAuthHeaders(),
            data: adData,
            success: createAdSuccess,
            error: handleAjaxError
        });
    }

        function createAdSuccess(response) {
            listAds();
            showInfo('Ad created.');
        }
    }

    function listAds() {
        $('#ads').empty();
        navigateTo('linkListAds');

        $.ajax({
            method:"GET",
            url:"https://baas.kinvey.com/appdata/"+appKey+"/Ads",
            headers: getKinveyUserAuthHeaders(),
            success:loadAdsSuccess,
            error:handleAjaxError
        });

        function loadAdsSuccess(ads) {
            showInfo('Ads loaded.');
            if(ads.length === 0)
            {
                $('#ads').text('No ads to display');
            }
            else {
                 let adsTable = $('<table>')
                     .append($('<tr>').append(
                         '<th>Title</th>',
                         '<th>Publisher</th>',
                         '<th>Description</th>',
                         '<th>Price</th>',
                         '<th>Date Published</th>',
                         '<th>Actions</th>'
                     ));
                 for(let ad of ads)
                     appendAdRow(ad,adsTable);
                 $('#ads').append(adsTable);
            }
        }

        function appendAdRow(ad,adsTable) {
            let links = []; //ToDo
            if(ad._acl.creator === sessionStorage['userId'])
            {
                let deleteLink = $('<a href="#">[Delete]</a>')
                    .click(deleteAd.bind(this, ad));
                let editLink = $('<a href="#">[Edit]</a>')
                    .click(loadAdForEdit.bind(this,ad));
                links=[deleteLink,' ',editLink];
            }
            adsTable.append($('<tr>').append(
                $('<td>').text(ad.title),
                $('<td>').text(ad.publisher),
                $('<td>').text(ad.description),
                $('<td>').text(ad.price),
                $('<td>').text(ad.datePublished),
                $('<td>').append(links)
            ));
        }
        $('#viewAds').show();

        function deleteAd(ad){
            $.ajax({
                method:"DELETE",
                url:"https://baas.kinvey.com/appdata/"+appKey+"/Ads/"+ad._id,
                headers:getKinveyUserAuthHeaders(),
                success:deleteAdSuccess,
                error:handleAjaxError
            });

            function deleteAdSuccess(response)
            {
                listAds();
                showInfo('Ad deleted.');
            }
        }

        function loadAdForEdit(ad){
           $.ajax({
               method:"GET",
               url:"https://baas.kinvey.com/appdata/"+appKey+"/Ads/"+ad._id,
               headers:getKinveyUserAuthHeaders(),
               success:loadAdForEditSuccess,
               error:handleAjaxError
           });

           function loadAdForEditSuccess(ad) {
               $('#formEditAd input[name=id]').val(ad._id);
               $('#formEditAd input[name=title]').val(ad.title);
               $('#formEditAd input[name=publisher]').val(ad.publisher);
               $('#formEditAd textarea').val(ad.description);
               $('#formEditAd input[name=price]').val(ad.price);
               $('#formEditAd input[name=datePublished]').val(ad.datePublished);

               $('section').hide();
               $('#viewEditAd').show();
           }
        }



    }

    function editAd() {
        let adData = {
            _id: $('#formEditAd input[name=id]').val(),
            title: $('#formEditAd input[name=title]').val(),
            publisher: $('#formEditAd input[name=publisher]').val(),
            description: $('#formEditAd textarea').val(),
            price: $('#formEditAd input[name=price]').val(),
            datePublished: $('#formEditAd input[name=datePublished]').val()
        };
        $.ajax({
            method:"PUT",
            url:"https://baas.kinvey.com/appdata/"+appKey+"/Ads/"+adData._id,
            headers:getKinveyUserAuthHeaders(),
            data:adData,
            success:editAdSuccess,
            error:handleAjaxError
        });

        function editAdSuccess(response) {
            listAds();
            showInfo('Ad edited.');
        }
    }

    function getKinveyUserAuthHeaders() {
        return {
            'Authorization': "Kinvey " +
                sessionStorage.getItem('authToken')
        };
    }




    function saveAuthInSession(userInfo) {
        console.log('saved');
        let userAuth = userInfo._kmd.authtoken;
        sessionStorage.setItem('authToken',userAuth);
        let userId = userInfo._id;
        sessionStorage.setItem('userId',userId);
        let username = userInfo.username;
        $('#loggedInUser').text("Welcome, " + username + "!");
    }

    function showInfo(message) {
        console.log('msg');
        $('#infoBox').text(message);
        $('#infoBox').show();
        setTimeout(function () {
            $('#infoBox').fadeOut();
        },3000);
    }

    function showError(errorMsg) {
        let box = $('#errorBox');
        box.text("Error: " + errorMsg);
        box.show();
    }



    function handleAjaxError(response) {
        let errorMsg=JSON.stringify(response);
        if(response.readyState === 0)
            errorMsg = "Cannot connect due to network error.";
        if(response.responseJSON && response.responseJSON.description)
            errorMsg = response.responseJSON.description;
        showError(errorMsg); //ToDo
    }



}