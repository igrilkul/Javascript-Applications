function attachEvents() {
    //compile the template
    let source = document.getElementById("towns-template").innerHTML;
    let template = Handlebars.compile(source);

    $('#btnLoadTowns').on('click',attachTowns);

    function attachTowns() {
        let context={
            towns:[]
        };
        let towns = $('#towns').val().split(', ');
        for (let i = 0; i < towns.length; i++) {
          context.towns.push({name: towns[i]});
        }
        let html = template(context);
    console.log(context);
        $('#root').append(html);

        $('#towns').val('');
    }
}