<?php
/**
 * WP Mail SMTP Configuration Template
 * Configures email sending for WordPress
 *
 * Variables loaded from .wpf-config:
 *   COMPANY_NAME, DOMAIN, SMTP_*
 *
 * Usage: wp eval-file configure-wp-mail-smtp.php
 */

// Load WordPress
require_once(__DIR__ . '/../wp-load.php');

// Security check
if (!defined('ABSPATH')) {
    die('Direct access not permitted');
}

if (php_sapi_name() !== 'cli' && !current_user_can('manage_options')) {
    die('Access denied. Administrator permissions required.');
}

echo "Configuring WP Mail SMTP...\n\n";

$results = [];

// Email configuration
$from_email = '{{SMTP_FROM_EMAIL}}';
$from_name = '{{COMPANY_NAME}}';
$mailer = '{{SMTP_MAILER}}';

// Default to PHP mail if placeholder
if (strpos($from_email, '{{') !== false) {
    $from_email = 'noreply@{{DOMAIN}}';
}
if (strpos($from_name, '{{') !== false) {
    $from_name = '{{PROJECT_NAME}}';
}
if (strpos($mailer, '{{') !== false || empty($mailer)) {
    $mailer = 'mail';
}

// Still placeholders? Use WordPress defaults
if (strpos($from_email, '{{') !== false) {
    $from_email = get_option('admin_email');
}
if (strpos($from_name, '{{') !== false) {
    $from_name = get_bloginfo('name');
}

echo "From Email: {$from_email}\n";
echo "From Name: {$from_name}\n";
echo "Mailer: {$mailer}\n";

// Build SMTP configuration
$smtp_config = [
    'mail' => [
        'from_email' => $from_email,
        'from_name' => $from_name,
        'mailer' => $mailer,
        'return_path' => true,
    ],
];

// Add SMTP settings if using SMTP mailer
if ($mailer === 'smtp') {
    $smtp_host = '{{SMTP_HOST}}';
    $smtp_port = '{{SMTP_PORT}}';
    $smtp_user = '{{SMTP_USER}}';
    $smtp_pass = '{{SMTP_PASS}}';
    $smtp_encryption = '{{SMTP_ENCRYPTION}}';

    // Only configure if not placeholders
    if (strpos($smtp_host, '{{') === false) {
        $smtp_config['smtp'] = [
            'host' => $smtp_host,
            'port' => (int)$smtp_port ?: 587,
            'encryption' => $smtp_encryption ?: 'tls',
            'auth' => true,
            'user' => $smtp_user,
            'pass' => $smtp_pass,
            'autotls' => true,
        ];
        $results[] = "SMTP Host: {$smtp_host}:{$smtp_port}";
        $results[] = "SMTP Encryption: {$smtp_encryption}";
    }
}

// Save configuration
update_option('wp_mail_smtp', $smtp_config);
$results[] = "From Email: {$from_email}";
$results[] = "From Name: {$from_name}";
$results[] = "Mailer: {$mailer}";

// Test email functionality
echo "Testing email delivery...\n";

$test_email = get_option('admin_email');
$test_subject = 'WPF SMTP Test - ' . date('Y-m-d H:i:s');
$test_message = "This is a test email from WPF (WordPress Site Factory).\n\n";
$test_message .= "If you received this email, your SMTP configuration is working correctly.\n\n";
$test_message .= "Configuration:\n";
$test_message .= "- From: {$from_name} <{$from_email}>\n";
$test_message .= "- Mailer: {$mailer}\n";
$test_message .= "- Time: " . date('Y-m-d H:i:s') . "\n";

$test_result = wp_mail($test_email, $test_subject, $test_message);

if ($test_result) {
    $results[] = "Test Email: Sent successfully to {$test_email}";
} else {
    $results[] = "Test Email: FAILED - check error log";
    global $phpmailer;
    if (isset($phpmailer) && $phpmailer->ErrorInfo) {
        $results[] = "Error: " . $phpmailer->ErrorInfo;
    }
}

// Display Results
echo "\n" . str_repeat('=', 60) . "\n";
echo "WP MAIL SMTP CONFIGURATION COMPLETE\n";
echo str_repeat('=', 60) . "\n\n";

foreach ($results as $result) {
    echo "  " . $result . "\n";
}

echo "\n" . str_repeat('=', 60) . "\n";
echo "Configuration Summary:\n";
echo str_repeat('=', 60) . "\n";
echo "  From Email: {$from_email}\n";
echo "  From Name: {$from_name}\n";
echo "  Mailer: {$mailer}\n";
echo "\n";

if ($mailer === 'mail') {
    echo "Note: Using PHP mail() function.\n";
    echo "For production, consider using SMTP for better deliverability.\n";
    echo "\n";
    echo "Add to .wpf-config:\n";
    echo "  SMTP_MAILER=\"smtp\"\n";
    echo "  SMTP_HOST=\"smtp.example.com\"\n";
    echo "  SMTP_PORT=\"587\"\n";
    echo "  SMTP_USER=\"your-email@example.com\"\n";
    echo "  SMTP_PASS=\"your-password\"\n";
    echo "  SMTP_ENCRYPTION=\"tls\"\n";
}

echo "\n";
echo "Done! WP Mail SMTP is now configured.\n";
