function attachEvents() {


    let USERNAME = 'guest';
    let PASSWORD = 'guest';
    let BASE_64 = btoa(USERNAME + ":" + PASSWORD);
    let authHeaders = {"Authorization":"Basic " + BASE_64};
    let baseSurviceUrl = 'https://baas.kinvey.com/appdata/kid_r1KnH3BNm/BiggestCatches';

    $('.load').on('click', loadCatches);
    let field=$('#catches');
    function loadCatches() {

        let request = {
            url: baseSurviceUrl,
            method: "GET",
            headers: authHeaders
        };

        $.ajax(request)
            .then(showCatches);





    }

    $('.add').on('click',addCatch);

    function showCatches(catches) {
        $('#catches').empty();
        for (let catche of catches) {
            let div=$('<div class="catch">').attr('data-id',catche._id);
            div
                .append($('<label>').text('Angler'))
                .append($('<input type="text" class="angler">').val(catche.angler))
                .append($('<label>').text('Weight'))
                .append($('<input type="number" class="weight">').val(catche.weight))
                .append($('<label>').text('Species'))
                .append($('<input type="text" class="species">').val(catche.species))
                .append($('<label>').text('Location'))
                .append($('<input type="text" class="location">').val(catche.location))
                .append($('<label>').text('Bait'))
                .append($('<input type="text" class="bait">').val(catche.bait))
                .append($('<label>').text('Capture Time'))
                .append($('<input type="number" class="captureTime">').val(catche.captureTime))
                .append($('<button class="update">').text('Update').on('click',updateCatch))
                .append($('<button class="delete">').text('Delete').on('click',deleteCatch));

            field.append(div);
        }


    }

    function updateCatch() {
        //console.log(this);
        let inputs = $(this).parent().find('input');
        let catchId = $(this).parent().attr('data-id');

        let request = {
            url:baseSurviceUrl + '/' + catchId,
            method: "PUT",
            headers: {"Authorization": "Basic "+BASE_64,"Content-type": "application/json"},
            data: JSON.stringify({
                angler: $(inputs[0]).val(),
                weight: Number($(inputs[1]).val()),
                species: $(inputs[2]).val(),
                location: $(inputs[3]).val(),
                bait: $(inputs[4]).val(),
                captureTime: Number($(inputs[5]).val())
            })
            };

            $.ajax(request)
                .then(loadCatches);


        }


    function deleteCatch() {
        let catchId = $(this).parent().attr('data-id');

        let request = {
            url:baseSurviceUrl + '/' + catchId,
            method: 'DELETE',
            headers: {"Authorization": "Basic "+BASE_64,"Content-type":"application/json"}
        };

        $.ajax(request)
            .then(loadCatches);
    }

    function addCatch() {
        let catche = $(this).parent().find('input');

        let request = {
            url:baseSurviceUrl,
            method: "POST",
            headers:{"Authorization": "Basic "+BASE_64,"Content-type":"application/json"},
           data: JSON.stringify({
               angler:$(catche[0]).val(),
               weight:Number($(catche[1]).val()),
               species:$(catche[2]).val(),
               location:$(catche[3]).val(),
               bait:$(catche[4]).val(),
               captureTime:Number($(catche[5]).val())
           })
        };

        $.ajax(request)
            .then(loadCatches);

        for(let input of catche)
        {
            $(input).val('');
        }
    }
}