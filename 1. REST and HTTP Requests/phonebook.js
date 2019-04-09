function  attachEvents(){
    let url = `https://phonebook-nakov.firebaseio.com/phonebook.json`;
    $('#btnLoad').on('click',loadData);

    function loadData() {
        let request = {
            url:url,
            success:loadEntries,
            error:console.log('error')
        };
        $.ajax(request);
    }

    $('#btnCreate').on('click',function () {
       if($('#person').val().length>0 && $('#phone').val().length>0)
       {
           let request = {
               url:url,
               method:'POST',
               data: JSON.stringify({person: $('#person').val(), phone: $('#phone').val()}),
               success:loadData()
           };
           $.ajax(request);
           $('#person').val('');
           $('#phone').val('');
       }
    });


    function loadEntries(response){
        let list = $('#phonebook');
        list.empty();
        let delBtn = $('<button>').text('[Delete]').on('click',function () {
            console.log($(this));
            $(this).parent().remove();
        });
        for(let key in response)
        {
            let li = $('<li>').text(`${response[key].person}: ${response[key].phone}`)
                .append($('<button>').text('[Delete]').on('click', (() => remove(key))
                ));
            list.append(li);
        }

    }

    function remove(key) {
        $.ajax({
            url:`https://phonebook-nakov.firebaseio.com/phonebook/${key}.json`,
            method: 'DELETE',
            success:loadData,
            error:console.log('failed to delete')
        });
    }

}