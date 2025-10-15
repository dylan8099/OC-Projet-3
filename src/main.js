// URL de l'API pour get les données
const API = 'http://localhost:5678/api/works';
let allWorks = []; 

/////// Get catégorie des projets
function uniqueCategoriesFrom(works) {
  const map = new Map();

  works.forEach(w => {
    // Check si le projet a une categorie
    if (w.category && typeof w.category.id === 'number') {
      // Ajout catégorie
      map.set(w.category.id, w.category.name);
    }
  });

  return [{ id: 0, name: 'Tous' }, ...Array.from(map, ([id, name]) => ({ id, name }))];
}

//////// Génération des boutons de filtre dynamiquement
function renderFilters(categories) {
  const container = document.querySelector('.filter');
  container.innerHTML = ''; // utile ? 

  // Génération btn pour chaque catégorie
  categories.forEach(cat => {
    const btn = document.createElement('button'); // Crée un bouton
    btn.className = 'filter-choice';
    btn.dataset.catId = String(cat.id); // ID de la catégorie
    btn.textContent = cat.name; // Nom de la catégorie
    container.appendChild(btn); // Ajoute le bouton
  });

  // Active le bouton ("Tous") par défaut
  const first = container.querySelector('.filter-choice');
  if (first) first.classList.add('active');
}

// Setup des btn de filtre + appel fonction pour générer le contenu
function setupFilters() {
  const container = document.querySelector('.filter');

  // Event de click sur les btn
  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-choice'); // Vérification qu'on clique bien sur un btn de filtre
    if (!btn) return;

    // Retire la class active des boutons 
    [...container.querySelectorAll('.filter-choice')].forEach(b => b.classList.remove('active'));

    // Class active pour la couleur du bouton cliqué
    btn.classList.add('active');

    // Get ID du bouton
    const catId = Number(btn.dataset.catId);

    // ID = "Tous", on affiche tous les projets
    if (catId === 0) {
      displayWorks(allWorks);
    } else {
      // Affichage des projets en fonction de ID (~"Tous")
      displayWorks(allWorks.filter(w => w.categoryId === catId));
    }
  });
}

//////// Function pour afficher les projets dans la galerie
function displayWorks(works) {
  const gallery = document.querySelector('.gallery');
  gallery.innerHTML = ''; // Vide la galerie avant, utile ?

  // Pour chaque projet, on crée une image et une légende
  works.forEach(work => {
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    img.src = work.imageUrl; // Image
    img.alt = work.title; // Titre

    const caption = document.createElement('figcaption');
    caption.textContent = work.title;

    figure.append(img, caption);
    // On ajoute dans la galerie
    gallery.appendChild(figure);
  });
}

/////// Function pour get les projets et créer la page dynamiquement
async function generateWorks() {
  const response = await fetch(API); // Récupère les données depuis l’API
  allWorks = await response.json();

  // Function pour afficher tous les projets
  displayWorks(allWorks);

  // Crée les filtres à partir des catégories trouvées dans les projets
  const categories = uniqueCategoriesFrom(allWorks);
  renderFilters(categories);

  // Function pour setup les filtres
  setupFilters();
}

// Appel de la function generate, peut etre une solution plus propre ?
generateWorks();
