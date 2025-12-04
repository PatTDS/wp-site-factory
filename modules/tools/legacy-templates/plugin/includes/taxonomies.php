<?php
/**
 * Custom Taxonomies
 *
 * @package {{PROJECT_NAME}}_Plugin
 */

if (!defined('ABSPATH')) {
    exit;
}

class {{PROJECT_NAME_CLASS}}_Taxonomies {

    /**
     * Register all taxonomies
     */
    public static function register() {
        self::register_service_category();
        self::register_project_type();
    }

    /**
     * Register Service Category taxonomy
     */
    private static function register_service_category() {
        $labels = [
            'name'              => __('Service Categories', '{{PROJECT_NAME}}-plugin'),
            'singular_name'     => __('Service Category', '{{PROJECT_NAME}}-plugin'),
            'search_items'      => __('Search Categories', '{{PROJECT_NAME}}-plugin'),
            'all_items'         => __('All Categories', '{{PROJECT_NAME}}-plugin'),
            'parent_item'       => __('Parent Category', '{{PROJECT_NAME}}-plugin'),
            'parent_item_colon' => __('Parent Category:', '{{PROJECT_NAME}}-plugin'),
            'edit_item'         => __('Edit Category', '{{PROJECT_NAME}}-plugin'),
            'update_item'       => __('Update Category', '{{PROJECT_NAME}}-plugin'),
            'add_new_item'      => __('Add New Category', '{{PROJECT_NAME}}-plugin'),
            'new_item_name'     => __('New Category Name', '{{PROJECT_NAME}}-plugin'),
            'menu_name'         => __('Categories', '{{PROJECT_NAME}}-plugin'),
        ];

        $args = [
            'labels'            => $labels,
            'hierarchical'      => true,
            'public'            => true,
            'show_ui'           => true,
            'show_admin_column' => true,
            'show_in_nav_menus' => true,
            'show_tagcloud'     => false,
            'show_in_rest'      => true,
            'rewrite'           => ['slug' => 'service-category', 'with_front' => false],
        ];

        register_taxonomy('{{PROJECT_NAME}}_service_cat', ['{{PROJECT_NAME}}_service'], $args);
    }

    /**
     * Register Project Type taxonomy
     */
    private static function register_project_type() {
        $labels = [
            'name'              => __('Project Types', '{{PROJECT_NAME}}-plugin'),
            'singular_name'     => __('Project Type', '{{PROJECT_NAME}}-plugin'),
            'search_items'      => __('Search Types', '{{PROJECT_NAME}}-plugin'),
            'all_items'         => __('All Types', '{{PROJECT_NAME}}-plugin'),
            'parent_item'       => __('Parent Type', '{{PROJECT_NAME}}-plugin'),
            'parent_item_colon' => __('Parent Type:', '{{PROJECT_NAME}}-plugin'),
            'edit_item'         => __('Edit Type', '{{PROJECT_NAME}}-plugin'),
            'update_item'       => __('Update Type', '{{PROJECT_NAME}}-plugin'),
            'add_new_item'      => __('Add New Type', '{{PROJECT_NAME}}-plugin'),
            'new_item_name'     => __('New Type Name', '{{PROJECT_NAME}}-plugin'),
            'menu_name'         => __('Types', '{{PROJECT_NAME}}-plugin'),
        ];

        $args = [
            'labels'            => $labels,
            'hierarchical'      => true,
            'public'            => true,
            'show_ui'           => true,
            'show_admin_column' => true,
            'show_in_nav_menus' => true,
            'show_tagcloud'     => false,
            'show_in_rest'      => true,
            'rewrite'           => ['slug' => 'project-type', 'with_front' => false],
        ];

        register_taxonomy('{{PROJECT_NAME}}_project_type', ['{{PROJECT_NAME}}_project'], $args);
    }
}
