<?php
namespace shahr\Backend\Controllers;

class UserController{
    public function __construct(){
        // Constructor logic
    }

    public function index(){
        // Logic to list all users
        echo json_encode(['message'=> 'List of users']);
    }

    public function show($id){
        // Logic to a show a specific users
        echo json_encode(['message'=> 'Showing user', 'id'=> $id]);
    }

    public function create(){
        // Logic to create a new user
        echo json_encode(['message'=> 'User created']);
    }

    public function update($id){
        // Logic to delete a user
        echo json_encode(['message'=> 'User Updated', 'id'=> $id]);
    }
}