/*!
 * Js de la page admin
 */
 var secretKey = "";
 var lstVille = [];
 var lstBoite = [];
 var ville = "";
 var posVille = -1;


$( document ).ready(function() {
  chercherVille();
});

function chercherVille(){
  lstVille = [];
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
  
}

//On affiche les villes dans l'ordre alphabetique
function afficherListeVilles(lst){
  $("#listeVille").empty();
  $("#listeBoite").empty();
  $(".addBoite").css("display","none");
  lst.sort();
  if(lst.length >= 1){
    for (var i = 0; i < lst.length; i++) {
      $('#listeVille').append('<tr><td>'+lst[i]+'</td><td><button onclick="supprimerVille('+i+')" type="button" style="float:right;" class="btn btn-danger"><span class="glyphicon glyphicon-trash"></span></button><button onclick="afficherBoite('+i+')" type="button" style="float:right;" class="btn btn-secondary"><span class="glyphicon glyphicon-search"></span></button></td></tr>');
    };
  }else{
    $('#listeVille').append('<tr><td>'+"Aucune ville trouvée !"+'</td><td></td></tr>');
  }
}

$("#login").click(function(){
  secretKey = $("#pwd").val();
  $.ajax({
    type : 'GET',
    dataType: 'json',
    url:'http://groups.cowaboo.net/group6/public/api/user?secretKey='+secretKey,
    success : function(villes){
      $("#connexion").css("display","none");
      $("#administration").css("display","inline");
    },
    error : function(request,error){
      console.log("Erreur de connexion");
      $("#error").css("display","inline");
      $("#pwd").val("");
    }
  });
});

function supprimerVille(pos){
  //Supprime l'observatoire
  $.ajax({
    type : 'DELETE',
    url:'http://groups.cowaboo.net/group6/public/api/observatory?observatoryId='+lstVille[pos],
    data : {"secretKey":secretKey},
    success : function(rep){
      var info = lstVille[pos];
      chercherVille();
      alert(info+" a bien été supprimé !");
      $(".addBoite").css("display","none");
    }
  });
}

function afficherBoite(pos){
  posVille = pos;
  lstBoite = [];
  ville = lstVille[pos];
  $(".addBoite").css("display","inline");
  $.ajax({
    type : 'GET',
    dataType: 'json',
    url:'http://groups.cowaboo.net/group6/public/api/observatory?observatoryId='+lstVille[pos],
    success : function(boites){
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
}

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
        $('#listeBoite').append('<tr><td>'+boite.nom+'</td><td><button onclick="supprimerBoite('+i+')" type="button" style="float:right;" class="btn btn-danger"><span class="glyphicon glyphicon-trash"></span></button></td></tr>');
      };
  }else{
    $('#listeBoite').append('<tr><td>Aucune boite existante</td><td></td></tr>');
  }
}

function supprimerBoite(pos){
  //Supprime l'entre
  $.ajax({
    type : 'DELETE',
    url:'http://groups.cowaboo.net/group6/public/api/entry',
    dataType: 'json',
    data : {"secretKey":secretKey,"observatoryId":ville,"hash":lstBoite[pos].hash},
    success : function(rep){
      var info = lstBoite[pos].nom;
      afficherBoite(posVille);
      alert(info+" a bien été supprimé !");
    }
  });
}

function ajouterVille(){
  var nameVille = $("#villeAjouter").val().trim();
  if($.inArray(nameVille,lstVille) == -1 && nameVille.length >= 2){
    //Ajouter l'observatoire
    $.ajax({
      type : 'POST',
      url:'http://groups.cowaboo.net/group6/public/api/observatory',
      dataType: 'json',
      data : {"secretKey":secretKey,"observatoryId":nameVille},
      success : function(rep){
        $("#villeAjouter").val("");
        chercherVille();
        alert(nameVille+" a bien été ajouté !");
      }
    });
  }else{
    if(nameVille.length < 2){
      alert("Le nom de la ville doit contenir au moins 2 caractères !");
    }else{
      alert("Cette ville existe déjà !");
    }
    $("#villeAjouter").val("");
  }
}

function ajouterBoite(){
  
  var nameBoite = $("#boiteAjouter").val().trim();
  var style = $("#sel1 option:selected").text();
  console.log(secretKey+" - "+lstVille[posVille]+" - "+nameBoite+" - "+style);
  for (var i = 0; i < lstBoite.length; i++) {
    if(lstBoite[i].nom === nameBoite || nameBoite.length >= 2){
      if(nameBoite.length < 2){
        alert("Le nom de la boite doit contenir au moins 2 caractères !");
        return;
      }else{
        alert("Cette boite existe déjà !");
        return;
      }
    }
  };
  $.ajax({
      type : 'POST',
      url:'http://groups.cowaboo.net/group6/public/api/entry',
      dataType: 'json',
      data : {"secretKey":secretKey,"observatoryId":lstVille[posVille],"tags":nameBoite,"value":style},
      success : function(rep){
        $("#boiteAjouter").val("");
        afficherBoite(posVille);
        alert(nameBoite+" a bien été ajouté !");
      }
      });
}