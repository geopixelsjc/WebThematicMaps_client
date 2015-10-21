
var window_bottom = $('.window_bottom');

$('#minimizeWindow').click(function(){
    var vButtom = $(this).val();
    
    if (vButtom == '0') {
        var alturaModal = $("#legends").height() * -1;
        window_bottom.animate({
            bottom: alturaModal + 'px'
        });
        $('#minimizeWindow').attr('value', 1);
        $('#minimizeWindow').text('Mostrar Legendas');
    } else {
        window_bottom.animate({
            bottom: 0 + 'px'
        });
        $('#minimizeWindow').attr('value', 0);
        $('#minimizeWindow').text('Ocultar Legendas');
    }
return false;
});

setTimeout(function(){
    $('#minimizeWindow').click();
}, 1000)