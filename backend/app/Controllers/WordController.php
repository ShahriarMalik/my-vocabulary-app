<?php
namespace Shahr\Backend\Controllers;

class WordController {
    public function __construct() {
        // Constructor logic if needed
    }

    public function index() {
        // Logic to list all words
        echo json_encode(['message' => 'List of words']);
    }

    public function show($id) {
        // Logic to show a specific word
        echo json_encode(['message' => 'Showing word', 'id' => $id]);
    }

    public function create() {
        // Logic to create a new word
        echo json_encode(['message' => 'Word created']);
    }

    public function update($id) {
        // Logic to update a word
        echo json_encode(['message' => 'Word updated', 'id' => $id]);
    }

    public function delete($id) {
        // Logic to delete a word
        echo json_encode(['message' => 'Word deleted', 'id' => $id]);
    }
}
