function myFunction(id) {
    var copyText = document.getElementById("text_mail" + id);
    copyText.hidden = false;
    copyText.select();
    document.execCommand("Copy");
    copyText.hidden = true;
    alert("O E-mail " + copyText.value + " foi copiado");
  }
