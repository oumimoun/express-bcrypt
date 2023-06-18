const bcrypt = require('bcrypt');
const fixedsalt= '$2b$10$J9p8h1TEhTN6hjkf0p6f2O';
// Generate a salt and hash the plain password
/*
en fournissant un 'fixedsalt' en deuxième argument, la fonction hash() renvoie le même retour pour une 
chaine donnée car sinon, elle générera à chaque fois un 'salt' différent, ce qui entrainera une valeur 
de retour différente à chaque fois pour la même chaine d'entrée
*/ 
bcrypt.hash("plainPassword", fixedsalt) 
  .then(hashedPassword => { // hashedPassword : représente le haché de la chaine : "plainPassword"
    console.log('Hashed password:', hashedPassword);

    // Comparing passwords
    //compare() procèdera au hachage de la chaine : "plainPassword"; puis, elle la compare avec la chaine : hashedPassword
    bcrypt.compare("plainPassword", hashedPassword)
      .then(isMatch => {
        if (isMatch) {
          console.log('Password match!');
        } else {
          console.log('Password does not match!');
        }
      })
      .catch(error => {
        console.error('Error comparing passwords:', error);
      });
  })
  .catch(error => {
    console.error('Error hashing password:', error);
  });
    