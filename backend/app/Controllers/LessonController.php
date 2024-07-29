<?php
namespace Shahr\Backend\Controllers;

class LessonController{
    public function __construct(){
        // Constructor logic
    }

    public function index(){
        // Logic to list all lessons
        echo json_encode(['message' => 'List of lessons']);
    }

    public function show($id){
        // Logic to show a lesson
        echo json_encode(['message'=> 'Showing lesson', 'lesson_id'=> $id]);
    }

    public function create(){
        // Logic to create a new lesson
        echo json_encode(['message'=> 'Lesson created']);
    }

    public function update($id){
        // Logic to update a lesson
        echo json_encode(['message'=> 'Lesson updated', 'lesson_id'=> $id]);
    }

    public function delete($id){
        // Logic to delete a lesson
        echo json_encode(['message'=> 'Lesson deleted', 'lesson_id'=> $id]);
    }
}