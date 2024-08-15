<?php

namespace Shahr\Backend\Helpers;

use Mailgun\Mailgun;

class Mailer {
    private Mailgun $mgClient;
    private string $domain;

    /**
     * Mailer constructor.
     * Initializes the Mailgun client and domain from environment variables.
     */
    public function __construct() {
        $this->mgClient = Mailgun::create($_ENV['MAILGUN_API_KEY']);
        $this->domain = $_ENV['MAILGUN_DOMAIN'];
    }

    /**
     * Send an email using Mailgun.
     *
     * @param string $to
     * @param string $subject
     * @param string $body
     * @return bool
     */
    public function send(string $to, string $subject, string $body): bool {
        try {
            $result = $this->mgClient->messages()->send($this->domain, [
                'from'    => $_ENV['FROM_NAME'] . ' <' . $_ENV['FROM_EMAIL'] . '>',
                'to'      => $to,
                'subject' => $subject,
                'html'    => $body,
                'text'    => strip_tags($body)
            ]);
            // Log success message
            error_log('Email sent successfully: ' . print_r($result, true));
            return true;
        } catch (\Exception $e) {
            // Log the error message
            error_log('Email not sent. Error: ' . $e->getMessage());
            return false;
        }
    }
}
