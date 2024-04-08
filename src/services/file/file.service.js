const fs = require('fs');

exports.SaveDataToFile=(data)=> {
    try { 
        // Chemin du fichier où enregistrer les données
        const filePath = './data.json';
        
        // Écriture des données JSON dans le fichier
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        
        console.log('Les données ont été stockés avec succès dans le fichier:', filePath);
    } catch (error) {
        console.error("Une erreur s'est produite :", error);
      }

}
