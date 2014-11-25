
var Repeater = {
    interval_: 1500,
    id_: null,
    do: function() {
        if (Repeater.id_ != null)
            clearInterval(Repeater.id_);

        Repeater.id_ = setInterval(function() {
            var canvas = document.getElementsByTagName('canvas')[0];
            canvas.style.display = canvas.style.display == 'none' ? '' : 'none';
        }, Repeater.interval_);
    },
}
