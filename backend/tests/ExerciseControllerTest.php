<?php

use PHPUnit\Framework\TestCase;
use Shahr\Backend\Controllers\ExerciseController;
use Shahr\Backend\Gateways\ExerciseGateway;
use Shahr\Backend\Models\Exercise;

class ExerciseControllerTest extends TestCase
{
    private ExerciseController $exerciseController;
    private ExerciseGateway $exerciseGatewayMock;
    private object $responseMock;

    protected function setUp(): void
    {
        // Mock the database connection
        $dbMock = $this->createMock(stdClass::class);

        // Mock the ExerciseGateway
        $this->exerciseGatewayMock = $this->createMock(ExerciseGateway::class);

        // Mock the response object
        $this->responseMock = $this->getMockBuilder(stdClass::class)
            ->setMethods(['withJson'])
            ->getMock();

        // Inject mocks into ExerciseController
        $this->exerciseController = new ExerciseController($dbMock, $this->exerciseGatewayMock);
    }

    public function testCreateExercise()
    {
        // Mock the Exercise model and its methods
        $exerciseMock = $this->createMock(Exercise::class);

        // Expect the 'save' method to be called once
        $exerciseMock->expects($this->once())
            ->method('save');

        // Mock the ExerciseGateway (no need to configure a non-existing method)
        $this->exerciseGatewayMock = $this->createMock(ExerciseGateway::class);

        // Prepare request data
        $request = [
            'exercise_type' => 'multiple_choice',
            'word_id' => 1,
            'lesson_id' => 1,
            'question' => 'What is the synonym of fast?',
            'options' => ['quick', 'slow', 'hot', 'cold'],
            'correct_option' => 'quick'
        ];

        // Mock the response
        $this->responseMock = $this->getMockBuilder(stdClass::class)
            ->setMethods(['withJson'])
            ->getMock();

        // Expect the response to be called with certain parameters
        $this->responseMock->expects($this->once())
            ->method('withJson')
            ->with($this->arrayHasKey('message'))
            ->willReturn($this->responseMock);

        // Inject the mock Exercise model into the controller directly
        $this->exerciseController = new ExerciseController(null, $this->exerciseGatewayMock, $exerciseMock);

        // Call the method under test
        $result = $this->exerciseController->create($request, $this->responseMock);
        $this->assertEquals($this->responseMock, $result);
    }
}
