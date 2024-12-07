let Assignment = require('../model/assignment');

// Récupérer tous les assignments (GET)
function getAssignments(req, res) {
    // Crée une requête agrégée vide pour récupérer tous les documents
    const aggregateQuery = Assignment.aggregate();

    // Utilise aggregatePaginate pour la pagination
    Assignment.aggregatePaginate(
        aggregateQuery,
        {
            page: parseInt(req.query.page) || 1, // Page demandée
            limit: parseInt(req.query.limit) || 10 // Nombre d'assignments par page
        },
        (err, assignments) => {
            if (err) {
                // Gère l'erreur
                return res.status(500).send(err);
            }
            // Retourne les résultats paginés
            res.json(assignments);
        }
    );
}

// Récupérer un assignment par son id (GET)
function getAssignment(req, res) {
    let assignmentId = req.params.id;

    Assignment.findOne({ id: assignmentId }, (err, assignment) => {
        if (err) { res.send(err) }
        res.json(assignment);
    })
}

// Ajout d'un assignment (POST)
function postAssignment(req, res) {
    let assignment = new Assignment();
    assignment.id = req.body.id;
    assignment.nom = req.body.nom;
    assignment.dateDeRendu = req.body.dateDeRendu;
    assignment.rendu = req.body.rendu;

    console.log("POST assignment reçu :");
    console.log(assignment)

    assignment.save((err) => {
        if (err) {
            res.send('cant post assignment ', err);
        }
        res.json({ message: `${assignment.nom} saved!` })
    })
}

// Update d'un assignment (PUT)
function updateAssignment(req, res) {
    console.log("UPDATE recu assignment : ");
    console.log(req.body);
    Assignment.findByIdAndUpdate(req.body._id, req.body, { new: true }, (err, assignment) => {
        if (err) {
            console.log(err);
            res.send(err)
        } else {
            res.json({ message: 'updated' })
        }

        // console.log('updated ', assignment)
    });

}

// suppression d'un assignment (DELETE)
function deleteAssignment(req, res) {
    Assignment.findOneAndRemove({ id: req.params.id }, (err, assignment) => {
        if (err) {
            res.status(500).send(err);
        } else if (!assignment) {
            res.status(404).send({ message: "Assignment introuvable." });
        } else {
            res.status(200).send({ message: `${assignment.nom} supprimé.` });
        }
    });
}



module.exports = { getAssignments, postAssignment, getAssignment, updateAssignment, deleteAssignment };
