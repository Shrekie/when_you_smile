//TODO: Stricter file type check
//TODO: Allow upload from external URL
app.factory('imageManager', function() {

    var uploadImage = function(evt){
        var tgt = evt.target || window.event.srcElement, 
            files = tgt.files;
        if (FileReader && files && files.length) {
            switch(files[0].type)
            {
                case 'image/png':
                case 'image/gif':
                case 'image/jpeg':
                case 'image/pjpeg':
                    console.log("wehat")
                    this.cImagePreview.attr('src', URL.createObjectURL(files[0]));
                    $("#myModal").modal('hide');
                    $("#URLInput").val("");
                    break;
                default:
                    alert('Unsupported File!');
            }
        }
    };

    var linkImage = function(imageURL){;
        fetch(imageURL)
        .then(res => res.blob()) // Gets the response and returns it as a blob
        .then(blob => {
            switch(blob.type)
            {
                case 'image/png':
                case 'image/gif':
                case 'image/jpeg':
                case 'image/pjpeg':
                    console.log("wehat")
                    this.cImagePreview.attr('src', URL.createObjectURL(blob));
                    $("#myModal").modal('hide');
                    $("#URLInput").val("");
                    break;
                default:
                    alert('Unsupported File!');
            }
        });
    };

    var cImagePreview = {};

    return {
        uploadImage,
        linkImage,
        cImagePreview
    }
    
});