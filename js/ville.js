/*!
 * Js de la page ville
 */
 var lstBoite = [];
 var villeRechercher = "";


$( document ).ready(function() {
  var boiteNom = "";
  var infoBoite = "";
  villeRechercher = decodeURIComponent($.urlParam('ville'));
  $("#nomVille").text(villeRechercher); 
  //Récupère les Entrées pour une ville sélectionné
  $.ajax({
    type : 'GET',
    dataType: 'json',
    url:'http://groups.cowaboo.net/group6/public/api/observatory?observatoryId='+villeRechercher,
    success : function(boites){
      //console.log(boites.dictionary.entries);
      $.each(boites.dictionary.entries, function(key, boite){
        //Traitement des données on enleve "||" en début et fin du nom de la boite
        var boiteNom = boite.tags.replace('||','');
        var boiteNom = boiteNom.replace('||','');
        var infoBoite = {nom:boiteNom,style:boite.value,hash:key};
        lstBoite.push(infoBoite);
      });
      afficherListeBoites(lstBoite);
    }
  });
});

//Permet de trier le tableau d'objet sur le nom de la boite
function SortByName(a, b){
  var aName = a.nom.toLowerCase();
  var bName = b.nom.toLowerCase(); 
  return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
}

//On affiche les boites et leur style dans l'ordre alphabetique du nom de la boite
function afficherListeBoites(lst){
  $("#listeBoite").empty();
  $(".error").hide();
  var boite = "";
  lst.sort(SortByName);
  if(lst.length>=1){
    for (var i = 0; i < lst.length; i++) {
        boite = lst[i];
        $('#listeBoite').append('<tr><td>'+boite.nom+'</td><td>'+boite.style+'</td></tr>');
      };
  }else{
    $(".error").show();
  }
}

//Fonction qui récupère le QueryParameter
$.urlParam = function(name){
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
  return results[1] || 0;
}