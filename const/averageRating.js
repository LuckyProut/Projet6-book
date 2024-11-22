exports.average = (array) => {
    // initialise une variable à 0 pour stocker la somme des éléments du tablrau
    let sum = 0;
    // Parcourt chaque élément du tableau
    for (let nb of array) {
        // Ajoute la valeur de l'élément actuel à la variable
        sum += nb;
    };
     // Calcule la moyenne 
    // .toFixed(1) arrondit la moyenne à une décimale
    return (sum/array.length).toFixed(1);
};