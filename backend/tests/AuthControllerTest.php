<?php

use PHPUnit\Framework\TestCase;
use Shahr\Backend\Controllers\AuthController;
use Shahr\Backend\Gateways\UserGateway;
use Shahr\Backend\Gateways\RefreshTokenGateway;
use Shahr\Backend\Gateways\PasswordResetGateway;
use Shahr\Backend\Helpers\Mailer;

class AuthControllerTest extends TestCase
{
    private AuthController $authController;
    private UserGateway $userGatewayMock;
    private RefreshTokenGateway $refreshTokenGatewayMock;
    private PasswordResetGateway $passwordResetGatewayMock;
    private Mailer $mailerMock;
    private object $responseMock;

    protected function setUp(): void
    {
        // Mock the database connection
        $dbMock = $this->createMock(stdClass::class);

        // Mock the dependencies
        $this->userGatewayMock = $this->createMock(UserGateway::class);
        $this->refreshTokenGatewayMock = $this->createMock(RefreshTokenGateway::class);
        $this->passwordResetGatewayMock = $this->createMock(PasswordResetGateway::class);
        $this->mailerMock = $this->createMock(Mailer::class);
        $this->responseMock = $this->getMockBuilder(stdClass::class)
            ->setMethods(['withJson'])
            ->getMock();

        // Inject mocks into AuthController
        $this->authController = new AuthController(
            $dbMock,
            $this->userGatewayMock,
            $this->refreshTokenGatewayMock,
            $this->passwordResetGatewayMock
        );
    }

    public function testRegisterSuccess()
    {
        $this->userGatewayMock->expects($this->once())
            ->method('emailExists')
            ->with('test@example.com')
            ->willReturn(false);

        $this->userGatewayMock->expects($this->once())
            ->method('save'); // No need to set a return value

        $this->responseMock->expects($this->once())
            ->method('withJson')
            ->with(['message' => 'User registered successfully'])
            ->willReturn($this->responseMock);

        $request = [
            'username' => 'testuser',
            'email' => 'test@example.com',
            'password' => 'password123'
        ];

        $result = $this->authController->register($request, $this->responseMock);
        $this->assertEquals($this->responseMock, $result);
    }


    public function testLoginInvalidCredentials()
    {
        $this->userGatewayMock->expects($this->once())
            ->method('findByEmail')
            ->with('wrong@example.com')
            ->willReturn(null);

        $this->responseMock->expects($this->once())
            ->method('withJson')
            ->with(['message' => 'Invalid credentials'], 400)
            ->willReturn($this->responseMock);

        $request = [
            'email' => 'wrong@example.com',
            'password' => 'wrongpassword'
        ];

        $result = $this->authController->login($request, $this->responseMock);
        $this->assertEquals($this->responseMock, $result);
    }
}
