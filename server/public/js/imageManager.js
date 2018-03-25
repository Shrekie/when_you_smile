app.factory('imageManager', function() {

    return{
		uploadImage:(sourceTarget, evt)=>{
            var tgt = evt.target || window.event.srcElement, 
                files = tgt.files;
            if (FileReader && files && files.length) {
                switch(files[0].type)
                {
                    case 'image/png':
                    case 'image/gif':
                    case 'image/jpeg':
                    case 'image/pjpeg':
                        var fr = new FileReader();
                        fr.onload = function () {
                            localStorage['localImage'] = fr.result;
                            angular.element('#'+sourceTarget).attr('src', localStorage['localImage']);
                        }
                        fr.readAsDataURL(files[0]);
                        break;
                    default:
                        alert('Unsupported File!');
                }
            }
        }
    }
});