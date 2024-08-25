<?php
namespace Shahr\Backend\Helpers;

require __DIR__ . '/../../vendor/autoload.php';

use Aws\S3\S3Client;
use Aws\Exception\AwsException;

class S3Helper {
    private S3Client $s3Client;
    private string $bucketName;

    /**
     * S3Helper constructor.
     * Initializes the S3 client and bucket name from environment variables.
     */
    public function __construct() {
        // Load environment variables
        $dotenv = \Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
        $dotenv->load();

        $this->s3Client = new S3Client([
            'version' => 'latest',
            'region'  => $_ENV['AWS_DEFAULT_REGION'],
            'credentials' => [
                'key'    => $_ENV['AWS_ACCESS_KEY_ID'],
                'secret' => $_ENV['AWS_SECRET_ACCESS_KEY'],
            ]
        ]);
        $this->bucketName = $_ENV['AWS_BUCKET_NAME'];
    }

    /**
     * Upload a file to S3.
     *
     * @param string $filePath
     * @param string $fileName
     * @return string|null
     */
    public function uploadFile(string $filePath, string $fileName): ?string {
        $keyName = 'audio/' . $fileName;
        try {
            $result = $this->s3Client->putObject([
                'Bucket' => $this->bucketName,
                'Key'    => $keyName,
                'SourceFile' => $filePath,
            ]);
            return $result['ObjectURL'];
        } catch (AwsException $e) {
            echo $e->getMessage() . "\n";
            return null;
        }
    }

    /**
     * Upload content directly to S3.
     *
     * @param string $content
     * @param string $fileName
     * @return string|null
     */
    public function uploadFileFromContent(string $content, string $fileName): ?string {
        $keyName = 'audio/' . $fileName;
        try {
            $result = $this->s3Client->putObject([
                'Bucket' => $this->bucketName,
                'Key'    => $keyName,
                'Body'   => $content,
            ]);
            return $result['ObjectURL'];
        } catch (AwsException $e) {
            echo $e->getMessage() . "\n";
            return null;
        }
    }
}
