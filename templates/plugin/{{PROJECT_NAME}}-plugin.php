<?php
/**
 * Plugin Name: {{COMPANY_NAME}} Features
 * Plugin URI: https://{{DOMAIN}}
 * Description: Custom post types and functionality for {{COMPANY_NAME}}
 * Version: 1.0.0
 * Author: WPF Generated
 * Author URI: https://{{DOMAIN}}
 * License: GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain: {{PROJECT_NAME}}-plugin
 * Domain Path: /languages
 *
 * @package {{PROJECT_NAME}}_Plugin
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('{{PROJECT_NAME_UPPER}}_PLUGIN_VERSION', '1.0.0');
define('{{PROJECT_NAME_UPPER}}_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('{{PROJECT_NAME_UPPER}}_PLUGIN_URL', plugin_dir_url(__FILE__));
define('{{PROJECT_NAME_UPPER}}_PLUGIN_BASENAME', plugin_basename(__FILE__));

/**
 * Main Plugin Class
 */
class {{PROJECT_NAME_CLASS}}_Plugin {

    /**
     * Instance
     */
    private static $instance = null;

    /**
     * Get instance
     */
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Constructor
     */
    private function __construct() {
        $this->load_dependencies();
        $this->init_hooks();
    }

    /**
     * Load dependencies
     */
    private function load_dependencies() {
        require_once {{PROJECT_NAME_UPPER}}_PLUGIN_DIR . 'includes/post-types.php';
        require_once {{PROJECT_NAME_UPPER}}_PLUGIN_DIR . 'includes/taxonomies.php';
    }

    /**
     * Initialize hooks
     */
    private function init_hooks() {
        add_action('init', [$this, 'load_textdomain']);
        add_action('init', ['{{PROJECT_NAME_CLASS}}_Post_Types', 'register']);
        add_action('init', ['{{PROJECT_NAME_CLASS}}_Taxonomies', 'register']);

        // Activation/Deactivation hooks
        register_activation_hook(__FILE__, [$this, 'activate']);
        register_deactivation_hook(__FILE__, [$this, 'deactivate']);
    }

    /**
     * Load plugin textdomain
     */
    public function load_textdomain() {
        load_plugin_textdomain(
            '{{PROJECT_NAME}}-plugin',
            false,
            dirname({{PROJECT_NAME_UPPER}}_PLUGIN_BASENAME) . '/languages/'
        );
    }

    /**
     * Plugin activation
     */
    public function activate() {
        // Register post types
        {{PROJECT_NAME_CLASS}}_Post_Types::register();
        {{PROJECT_NAME_CLASS}}_Taxonomies::register();

        // Flush rewrite rules
        flush_rewrite_rules();

        // Set version
        update_option('{{PROJECT_NAME}}_plugin_version', {{PROJECT_NAME_UPPER}}_PLUGIN_VERSION);
    }

    /**
     * Plugin deactivation
     */
    public function deactivate() {
        flush_rewrite_rules();
    }
}

// Initialize plugin
function {{PROJECT_NAME}}_plugin() {
    return {{PROJECT_NAME_CLASS}}_Plugin::get_instance();
}

// Start the plugin
add_action('plugins_loaded', '{{PROJECT_NAME}}_plugin');
