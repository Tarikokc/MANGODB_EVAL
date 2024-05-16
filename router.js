import { Router } from "express";
import {Balade} from "./model.js"


const router = Router();
1//
router.get('/all', async (req, res) => {
  try {
    const balades = await Balade.find();
    res.json(balades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

2//
router.get('/id/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const balade = await Balade.findById(id);

    if (!balade) {
      return res.status(404).json({ error: 'Balade non trouvée' });
    }

    res.json(balade);
  } catch (error) {
    res.status(500).json({ error: 'Erreur du serveur' });
  }
});

3//
router.get('/search/:search', async (req, res) => {
  const { search } = req.params;
  const searchRegex = new RegExp(search, 'i'); 
  try {
    const balades = await Balade.find({
      $or: [
        { nom_poi: searchRegex },
        { texte_intro: searchRegex }
      ]
    });

    res.json(balades);
  } catch (error) {
    res.status(500).json({ error: 'Erreur du serveur' });
  }
});

4//
router.get('/site-internet', async (req, res) => {
  try {
    const balades = await Balade.find({ url_site: { $ne: null } });
    res.json(balades);
  } catch (error) {
    res.status(500).json({ error: 'Erreur du serveur' });
  }
});

5//
router.get('/mot-cle', async (req, res) => {
  try {
    const balades = await Balade.find({ 'mot_cle.5': { $exists: true } }); 
    res.json(balades);
  } catch (error) {
    res.status(500).json({ error: 'Erreur du serveur' });
  }
});

6//
router.get("/publie/:annee", async (req, res) => {
  const annee = parseInt(req.params.annee); 

  const balades = await Balade.find({ date_saisie: { $regex: `${annee}` } }).sort({ date_saisie: 1 }).exec();

  res.json(balades); 
});

7//
router.get("/arrondissement/:num_arrondissement", async (req, res) => {
  const numArrondissement = req.params.num_arrondissement; 
  const count = await Balade.countDocuments({ code_postal: numArrondissement }).exec();

  res.json({ count });
});

8//
router.get("/synthese", async (req, res) => {
  const arrondissements = await Balade.distinct("code_postal").exec();
  const synthese = {};
  
  for (const arrondissement of arrondissements) {
    const count = await Balade.countDocuments({ code_postal: arrondissement }).exec();
    synthese[arrondissement] = count;
  }

  res.json(synthese); 
});

9//
router.get("/categories", async (req, res) => {
  const categories = await Balade.distinct("categorie").exec();

  res.json(categories); 
});

10//
router.post("/add", async (req, res) => {



});

11//
router.put("/add-mot-cle/:id", async (req, res) => {
  const id = req.params.id;
  const motCle = req.body.mot_cle;

  try {
    const balade = await Balade.findById(id).exec();

    if (!balade) {
      res.status(404).json({ message: "La balade avec cet ID n'a pas été trouvée" });
      return;
    }

    if (balade.mot_cle.includes(motCle)) {
      res.status(400).json({ message: "Le mot clé est déjà présent pour cette balade" });
      return;
    }

    balade.mot_cle.push(motCle);

    await balade.save();

    res.json({ message: "Le mot clé a été ajouté avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Une erreur est survenue lors de l'ajout du mot clé", error });
  }
});

12//
router.put("/update-one/:id", async (req, res) => {
  const { id } = req.params;
  const miseAJour = req.body;  


  try {
    const balade = await Balade.findByIdAndUpdate(id, miseAJour, { new: true });
  
    if (!balade) {
      res.status(404).json({ message: "La balade avec cet ID n'existe pas" });
      return;
    }

    res.json({ message: "La balade a été mise à jour avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Une erreur est survenue lors de la mise à jour de la balade", error });
  }
});

13//


14//
router.delete('/delete/:id', async (req, res) => {
  try {
      const { id } = req.params;

      const balade = await Balade.findByIdAndDelete(id);

      if (!balade) {
          return res.status(404).json({ error: 'Balade non trouvée.' });
      }

      res.status(200).json({ message: 'Balade supprimée avec succès.' });
  } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la suppression de la balade.' });
  }
});

export default router;
