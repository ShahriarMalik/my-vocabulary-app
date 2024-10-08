<?php
namespace Shahr\Backend\Helpers;

require __DIR__ . '/../../vendor/autoload.php';

use Google\Cloud\TextToSpeech\V1\TextToSpeechClient;
use Google\Cloud\TextToSpeech\V1\AudioConfig;
use Google\Cloud\TextToSpeech\V1\AudioEncoding;
use Google\Cloud\TextToSpeech\V1\SynthesisInput;
use Google\Cloud\TextToSpeech\V1\VoiceSelectionParams;
use Google\Cloud\TextToSpeech\V1\SsmlVoiceGender;

class WordDataHelper {
    /**
     * Fetch translations for a given word using the DeepL API.
     *
     * @param string $word
     * @return array
     */
    public static function fetchTranslations(string $word): array {
        try {
            $deeplAuthKey = $_ENV['DEEPL_AUTH_KEY'];
            $url = 'https://api-free.deepl.com/v2/translate';

            $data = [
                'text' => [$word],
                'target_lang' => 'EN',
                'source_lang' => 'DE'
            ];

            $options = [
                CURLOPT_URL => $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_HTTPHEADER => [
                    "Authorization: DeepL-Auth-Key $deeplAuthKey",
                    'Content-Type: application/json'
                ],
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => json_encode($data)
            ];

            $ch = curl_init();
            curl_setopt_array($ch, $options);

            $response = curl_exec($ch);

            if (curl_errno($ch)) {
                $error_msg = curl_error($ch);
                curl_close($ch);
                throw new \Exception("cURL error: $error_msg");
            }

            curl_close($ch);

            // Log the response for debugging
            // file_put_contents(__DIR__ . '/../../public/fetchTranslations_debug.txt', 'Response: ' . $response);

            $result = json_decode($response, true);

            if (isset($result['translations']) && is_array($result['translations'])) {
                return array_map(function ($translation) {
                    return $translation['text'];
                }, $result['translations']);
            }

            return [];
        } catch (\Exception $e) {
           // file_put_contents(__DIR__ . '/../../fetchTranslations_debug.txt', 'Error: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Fetch an emoji related to a given word using the Emoji API.
     *
     * @param string $word
     * @return string
     */
    public static function fetchEmoji(string $word): string {
        try {
            $url = "https://emoji-api.com/emojis?search=" . urlencode($word) . "&access_key=" . $_ENV['EMOJI_API_KEY'];
//
//            $options = [
//                CURLOPT_URL => $url,
//                CURLOPT_RETURNTRANSFER => true,
//                CURLOPT_HTTPHEADER => [
//                    'Content-Type: application/json'
//                ],
//            ];
//
//            $ch = curl_init();
//            curl_setopt_array($ch, $options);
//
//            $response = curl_exec($ch);
//
//            if (curl_errno($ch)) {
//                $error_msg = curl_error($ch);
//                curl_close($ch);
//                throw new \Exception("cURL error: $error_msg");
//            }
//
//            curl_close($ch);
//
//            $result = json_decode($response, true);
//
//            if (isset($result[0]['character'])) {
//                return $result[0]['character'];
//            }
//
            return "";
        } catch (\Exception $e) {
            file_put_contents(__DIR__ . '/../../fetchEmoji_debug.txt', 'Error: ' . $e->getMessage());
            return "";
        }
    }

    /**
     * Fetch the pronunciation URL for a given word using Google Cloud Text-to-Speech and upload it to S3.
     *
     * @param string $word
     * @return string|null
     */
    public static function fetchPronunciationUrl(string $word): ?string {
        try {
            // Set the path to the Google Cloud credentials file in the root folder
            putenv('GOOGLE_APPLICATION_CREDENTIALS=' . __DIR__ . '/../../fluent-justice-431711-m6-3d4644e99857.json');

            // Initialize the TextToSpeechClient
            $client = new TextToSpeechClient();
            $input = new SynthesisInput();
            $input->setText($word);

            // Set voice parameters
            $voice = new VoiceSelectionParams();
            $voice->setLanguageCode('de-DE');
            $voice->setSsmlGender(SsmlVoiceGender::NEUTRAL);

            // Configure audio output format
            $audioConfig = new AudioConfig();
            $audioConfig->setAudioEncoding(AudioEncoding::MP3);

            // Generate the speech synthesis response
            $response = $client->synthesizeSpeech($input, $voice, $audioConfig);

            // Upload audio content directly to S3 without saving locally
            $s3Helper = new S3Helper();
            $s3Url = $s3Helper->uploadFileFromContent($response->getAudioContent(), $word . '.mp3');

            return $s3Url;
        } catch (\Exception $e) {
            // Log any errors that occur
            // file_put_contents(__DIR__ . '/../../public/fetchPronunciationUrl_debug.txt', 'Error: ' . $e->getMessage());
            return null;
        }
    }

}
