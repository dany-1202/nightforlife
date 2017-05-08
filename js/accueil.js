/*!
 * Js de la page d'accueil
 */
 var lstVille = [];


$( document ).ready(function() {
  
  //Récupère les observatoires sur l'API cowaboo
  $.ajax({
    type : 'GET',
    dataType: 'json',
    url:'http://groups.cowaboo.net/group6/public/api/user?secretKey=SBREQNVJELBP62LU2NY2AAUXYILD2TAUTU2BRNKRZ4TO6A4L7774HETF',
    success : function(villes){
      //Stocke toutes les villes dans un tableau
      $.each(villes.observatories.subscribed, function(key, ville){
        lstVille.push(key);
      });
      afficherListeVilles(lstVille);
    }
  });
});

//On affiche les villes dans l'ordre alphabetique
function afficherListeVilles(lst){
  $("#listeVille").empty();
  lst.sort();
  if(lst.length >= 1){
    for (var i = 0; i < lst.length; i++) {
      $('#listeVille').append('<tr><td><a href="ville.html?ville='+lst[i]+'">'+lst[i]+'</a></td></tr>');
    };
  }else{
    $('#listeVille').append('<tr><td>'+"Aucune ville trouvée !"+'</td></tr>');
  }
}

//A chaque entrée clavier de l'utilisateur on va filtrer la liste des villes
$("#search").keyup(function(){
  var recherche = $("#search").val().trim().toLowerCase();
  var lstVilleRechercher = [];
  if(recherche != ""){
    for (var i = 0; i < lstVille.length; i++) {
      if(lstVille[i].toLowerCase().indexOf(recherche) != -1){
        lstVilleRechercher.push(lstVille[i]);
      }
    };
    afficherListeVilles(lstVilleRechercher);
  }else{
    afficherListeVilles(lstVille);
  }
  
});