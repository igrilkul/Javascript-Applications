$(() => {
    renderCatTemplate();

    function renderCatTemplate() {
    let source = document.getElementById('cat-template').innerHTML;
    let template = Handlebars.compile(source);
        // TODO: Render cat template and attach events

        let render = template({
            cats: window.cats
        });


        $('#allCats').html(render);
        $('.btn').on('click',function (){
            let clicked=$(this);
            if(clicked.text() === 'Show status code'){
                clicked.text('Hide status code')
            }
            else clicked.text('Show status code');

            clicked.next('div').toggle();
        })
    }

});
