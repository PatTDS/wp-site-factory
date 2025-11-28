<?php
/**
 * Custom Post Types
 *
 * @package {{PROJECT_NAME}}_Plugin
 */

if (!defined('ABSPATH')) {
    exit;
}

class {{PROJECT_NAME_CLASS}}_Post_Types {

    /**
     * Register all post types
     */
    public static function register() {
        self::register_services();
        self::register_projects();
        self::register_team();
        self::register_testimonials();
    }

    /**
     * Register Services post type
     */
    private static function register_services() {
        $labels = [
            'name'               => __('Services', '{{PROJECT_NAME}}-plugin'),
            'singular_name'      => __('Service', '{{PROJECT_NAME}}-plugin'),
            'add_new'            => __('Add New', '{{PROJECT_NAME}}-plugin'),
            'add_new_item'       => __('Add New Service', '{{PROJECT_NAME}}-plugin'),
            'edit_item'          => __('Edit Service', '{{PROJECT_NAME}}-plugin'),
            'new_item'           => __('New Service', '{{PROJECT_NAME}}-plugin'),
            'view_item'          => __('View Service', '{{PROJECT_NAME}}-plugin'),
            'search_items'       => __('Search Services', '{{PROJECT_NAME}}-plugin'),
            'not_found'          => __('No services found', '{{PROJECT_NAME}}-plugin'),
            'not_found_in_trash' => __('No services found in Trash', '{{PROJECT_NAME}}-plugin'),
            'menu_name'          => __('Services', '{{PROJECT_NAME}}-plugin'),
        ];

        $args = [
            'labels'              => $labels,
            'public'              => true,
            'publicly_queryable'  => true,
            'show_ui'             => true,
            'show_in_menu'        => true,
            'query_var'           => true,
            'rewrite'             => ['slug' => 'services', 'with_front' => false],
            'capability_type'     => 'post',
            'has_archive'         => true,
            'hierarchical'        => false,
            'menu_position'       => 5,
            'menu_icon'           => 'dashicons-admin-tools',
            'supports'            => ['title', 'editor', 'thumbnail', 'excerpt', 'page-attributes'],
            'show_in_rest'        => true,
        ];

        register_post_type('{{PROJECT_NAME}}_service', $args);
    }

    /**
     * Register Projects post type
     */
    private static function register_projects() {
        $labels = [
            'name'               => __('Projects', '{{PROJECT_NAME}}-plugin'),
            'singular_name'      => __('Project', '{{PROJECT_NAME}}-plugin'),
            'add_new'            => __('Add New', '{{PROJECT_NAME}}-plugin'),
            'add_new_item'       => __('Add New Project', '{{PROJECT_NAME}}-plugin'),
            'edit_item'          => __('Edit Project', '{{PROJECT_NAME}}-plugin'),
            'new_item'           => __('New Project', '{{PROJECT_NAME}}-plugin'),
            'view_item'          => __('View Project', '{{PROJECT_NAME}}-plugin'),
            'search_items'       => __('Search Projects', '{{PROJECT_NAME}}-plugin'),
            'not_found'          => __('No projects found', '{{PROJECT_NAME}}-plugin'),
            'not_found_in_trash' => __('No projects found in Trash', '{{PROJECT_NAME}}-plugin'),
            'menu_name'          => __('Projects', '{{PROJECT_NAME}}-plugin'),
        ];

        $args = [
            'labels'              => $labels,
            'public'              => true,
            'publicly_queryable'  => true,
            'show_ui'             => true,
            'show_in_menu'        => true,
            'query_var'           => true,
            'rewrite'             => ['slug' => 'projects', 'with_front' => false],
            'capability_type'     => 'post',
            'has_archive'         => true,
            'hierarchical'        => false,
            'menu_position'       => 6,
            'menu_icon'           => 'dashicons-portfolio',
            'supports'            => ['title', 'editor', 'thumbnail', 'excerpt'],
            'show_in_rest'        => true,
        ];

        register_post_type('{{PROJECT_NAME}}_project', $args);
    }

    /**
     * Register Team post type
     */
    private static function register_team() {
        $labels = [
            'name'               => __('Team', '{{PROJECT_NAME}}-plugin'),
            'singular_name'      => __('Team Member', '{{PROJECT_NAME}}-plugin'),
            'add_new'            => __('Add New', '{{PROJECT_NAME}}-plugin'),
            'add_new_item'       => __('Add New Team Member', '{{PROJECT_NAME}}-plugin'),
            'edit_item'          => __('Edit Team Member', '{{PROJECT_NAME}}-plugin'),
            'new_item'           => __('New Team Member', '{{PROJECT_NAME}}-plugin'),
            'view_item'          => __('View Team Member', '{{PROJECT_NAME}}-plugin'),
            'search_items'       => __('Search Team', '{{PROJECT_NAME}}-plugin'),
            'not_found'          => __('No team members found', '{{PROJECT_NAME}}-plugin'),
            'not_found_in_trash' => __('No team members found in Trash', '{{PROJECT_NAME}}-plugin'),
            'menu_name'          => __('Team', '{{PROJECT_NAME}}-plugin'),
        ];

        $args = [
            'labels'              => $labels,
            'public'              => true,
            'publicly_queryable'  => true,
            'show_ui'             => true,
            'show_in_menu'        => true,
            'query_var'           => true,
            'rewrite'             => ['slug' => 'team', 'with_front' => false],
            'capability_type'     => 'post',
            'has_archive'         => false,
            'hierarchical'        => false,
            'menu_position'       => 7,
            'menu_icon'           => 'dashicons-groups',
            'supports'            => ['title', 'editor', 'thumbnail', 'page-attributes'],
            'show_in_rest'        => true,
        ];

        register_post_type('{{PROJECT_NAME}}_team', $args);
    }

    /**
     * Register Testimonials post type
     */
    private static function register_testimonials() {
        $labels = [
            'name'               => __('Testimonials', '{{PROJECT_NAME}}-plugin'),
            'singular_name'      => __('Testimonial', '{{PROJECT_NAME}}-plugin'),
            'add_new'            => __('Add New', '{{PROJECT_NAME}}-plugin'),
            'add_new_item'       => __('Add New Testimonial', '{{PROJECT_NAME}}-plugin'),
            'edit_item'          => __('Edit Testimonial', '{{PROJECT_NAME}}-plugin'),
            'new_item'           => __('New Testimonial', '{{PROJECT_NAME}}-plugin'),
            'view_item'          => __('View Testimonial', '{{PROJECT_NAME}}-plugin'),
            'search_items'       => __('Search Testimonials', '{{PROJECT_NAME}}-plugin'),
            'not_found'          => __('No testimonials found', '{{PROJECT_NAME}}-plugin'),
            'not_found_in_trash' => __('No testimonials found in Trash', '{{PROJECT_NAME}}-plugin'),
            'menu_name'          => __('Testimonials', '{{PROJECT_NAME}}-plugin'),
        ];

        $args = [
            'labels'              => $labels,
            'public'              => false,
            'publicly_queryable'  => false,
            'show_ui'             => true,
            'show_in_menu'        => true,
            'query_var'           => false,
            'capability_type'     => 'post',
            'has_archive'         => false,
            'hierarchical'        => false,
            'menu_position'       => 8,
            'menu_icon'           => 'dashicons-format-quote',
            'supports'            => ['title', 'editor', 'thumbnail'],
            'show_in_rest'        => true,
        ];

        register_post_type('{{PROJECT_NAME}}_testimonial', $args);
    }
}
